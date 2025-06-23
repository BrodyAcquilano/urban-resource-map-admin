# 🌐 Urban Resource Map (Admin Version)

A full-stack web app for managing and analyzing free public resources like shelters, washrooms, water fountains, libraries, and more.

This version includes full data management tools — add, edit, score, and export locations using a visual interface with advanced filtering and heatmap generation.

Built with:

- React + Vite (frontend)
- Express + MongoDB (read/write backend)
- Leaflet for interactive maps

---

## 🔧 Setup Instructions

1. **Clone the repository**
2. **Install dependencies** by running:

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root folder with your MongoDB connection string:

   ```bash
   MONGO_URI=mongodb+srv://<yourUser>:<yourPassword>@yourcluster.mongodb.net/
   ```

   > 🔐 Do not commit your `.env` file — it is ignored by `.gitignore`.

✅ In local development, a proxy handles /api requests, so VITE_API_URL is optional if using localhost.

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

---

## 🚀 Running the Project Locally

The project includes both a frontend and a backend. When you run:

```bash
npm run dev
```

It will:

- Start the **backend API server** on http://localhost:3000
- Start the **frontend app** on http://localhost:5173

You can then interact with the API from your frontend (e.g., fetching or posting location data).

---

## 🧩 Development Proxy (Vite → Express)

During development, Vite is configured to proxy API requests to the backend server.

This allows you to use relative paths in your frontend code like:

```js
fetch("/api/locations");
```

instead of hardcoding:

```js
fetch("http://localhost:3000/api/locations");
```

---

## 📦 Available Scripts

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| npm run dev          | Runs both frontend and backend concurrently |
| npm run start-client | Runs only the Vite frontend                 |
| npm run start-server | Runs only the Express backend (via nodemon) |

---

## 🧪 Environment Variables

Create a `.env` file at the root of the project with these two lines:

```bash
MONGO_URI=your-mongodb-connection-string-here
VITE_API_URL=your-vite-api-base-url
```

> 🧠 `VITE_API_URL` is required for **production environments** (e.g. Vercel and Render deployment).  
> It’s used to connect your frontend React app to the Express API backend.

In components like `App.jsx`, `AddLocationModal.jsx`, `EditLocation.jsx`, and `EditScoreModal.jsx`, the following line is used to access the base API path:

```js
const BASE_URL = import.meta.env.VITE_API_URL;
```

This `BASE_URL` is then used for all **GET**, **POST**, **PUT**, and **DELETE** operations:

```js
const res = await axios.get(`${BASE_URL}/api/locations`);
const res = await axios.post(`${BASE_URL}/api/locations`, data);
const res = await axios.put(`${BASE_URL}/api/locations/${id}`, updatedData);
await axios.delete(`${BASE_URL}/api/locations/${id}`);
```

These calls are necessary for reading and writing location or score data to MongoDB via your backend.

> ❓ Why not used in other components like `FilterPanel`, `AnalysisOptions`, or `InfoPanel`?

Those components do not interact with the database directly. Instead, they receive data from the parent `App.jsx` as props (like the `markers` array) and use it for filtering, displaying, or analyzing data.

To run locally, you can remove the `BASE_URL` reference and use a relative path:

```js
const res = await axios.get("/api/locations");
```

> ✅ Local development works without `VITE_API_URL` because the Vite dev server is configured to proxy API requests to the Express backend.

## 🔧 MongoDB Database Setup

When using this app, the **MongoDB database name and collection name are important.**

1. You can **create a MongoDB database with any name you like.**  
   In your `db.js` file, update this line to match your chosen database name:

   ```js
   return client.db("your-database-name-here");
   ```

   Example:

   ```js
   return client.db("urban_resource_map");
   ```

2. You **must name your collection `locations`.**  
   The backend is preconfigured to read and write to a MongoDB collection named `locations`.

   If you want to use a different collection name, you will need to update the backend file `/routes/locations.js` on this line:

   ```js
   db.collection("locations");
   ```

   You will need to update every instance of `db.collection("locations")` to your custom collection name.

---

## 🚨 Important Note:

The term `locations` is used **in two different contexts:**

- **MongoDB Collection Name:**  
  This is the actual name of your data storage collection.
- **API Route Name:**  
  Example: `axios.get("/api/locations")`  
  This is just a frontend/backend URL convention. It is unrelated to your MongoDB collection name.

> 🔑 **You can change the collection name, but you should not change the API route name unless you fully understand the backend routing system.**

---

## 🧱 Tech Stack

