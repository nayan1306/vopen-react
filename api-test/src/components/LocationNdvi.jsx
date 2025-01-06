import { useEffect, useState } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import "./LocationNdvi.css"; // Add your custom styles
import { Map, View } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import { buildVAPILayer, getVAPIChartData, processChartData, getTimestamp } from "../../public/js/lib/vapi-0.3"; // Update the path if needed
import Highcharts from "highcharts";

const LocationNdvi = () => {
  const [map, setMap] = useState(null);
  const [ridamLayer, setRidamLayer] = useState(null);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [chart, setChart] = useState(null); // Highcharts chart reference
  const [loadingChart, setLoadingChart] = useState(false); // Loading state for chart
  const apiKey = "O6VVexshWMmZ5ajIS2U42g"; // Your API key
  const [datesArray, setDatesArray] = useState([]); // Store dates for dropdown

  // Fetch timestamps for dropdowns
  useEffect(() => {
    getTimestamp("sentinel2_ndvi") // Replace this function with your actual timestamp fetching logic
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
        center: [65.9629, 27.5937],
        zoom: 4.5,
        padding: [0, window.innerWidth < 1024 ? 0 : 700, 0, 0],

      }),
    });

    setMap(initialMap);

    // Add event listener for map click
    const handleClick = (evt) => {
      handleMapClick(evt);
    };

    initialMap.on("click", handleClick);

    // Clean up on unmount or when map is updated
    return () => {
      initialMap.un("click", handleClick);
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
      setRidamLayer(newLayer); // Updating ridamLayer triggers re-render, but won't cause a loop
    }
  }, [map, fromTime, toTime]); // Removed ridamLayer from dependency array
  

  // Handle map click to show modal and chart
  const handleMapClick = async (evt) => {
    openModal(); // Open modal for chart
    const lon = evt.coordinate[0];
    const lat = evt.coordinate[1];
    let series = [];

    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
      setLoadingChart(true); // Show loading spinner
    }

    // Fetch chart data based on location
    const res = await getVAPIChartData(lon, lat, apiKey);
    const processedData = processChartData(res);
    series.push({ name: "Sentinel-2 NDVI", data: processedData, connectNulls: true });

    // Highcharts config object
    const highChartObj = returnHighChartObj({
      series,
      locInfo: "",
      format: "{value:%d-%b-%Y}",
      yAxisTitle: "mean",
    });

    // Create or update the chart
    if (highChartObj) {
      setLoadingChart(false); // Hide loading spinner
      setChart(Highcharts.chart("chart-container", highChartObj));
    }
  };

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

export default LocationNdvi;
