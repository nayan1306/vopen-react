import { useEffect, useState } from "react";
import "ol/ol.css"; // Import OpenLayers CSS
import "./MapComponent.css"; // Add your custom styles
import { Map, View } from "ol";
import ImageLayer from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
import { getTimestamp, buildVAPILayer } from "../../public/js/lib/vapi-0.3";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [ridamLayer, setRidamLayer] = useState(null);
  const [serviceName, setServiceName] = useState("awifs_fcc");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [datesArray, setDatesArray] = useState([]);
  const apiKey = "O6VVexshWMmZ5ajIS2U42g";

  

  // Fetch timestamps and initialize dropdowns
  useEffect(() => {
    getTimestamp(serviceName)
      .then((data) => {
        setDatesArray(data);
        if (data.length > 0) {
          setFromTime(data[5].val);
          setToTime(data[0].val);
        }
      })
      .catch((err) => {
        console.error("Error fetching timestamps:", err);
      });
  }, [serviceName]);

  // Initialize OpenLayers Map
  useEffect(() => {
    const initialMap = new Map({
      target: "map",
      layers: [
        new ImageLayer({
          source: new ImageWMS({
            url: "https://vedas.sac.gov.in/drought_monitoring_wms/wms?",
            params: { LAYERS: "cite:india_state", VERSION: "1.1.1" },
            serverType: "geoserver",
          }),
          visible: true,
        }),
      ],
      view: new View({
        projection: "EPSG:4326",
        center: [80.9629, 21.5937],
        zoom: 4.5,
      }),
    });

    setMap(initialMap);
    return () => initialMap.setTarget(null);
  }, []);

  // Update the map layer when inputs change
  useEffect(() => {
    if (map && fromTime && toTime) {
      if (ridamLayer) map.removeLayer(ridamLayer);

      const newLayer = buildVAPILayer({
        serviceName,
        key: apiKey,
        from_time: fromTime,
        to_time: toTime,
      });

      map.addLayer(newLayer);
      setRidamLayer(newLayer);
    }
  }, [map, serviceName, fromTime, toTime]);

  return (
    <div>
      <div className="menu">
        <label>Service Name:</label>
        <select
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        >
          <option value="awifs_fcc">AWiFS FCC</option>
          <option value="sentinel2_fcc">Sentinel-2 FCC</option>
          <option value="sentinel2_ndvi">Sentinel-2 NDVI</option>
        </select>

        <label>From Date:</label>
        <select
          value={fromTime}
          onChange={(e) => setFromTime(e.target.value)}
        >
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
    </div>
  );
};

export default MapComponent;
