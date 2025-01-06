import "ol/ol.css"; // Import OpenLayers CSS
import TileLayer from "ol/layer/Tile"; // Import the TileLayer class
import { TileWMS } from "ol/source"; // Import TileWMS source

// Service dictionary containing service configurations
let serviceDict = {
  awifs_fcc: {
    datasetId: "T0S1P1",
    r_index: 3,
    g_index: 2,
    b_index: 1,
    r_max: 0.3,
    g_max: 0.3,
    b_max: 0.3,
    r_min: 0.001,
    g_min: 0.001,
    b_min: 0.001,
    serverUrl: "https://vedas.sac.gov.in/vapi/ridam_server3/wms/",
    getLayer: buildRGBMapLayer,
  },
  sentinel2_fcc: {
    datasetId: "T0S1P0",
    r_index: 8,
    g_index: 4,
    b_index: 3,
    r_max: 6000,
    g_max: 4000,
    b_max: 4000,
    r_min: 0,
    g_min: 0,
    b_min: 0,
    serverUrl: "https://vedas.sac.gov.in/vapi/ridam_server2/wms/",
    getLayer: buildRGBMapLayer,
  },
  sentinel2_ndvi: {
    datasetId: "T3S1P1",
    style: "[0:FFFFFF00:1:f0ebecFF:25:d8c4b6FF:50:ab8a75FF:75:917732FF:100:70ab06FF:125:459200FF:150:267b01FF:175:0a6701FF:200:004800FF:255:001901FF];nodata:FFFFFF00",
    serverUrl: "https://vedas.sac.gov.in/vapi/ridam_server3/wms/",
    getLayer: buildMapLayer,
  },
};

// Base URL for fetching timestamps
let dateURL = "https://vedas.sac.gov.in/ridam_server3/meta/dataset_timestamp?prefix=";

// Helper function to sort an array of dates in descending order
async function sortDateArray(arr) {
  return arr.sort((a, b) => parseInt(b.val) - parseInt(a.val));
}

// Helper function to format date strings into a readable format
async function formatDates(data, splitOn, dateAtIndex) {
  let processedData = data.map((dtTime) => {
    let splittedDt = dtTime.split(splitOn);
    let requiredData = splittedDt[parseInt(dateAtIndex)];

    let year = requiredData.substring(0, 4);
    let month = requiredData.substring(4, 6);
    let dt = requiredData.substring(6, 8);

    requiredData = year + month + dt;
    let label = `${year}-${month}-${dt}`;

    return { lbl: label, val: requiredData };
  });

  let sortedData = await sortDateArray(processedData);
  return sortedData;
}

// Helper function to fetch data from a URL
async function getAsyncData(url) {
  console.log("Fetching URL:", url);
  let response = await fetch(url);
  let res = await response.json();
  return res;
}

// Fetch and process timestamps for a given service
async function getTimestamp(serviceName) {
  let serviceConfig = serviceDict[serviceName];
  let serviceDatasetId = serviceConfig.datasetId;
  let date_url = `${dateURL}${serviceDatasetId}`;
  let res = await getAsyncData(date_url);
  res = res["result"][serviceDatasetId];
  console.log("Timestamp response:", res);
  let processedData = await formatDates(res, " ", 0);
  console.log("Processed timestamp data:", processedData);
  return processedData;
}

// Function to build a VAPI layer
function buildVAPILayer(obj) {
  let serviceConfig = serviceDict[obj.serviceName];
  return serviceConfig.getLayer(obj);
}

