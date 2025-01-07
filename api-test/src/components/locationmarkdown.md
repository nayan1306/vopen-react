### How to Interact with the Map and Retrieve Data

Our platform allows you to interact with the map and retrieve satellite data for a specific location. This guide explains how to click on the map to obtain chart data for a given location, as well as how to use the VAPI functions to generate data layers and fetch NDVI data.

---

## **1. Interact with the Map**

To get started, simply click on the map to select a location. Once you click, the system will capture the geographic coordinates (longitude and latitude) of the point you clicked. After selecting a location, the following steps will guide you to retrieve satellite data for that area.

### **Steps to Interact with the Map:**

1. **Click on a location on the map.**  
   When you click, the map will record the longitude and latitude of the point you clicked.
   
2. **Automatically capture the coordinates.**  
   The longitude and latitude values are captured and passed to the `getVAPIChartData` function to retrieve relevant data for the selected location.

3. **Display the retrieved data.**  
   Once the data is fetched, you can visualize the results (e.g., through a chart) or use the data for further analysis.

---

## **2. Retrieve Data for the Location**

Once the coordinates are captured by clicking on the map, you can use the following VAPI functions to retrieve and visualize data.

### ```buildVAPILayer(options)```

**Description:**  
This function generates a data layer for a specific service and time range. You can create customized layers for your application based on satellite imagery data.

- **Parameters:**
  - `serviceName` (string): The name of the service. Valid options are:
    - `"awifs_fcc"`
    - `"sentinel2_fcc"`
    - `"sentinel2_ndvi"`
  - `key` (string): Your API key.
  - `from_time` (string): Start date for the data in `YYYYMMDD` format.
  - `to_time` (string): End date for the data in `YYYYMMDD` format.

- **Returns:**  
A data layer object that you can use to visualize or analyze the data.

#### **Example Usage:**

```javascript
const layer = buildVAPILayer({
  serviceName: "sentinel2_fcc",
  key: apiKey,
  from_time: "20240101",
  to_time: "20240110"
});

console.log(layer);
```

### `getVAPIChartData(lon, lat, apiKey)`

**Description:**  
Retrieves available data for a given longitude and latitude of Sentinel-2 NDVI.

**Parameters:**
- `longitude` (string): Longitude of a location.
- `latitude` (string): Latitude of a location.
- `key` (string): Your API key.

**Returns:**  
An array of available data for a given longitude and latitude of Sentinel-2 NDVI.

---

**Example:**

```javascript
const result = getVAPIChartData('76.55610923186507', '23.50916244868403', apiKey);
console.log(result);
