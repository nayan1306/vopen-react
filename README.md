# Project Setup Guide

Welcome to the **Location NDVI Project**! Follow this guide to set up and maintain the project for smooth development and deployment.

---

## Prerequisites
Ensure you have the following tools installed:

- **Node.js** (v14 or higher): [Download here](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **Git**: [Download here](https://git-scm.com/)
- **Code Editor**: [Visual Studio Code](https://code.visualstudio.com/) is recommended

---

## Project Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/repository.git
   cd repository
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   The production build will be available in the `dist` folder.

---
## Necessary Library Installation

To set up the required dependencies for this project, run the following commands:

```bash
# React and React DOM (if not already installed)
npm install react react-dom

# OpenLayers
npm install ol

# Highcharts for data visualization
npm install highcharts

```

Make sure to replace `your-api-key-here` with your actual API key.

---

## Available Scripts

| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Starts the development server            |
| `npm run build`  | Builds the project for production        |
| `npm run preview`| Serves the production build locally      |
| `npm run lint`   | Lints the code for errors                |

---

## Code Structure

The project follows the following structure:

```
project-root/
├── public/              # Static assets (e.g., images, JS libraries)
├── src/                 # Main source code
│   ├── components/      # React components
│   ├── styles/          # CSS or SCSS stylesheets
│   ├── utils/           # Utility functions
│   └── App.jsx          # Main application file
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
└── README.md            # Project setup and information
```

---

---