// Function to build an RGB map layer
function buildRGBMapLayer(obj) {
  let serviceConfig = serviceDict[obj.serviceName];
  return new TileLayer({
    source: new TileWMS({
      projection: "EPSG:4326",
      url: serviceConfig.serverUrl,
      params: {
        name: "RDSGrdient",
        layers: "T0S0M1",
        PROJECTION: "EPSG:4326",
        ARGS: `r_dataset_id:${serviceConfig.datasetId};g_dataset_id:${serviceConfig.datasetId};b_dataset_id:${serviceConfig.datasetId};r_from_time:${obj.from_time};r_to_time:${obj.to_time};g_from_time:${obj.from_time};g_to_time:${obj.to_time};b_from_time:${obj.from_time};b_to_time:${obj.to_time};r_index:${serviceConfig.r_index};g_index:${serviceConfig.g_index};b_index:${serviceConfig.b_index};r_max:${serviceConfig.r_max};g_max:${serviceConfig.g_max};b_max:${serviceConfig.b_max};r_min:${serviceConfig.r_min};g_min:${serviceConfig.g_min};b_min:${serviceConfig.b_min}`,
        LEGEND_OPTIONS: "columnHeight:400;height:100",
        "X-API-KEY": obj.key,
      },
    }),
    opacity: 1,
    zIndex: 1,
  });
}

// Function to build a generic map layer
function buildMapLayer(obj) {
  let serviceConfig = serviceDict[obj.serviceName];
  return new TileLayer({
    source: new TileWMS({
      projection: "EPSG:4326",
      url: serviceConfig.serverUrl,
      params: {
        name: "RDSGrdient",
        layers: "T0S0M0",
        PROJECTION: "EPSG:4326",
        ARGS: `merge_method:max;dataset_id:${serviceConfig.datasetId};from_time:${obj.from_time};to_time:${obj.to_time};indexes:1`,
        styles: serviceConfig.style,
        LEGEND_OPTIONS: "columnHeight:400;height:100",
        "X-API-KEY": obj.key,
      },
    }),
    opacity: 1,
    zIndex: 1,
  });
}

// Function to fetch VAPI chart data for a point
async function getVAPIChartData(lon, lat, key) {
  let bodyArgs = {
    dataset_id: "T3S1P1",
    filter_nodata: "no",
    lon,
    lat,
    indexes: [1],
    from_time: "19700101",
    to_time: "20300615",
    composite: false,
  };

  let res = await fetch(
    `https://vedas.sac.gov.in/vapi/ridam_server3/info/?X-API-KEY=${key}`,
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        layer: "T0S0I0",
        args: bodyArgs,
      }),
      method: "POST",
    }
  );

  let result = await res.json();
  let data = result["result"];
  console.log("Chart data:", data);
  return data;
}

// Helper function to process chart data
function processChartData(data) {
  return data.map((x) => {
    let dt = new Date(x[0]);
    let timeStamp = dt.getTime();
    let val = x[1][0];
    return [timeStamp, val];
  });
}

// Helper function to process polygon chart data
function processPolygonChartData(data) {
  return data.map((x) => {
    let timeStamp = yyyymmddToUnixTimestamp(x[0]);
    let val = x[1];
    return [timeStamp, val];
  });
}

// Convert yyyymmdd date to Unix timestamp
function yyyymmddToUnixTimestamp(yyyymmdd) {
  const year = parseInt(yyyymmdd.substring(0, 4), 10);
  const month = parseInt(yyyymmdd.substring(4, 6), 10) - 1; // Months are 0-indexed
  const day = parseInt(yyyymmdd.substring(6), 10);

  const date = new Date(year, month, day);
  return Math.floor(date.getTime());
}

// Function to fetch VAPI polygon chart data
async function getVAPIPolygonChartData(coord, key) {
  console.log("Coordinates:", coord[0]);
  let res = await fetch(
    `https://vedas.sac.gov.in/vapi/ridam_server3/info/?X-API-KEY=${key}`,
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        layer: "T0S0I1",
        args: {
          dataset_id: "T3S1P1",
          filter_nodata: "no",
          polygon: coord,
          indexes: [1],
          from_time: "20230601",
          to_time: "20240615",
          interval: 10,
          merge_method: "max",
        },
      }),
      method: "POST",
    }
  );

  let result = await res.json();
  let data = result["result"];
  return data;
}

// Export functions for use in React
export {
  getTimestamp,
  buildVAPILayer,
  buildRGBMapLayer,
  buildMapLayer,
  getVAPIChartData,
  processChartData,
  processPolygonChartData,
  getVAPIPolygonChartData,
};
