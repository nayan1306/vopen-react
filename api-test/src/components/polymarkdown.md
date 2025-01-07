### Geospatial Services Overview

Our platform provides a comprehensive suite of geospatial services, delivering high-quality satellite imagery and derived products through Web Map Service (WMS) interfaces. These services are designed to empower researchers, developers, and analysts with precise geospatial insights for diverse applications.

---
### **How to Draw a Polygon and View the NDVI Chart Profile**

Our API allows you to draw a polygon on the map and retrieve the NDVI chart profile for that region. This feature is designed to help users analyze vegetation health and other geospatial data for specific areas by selecting them directly on the map.

---

## **Steps to Draw a Polygon and Retrieve NDVI Data**

1. **Draw a Polygon on the Map**  
   To get started, use the map's drawing tool to select a region by drawing a polygon around the area you want to analyze. The system will capture the coordinates of the drawn polygon.

2. **Send Polygon Coordinates to Retrieve Data**  
   After drawing the polygon, the coordinates are captured and passed to the `getVAPIPolygonChartData` function, which will retrieve NDVI data for the selected area.

3. **Display the NDVI Chart**  
   Once the data is retrieved, you can visualize the NDVI chart profile for the selected polygon, allowing for detailed analysis of vegetation health and other factors in that region.

---

## **VAPI Functions**


### `buildVAPILayer(options)`

**Description:**  
Generates a data layer for a specified service and time range.

**Parameters:**

- `options` (object): A configuration object with the following keys:
  - `serviceName` (string): The name of the service. Must be one of the following:
    - `"awifs_fcc"`
    - `"sentinel2_fcc"`
    - `"sentinel2_ndvi"`
  - `key` (string): Your API key.
  - `from_time` (string): Start date for the data, in `YYYYMMDD` format.
  - `to_time` (string): End date for the data, in `YYYYMMDD` format.

**Returns:**  
A data layer object.

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


---


### `getVAPIPolygonChartData(polygon_coord, apiKey)`

**Description:**  
Retrieves available data for a drawn polygon of Sentinel-2 NDVI.

**Parameters:**
- `polygon_coord` (array): A two-dimensional array of polygon coordinates.
- `key` (string): Your API key.

**Returns:**  
An array of available data for a drawn polygon of Sentinel-2 NDVI.

#### **Example Usage:**

```javascript
const result = getVAPIPolygonChartData(
  [
    [73.58016911387134, 20.780133232026724],
    [73.64827865102151, 20.76067336426953],
    [73.63125126673397, 20.702293760997946],
    [73.58016911387134, 20.780133232026724]
  ],
  apiKey
);

console.log(result);
