### Geospatial Services Overview

Our platform provides a comprehensive suite of geospatial services, delivering high-quality satellite imagery and derived products through Web Map Service (WMS) interfaces. These services are designed to empower researchers, developers, and analysts with precise geospatial insights for diverse applications.

---

## **Core Services**

### **1. Sentinel-2 False Colour Composite (S2_FCC)**
**Description:**  
This service delivers WMS access to False Colour Composite imagery from the Sentinel-2 satellite. These images are vital for vegetation analysis, urban planning, and environmental studies, as they enhance the visualization of vegetation and land-use patterns.

- **Applications:**  
  - Vegetation health monitoring  
  - Urban expansion and planning  
  - Environmental impact assessments  

---

### **2. AWiFS False Colour Composite (AWIFS_FCC)**
**Description:**  
Providing WMS access to False Colour Composite imagery from the Advanced Wide Field Sensor (AWiFS), this service is invaluable for large-area monitoring and management.

- **Applications:**  
  - Agricultural monitoring  
  - Forestry and biodiversity management  
  - Land-cover and land-use mapping  

---

### **3. Sentinel-2 Normalized Difference Vegetation Index (S2_NDVI)**
**Description:**  
This service offers WMS access to NDVI data derived from Sentinel-2 imagery. NDVI quantifies vegetation health and density, making it essential for ecological research and agricultural assessments.

- **Applications:**  
  - Agricultural productivity and health assessments  
  - Drought and disaster monitoring  
  - Ecosystem and biodiversity analysis  

---

## **VAPI Functions**

### `getTimeStamp(serviceName)`

**Description:**  
Retrieves available dates for a specified service.

- **Parameters:**
  - `serviceName` (string): The name of the service. Options for `serviceName`:
    - `"awifs_fcc"`
    - `"sentinel2_fcc"`
    - `"sentinel2_ndvi"`
  
- **Returns:**  
  An array of available dates for the specified service.

#### **Example Usage:**

```javascript
const dates = getTimeStamp("sentinel2_ndvi");
console.log(dates);
```

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
