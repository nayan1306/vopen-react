import { useEffect, useState } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import "./PolygonNdvi.css"; // Custom styles
import { Map, View } from "ol";
import { Image as ImageLayer } from "ol/layer"; // Ensure this is imported correctly
import ImageWMS from "ol/source/ImageWMS";
import { buildVAPILayer, getVAPIChartData, processChartData, getTimestamp } from "../../public/js/lib/vapi-0.3"; // Update path if needed
import Highcharts from "highcharts";
import { Draw } from "ol/interaction"; // Import Draw interaction for polygon drawing
import VectorLayer from "ol/layer/Vector"; // Layer for drawn polygons
import VectorSource from "ol/source/Vector"; // Source for vector layer
import { Style, Stroke, Fill } from "ol/style"; // For styling polygons
import { GeoJSON } from "ol/format"; // For GeoJSON formatting

import ReactMarkdown from "react-markdown"; // Import react-markdown
import polymarkdown from './polymarkdown.md?raw'; 

const PolygonNdvi = () => {
  const [map, setMap] = useState(null);
  const [ridamLayer, setRidamLayer] = useState(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [chart, setChart] = useState(null); // Highcharts chart reference
  const [loadingChart, setLoadingChart] = useState(false); // Loading state for chart
  const apiKey = import.meta.env.VITE_API_KEY;
  const [datesArray, setDatesArray] = useState([]); // Store dates for dropdown

  // Fetch timestamps for dropdowns
  useEffect(() => {
    getTimestamp("sentinel2_ndvi") // Replace this with your actual timestamp fetching logic
      .then((data) => {
        setDatesArray(data);
        if (data.length > 0) {
          setFromTime(data[5].val); // Default from time
          setToTime(data[0].val); // Default to time
        }
      })
      .catch((err) => {
        console.error("Error fetching timestamps:", err);
      });
  }, []);

  // Initialize OpenLayers map
  useEffect(() => {
    const layers = {
      state_layer: new ImageLayer({
        source: new ImageWMS({
          url: "https://vedas.sac.gov.in/drought_monitoring_wms/wms?",
          params: { LAYERS: "cite:india_state", VERSION: "1.1.1" },
          serverType: "geoserver",
        }),
        visible: true,
        zIndex: 3,
      }),
    };

    const initialMap = new Map({
      target: "map",
      layers: [layers.state_layer],
      view: new View({
        projection: "EPSG:4326",
        center: [80.9629, 21.5937],
        zoom: 4.5,
      }),
    });

    setMap(initialMap);

    // Clean up on unmount
    return () => {
      initialMap.setTarget(null); // Clean up
    };
  }, []);

  // Add the layer to the map
  useEffect(() => {
    if (map && fromTime && toTime) {
      if (ridamLayer) {
        map.removeLayer(ridamLayer);
      }
      const newLayer = buildVAPILayer({
        serviceName: "sentinel2_ndvi",
        key: apiKey,
        from_time: fromTime,
        to_time: toTime,
      });
      map.addLayer(newLayer);
      setRidamLayer(newLayer); // Set ridamLayer after adding
    }
  }, [map, fromTime, toTime]);

  // Draw polygon on map
  useEffect(() => {
    if (!map) return;

    const drawSource = new VectorSource();
    const drawLayer = new VectorLayer({
      source: drawSource,
      style: new Style({
        stroke: new Stroke({
          color: "blue",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.2)",
        }),
      }),
    });

    map.addLayer(drawLayer);

    const draw = new Draw({
      source: drawSource,
      type: "Polygon",
    });

    map.addInteraction(draw);

    draw.on("drawend", async (e) => {
      const geojson = new GeoJSON().writeFeature(e.feature);
      const feature = JSON.parse(geojson);
      const coordinates = feature.geometry.coordinates[0];

      openModal(); // Open modal for chart

      // Fetch chart data based on polygon coordinates
      if (chart) {
        chart.destroy();
        setLoadingChart(true); // Show loading spinner
      }

      const res = await getVAPIChartData(coordinates, apiKey);
      const processedData = processChartData(res);
      const series = [{ name: "Sentinel-2 NDVI", data: processedData, connectNulls: true }];

      const highChartObj = returnHighChartObj({
        series,
        locInfo: "Polygon NDVI Data",
        format: "{value:%d-%b-%Y}",
        yAxisTitle: "NDVI",
      });

      if (highChartObj) {
        setLoadingChart(false); // Hide loading spinner
        setChart(Highcharts.chart("chart-container", highChartObj));
      }
    });

    // Clean up draw interaction when component is unmounted
    return () => {
      map.removeInteraction(draw);
    };
  }, [map, chart]);

  // Open modal
  const openModal = () => {
    document.getElementById("myModal").style.display = "block";
  };

  // Close modal
  const closeModal = () => {
    document.getElementById("myModal").style.display = "none";
  };

  // Highcharts configuration function
  const returnHighChartObj = (obj) => {
    return {
      title: {
        text: obj.locInfo,
      },
      xAxis: {
        type: "datetime",
        labels: {
          format: obj.format,
        },
        title: {
          text: "Date",
        },
      },
      yAxis: {
        title: {
          text: obj.yAxisTitle,
        },
      },
      series: obj.series,
    };
  };

  return (
    <div>
      <div className="menu">
        <label>From Date:</label>
        <select value={fromTime} onChange={(e) => setFromTime(e.target.value)}>
          {datesArray.map((date) => (
            <option key={date.val} value={date.val}>
              {date.lbl}
            </option>
          ))}
        </select>

        <label>To Date:</label>
        <select value={toTime} onChange={(e) => setToTime(e.target.value)}>
          {datesArray.map((date) => (
            <option key={date.val} value={date.val}>
              {date.lbl}
            </option>
          ))}
        </select>
      </div>

      <div id="map" className="map"></div>
      <div className="markdown-content">
                    <ReactMarkdown>{polymarkdown}</ReactMarkdown>
                  </div>

      <div id="myModal" className="my-modal">
        <span className="close-button" onClick={closeModal}>
          ×
        </span>
        <div id="chart-container"></div>
        <div style={{ display: loadingChart ? "block" : "none" }} id="loading-chart">
          <img src="static/img/loading.gif" alt="Loading" />
        </div>
      </div>
    </div>
  );
};

export default PolygonNdvi;