- **Frontend**: React, Vite, Leaflet, React-Leaflet, React Router DOM
- **Backend**: Express (API Server), Node.js
- **Database**: MongoDB Atlas (cloud-database)
- **Data Fetching**: Axios (connects to backend API)
- **Geospatial Tools**: Turf.js (for overlays, heatmaps, scoring zones)
- **Export Tools**: html2canvas, jsPDF (snapshot + PDF generation)
- **Dev Tools**: Nodemon, Concurrently, ESLint, Vite Plugin React
- **Environment Management**: dotenv (for .env config), CORS (for cross-origin access)

---

## 📦 Notable Dependencies

These packages power the core features of the application:

| Package              | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| **react**            | Frontend UI framework                                      |
| **vite**             | Lightning-fast development/build tool                      |
| **express**          | Backend API server                                         |
| **mongodb**          | NoSQL database for location and score data                 |
| **react-router-dom** | Enables multi-page routing in SPA                          |
| **react-leaflet**    | Wraps Leaflet.js for use with React                        |
| **leaflet**          | Interactive map rendering                                  |
| **axios**            | Handles all HTTP requests (GET, POST, PUT, DELETE)         |
| **dotenv**           | Loads environment variables from `.env`                    |
| **cors**             | Enables cross-origin requests between frontend and backend |
| **@turf/turf**       | Performs spatial calculations (buffers, overlays, etc.)    |
| **html2canvas**      | Captures map snapshots for export as image                 |
| **jspdf**            | Converts images into downloadable PDF files                |
| **concurrently**     | Runs frontend and backend together in development mode     |
| **nodemon**          | Auto-restarts backend server on code changes               |
| **eslint**           | Lints and enforces code style                              |
| **react-dom**        | Renders React components to the DOM                        |

---

## 🧪 Dev-Only Dependencies

These packages are used during development only (not bundled into production builds):

| Package                         | Purpose                                                       |
| ------------------------------- | ------------------------------------------------------------- |
| **@vitejs/plugin-react**        | Enables fast refresh and JSX support with Vite                |
| **@types/react**                | TypeScript type definitions for React                         |
| **@types/react-dom**            | TypeScript type definitions for ReactDOM                      |
| **@eslint/js**                  | Core ESLint configuration                                     |
| **eslint**                      | JavaScript/React linter                                       |
| **eslint-plugin-react-hooks**   | Lints rules of hooks usage in React                           |
| **eslint-plugin-react-refresh** | Ensures proper setup for React Fast Refresh                   |
| **globals**                     | Provides predefined global variables to ESLint                |
| **nodemon**                     | Auto-restarts the backend server on file changes              |
| **concurrently**                | Runs multiple commands/scripts at once (used in dev workflow) |

---

## 🧠 App Structure & Routing

The `App.jsx` file serves as the root of the application. It contains:

- Global UI components like the **Header**, **MapPanel**, and **FilterPanel**
- Route definitions for four main pages:
  - `/` → **Home Page**: View and filter nearby resources
  - `/editor` → **Editor Page**: Add, edit, or delete location data
  - `/export` → **Export Page**: Generate and export maps as PDFs
  - `/analysis` → **Analysis Page**: Generate heatmaps and scoring overlays based on selected metrics

These pages share global state (markers, filters, etc.) to avoid redundant reloads. Changing pages doesn’t reset filters or trigger new fetches unless needed.

---

## 🧩 Data Model Overview

The app’s dynamic behavior is driven by a centralized **data model** in `dataModel.js`, which defines:

- The **categories** of information (e.g. resources, services, comforts)
- The **default structure** of location objects (e.g. open hours, booleans, arrays)
- Shared constants (e.g. days of the week, label sets, validation helpers)

This file powers:

- ✅ UI rendering (checkboxes, labels, filters)
- ✅ Input validation
- ✅ Default state generation
- ✅ Output display logic (info panels, exports)
- ✅ Filter logic for map markers

By modifying the data model, developers can:

- Add new fields or categories (e.g., “First Aid” or “Charging Station”)
- Track seasonal or time-based exceptions
- Control which filters are shown
- Repurpose the app for other domains (e.g. medical clinics, public restrooms, climate shelters)

Changes to the label lists (like `resources` or `services`) automatically affect all relevant forms, filters, and displays — no manual updates needed across components.

---

## 🧭 Workflows and Use Cases

The app is structured around four key workflows:

### 🗺 Viewing Controls (Home Page)

Find free resources based on user-selected filters — without needing to search for businesses by name or category. This allows:

- Comparing services that match personal needs (rather than ads)
- Identifying high-resource zones (e.g. green for well-served areas, red for deserts)
- Overlaying transit or mobility routes between locations
- Adding seasonal or hourly resource awareness (e.g. warming centre in winter only)

### ✏️ Data Management (Editor Page)

Add, edit, or remove location data directly through the interface. This enables:

- Dynamic updates to map content
- Manual correction of errors or outdated listings
- Scalable community mapping or admin moderation

Only the admin version includes this functionality.

### 📊 Data Analysis (Analysis Page)

Analyze location coverage and quality across the city using tools for:

- Generating heatmaps from scored data (services, resources, amenities)
- Viewing score-based zones with customizable overlays
- Filtering by resource type, minimum score, or location cluster
- Identifying gaps, redundancies, or outreach opportunities

Scores are created or modified via the **Edit Score Modal**, available only in the admin version.

### 🖨 Export Tools (Export Page)

Generate PDF maps with filtered results for offline use or sharing with:

- Outreach teams
- People without phones or reliable connectivity
- Printed handouts for service providers

---

## 🔮 Future Improvements

- 🔒 Add optional login system to restrict access to a private admin version (link both client and admin versions)
- 🧠 Add weighted scoring logic to better reflect importance of specific services
- 🔐 Add user login or admin roles for secure access to editing and scoring
- 🛠 Enable custom data model settings (e.g. editable categories, filters, label sets)
- 🧩 Allow users to connect to their own MongoDB database via input or config screen (currently done in development by updating .env file)
- 📦 Add import/export for location data in JSON or CSV formats
- 📅 Add more advanced time/seasonal exceptions logic (e.g. hourly shifts, closures)
- 🌐 Add multi-user support for collaborative community data collection

> These improvements are intended to enhance long-term flexibility and allow community-led deployments with custom configurations.

---

## 🌍 Use Cases

This app can be customized for:

- 🏙 City planning & public policy
- 🚶 Homeless outreach & mobile resource guides
- 🚲 Bicycle route + amenity mapping
- 🧭 Disaster response & emergency coordination
- 🌡 Heat/cold wave survival mapping
- 🧘‍♀️ Community wellness directories

Its modular data structure allows the same core system to support new applications by simply changing the data model and UI copy.

---

## 🌍 Beyond Emergency Services — What This Platform Can Become

The Urban Resource Map is currently focused on mapping free or essential urban services like water fountains, food banks, and shelters. But underneath that is a **powerful, reusable map-based data management system**.

It’s not just a viewer — it’s a full **map management terminal** and **data management interface**, designed to let users:

- Load and visualize structured location-based data from a database
- Apply filters to explore patterns, analyze gaps, or generate insights
- Modify data by editing, adding, or removing markers through the UI
- Export maps and data summaries for offline use, print, or reporting

Because the platform is modular, filter-driven, and uses a shared data model, it can be **reused for entirely different industries** with only minor tweaks — or made configurable for multiple audiences.

---

## 🔄 Why It's Powerful

✅ **Custom Filters**  
Use hardcoded or user-generated filters to sort markers by category, time, score, season, accessibility, etc.

✅ **Database-Linked**  
Pull live data from MongoDB (or any other backend), update it with the UI, and reflect it instantly on the map.

✅ **Visual-First Editing**  
Modify datasets spatially — see what’s near a river, highway, or outside a city radius and edit/remove with no need for complex calculations.

✅ **Data Control Terminal**  
This app is not just a viewer — it lets admins or analysts interact with spatial data directly through a single unified interface.

---

## 🧠 General Use Cases

### 1. **Map Management**

- Visualize all markers by category, type, or zone
- Highlight problem areas (e.g., resource deserts or high-risk zones)
- Plan spatial relationships (e.g., buffer zones, coverage gaps)

### 2. **Data Management**

- Use the editor to add, modify, or delete entries in real time
- Sync changes with a backend database (e.g., MongoDB, Firebase, SQL)
- Validate data visually before committing it (e.g., "is this factory too close to a residential zone?")

### 3. **Resource Management**

- Monitor and track the distribution of public resources
- Score locations by quality, access, or timeliness
- Generate printable reports showing gaps or redundancies

### 4. **Analytical Insight**

- Apply layered filters to detect trends (e.g., "Which parks are accessible year-round AND within 10km of transit?")
- Enable statistical overlay (heatmaps, zone scoring, corridor detection)
- Use data export to generate reports for policy or research

---

## 🧩 Industry-Specific Applications

| Industry                    | Example Use Case                                                             |
| --------------------------- | ---------------------------------------------------------------------------- |
| 🌲 Forestry / Land Mgmt     | Map forest types, wildfire risk zones, trail access points, or logging areas |
| 🏥 Public Health            | Map hospitals, clinics, vaccination sites, or outbreak zones                 |
| 🧪 Research & Policy        | Track urban infrastructure or community well-being across census tracts      |
| 🏙️ City Planning            | Visualize zoning changes, construction permits, or accessibility overlays    |
| 🏭 Employment Agencies      | Map factories, warehouses, or retail hubs; link jobs to transit routes       |
| 🛑 Emergency Response       | Pre-plan shelters, evacuation zones, or hazard markers                       |
| 🌐 Telecom / Infrastructure | Plot cell towers, dead zones, or fiber coverage for ISP planning             |
| 🚲 Transportation Mapping   | Plan bike lanes, bus corridors, and walkability scores                       |
| 🛒 Social Enterprises       | Map mutual aid networks, pop-up markets, or delivery zones                   |
| 🧰 Environmental Science    | Monitor water sources, air quality points, or species sightings              |

---

## 💡 Future Expansion Ideas

- Add custom scoring models (e.g., quality + proximity + seasonality)
- Enable public input or voting to crowdsource map data
- Integrate with mobile devices for live field updates
- Offer industry-specific templates with preloaded dataModel configurations
- Make filters fully configurable from the UI (add/remove/customize categories)

---

## 🎯 TL;DR

This platform is a **general-purpose, spatial data management interface** with:

- 🔧 Modular filters
- 🗺️ Real-time visualization
- ✏️ Editable data points
- 📊 Exportable insights

And it can be customized to serve nearly **any industry that works with location-based data.**

---

## ⚡ Rapid Pinning Mode (Symbol-Only Marker Inventory)

### 🧠 Concept

Allow users to select a marker type from a toolbar (e.g., Water Fountain, Bench, Wi-Fi Spot) and then click on the map to drop a symbol — no form, no modal, no data entry.

Each marker would store:

- `type`: (e.g., "Fountain", "Bench", "Charging Station")
- `lat`, `lng`: (auto-generated on click)
- `id`: (auto-generated or Mongo `_id`)
- Possibly: `timestamp` or `userId` (if tracking contributions)

This simplifies UX and **dramatically increases speed** of data collection or surveying.

---

### 🛠️ Integration Ideas

- 🔘 Add a toggle button in the UI: “Rapid Pin Mode”
- 🧭 Show a horizontal toolbar of icons/types across the top or side (like drawing tools in design software)
- 🖱️ User clicks a type → map enters “add mode” → clicking the map adds that symbol
- ✏️ Optional: allow user to drag-to-reposition or right-click to remove

---

### 🧩 Data Model (Minimalist Version)

{
id: "uuid-123",
type: "Water Fountain",
latitude: 43.12345,
longitude: -80.12345
}

### 🔎 Filter/Display Logic

- Only filter by `type`
- Use custom icons or symbols for each marker type
- Possibly add clustering or grouping if many pins exist in one area

---

### 🧰 Use Cases

| Context                  | Example Application                                    |
| ------------------------ | ------------------------------------------------------ |
| 🔌 Infrastructure Survey | Map all visible electrical boxes or manhole covers     |
| 💧 Public Services       | Rapidly log every water fountain or hydrant            |
| 🚮 Urban Cleanups        | Drop pins for overflowing trash bins or graffiti spots |
| 🌳 Forestry / Parks      | Log tree types, stumps, or damage during fieldwork     |
| 📡 Signal Mapping        | Mark weak Wi-Fi zones or dead mobile signal spots      |
| 🛠️ Field Repair Logs     | Workers drop markers for potholes, leaks, etc.         |
| 🧭 Trail Management      | Pin benches, signs, campsites, hazards                 |
| 🚶‍♂️ Accessibility Audit   | Drop pins for curb cuts, stairs, elevators, etc.       |

---

### 💡 Bonus Extensions

- Allow exporting all pins to CSV, GeoJSON, or PDF
- Enable pin color coding by type
- Add simple “notes” field (optional popover or right-click edit)
- Add undo/redo for rapid workflows
- Later: allow offline use for mobile field teams

---

### 🧠 Summary

**Rapid Pin Mode turns your app into a spatial sketchpad.**
It’s the fastest way to populate a map with real-world data when all you need is a type and a location.

It’s also a great demo of how the same platform can serve:

- Urban planners
- Public service agencies
- Field researchers
- Environmental groups
- Internal asset tracking

All without writing a line of new backend code — just by adjusting your frontend workflow and using your existing map + marker infrastructure.
