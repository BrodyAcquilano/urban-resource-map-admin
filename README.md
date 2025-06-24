# 🌐 Urban Resource Map

A full-stack web app for managing, visualizing, and analyzing **spatial data of any kind.**  
Originally designed for mapping public resources like shelters and water fountains, the platform now supports **any location-based datasets** — including housing, parks, infrastructure, jobs, transit, and more.

Built with:

- React + Vite (frontend)
- Express + MongoDB (read/write backend)
- Leaflet for interactive maps

---

## 📁 Repository Overview

I maintain **three separate versions** of this project:

- **Admin Version:** Full editing, scoring, analysis, and export features. Includes the Editor Page and Edit Score Modal.
- **Client Version (read-only & mobile-friendly) :** Limited to viewing, filtering, and exporting. Editing and scoring tools are removed.
- **Dev Version:** Experimental and in-progress features for future releases.

Each version has a separate GitHub repository.  
Most of the instructions in this README apply to all versions unless otherwise noted.

---

## 🔧 Setup Instructions

1. **Clone the repository**

2. **Install dependencies**  
   Make sure you have **Node.js installed** on your computer.  
   Open the **command prompt or terminal inside the project root folder** and run:

   ```bash
   npm install
   ```

3. **Set up your MongoDB Database**  
   👉 See the **MongoDB Database Setup** section below for step-by-step instructions.

4. **(Optional) Set up Render backend deployment**  
   If you plan to deploy this project online, you can use **Render to host your backend**.  
   Create a backend service and obtain the Render URL — this will be your API base URL for the next step.

5. **(Optional) Set up Vercel frontend deployment**  
   If you plan to deploy your **frontend** (React app) separately, you can use **Vercel to host the frontend**.  
   You will need to point your frontend to your Render backend using the `VITE_API_URL` in the next step.

   > ⚙️ Frontend can also run locally — Vercel is optional.

6. **Create a `.env` file** in the project root folder with your MongoDB connection string and API base URL:

   ```bash
   MONGO_URI=mongodb+srv://<yourUser>:<yourPassword>@yourcluster.mongodb.net/
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

   > 🔐 Do not commit your `.env` file — it is ignored by `.gitignore`.

   > 🧠 In local development, a proxy handles `/api` requests, so `VITE_API_URL` is optional if using localhost.  
   > 👉 See the **Environment Setup** section below for more details on how to run the project locally without `VITE_API_URL`.

7. **Update the database connection in `db.js`**  
   Open `src/db.js` and set your MongoDB database name:

   ```js
   return client.db("your-database-name-here");
   ```

8. **Start the development servers:**

   ```bash
   npm run dev
   ```

   ***

## 🔧 MongoDB Database Setup

To use this app, you need to set up a **MongoDB Atlas database.**

### 1. Create a MongoDB Account

Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.

### 2. Create a Project, Cluster, and Database

- **Project:** Create a new project (you can name it anything you like).
- **Cluster:** Create a free shared cluster.
- **Database:** Inside your cluster, create a **database** (name it anything you like, for example: `urban-resource-map-dev`).

### 3. Set up the `projectSchema` Collection

In your new database, **create a collection called `projectSchema`**.

This collection should contain **one document per project** and will store the following:

- `projectName`: (string) The name of the project (for display)
- `collectionName`: (string) The name of the data collection that holds the location markers
- `categories`: (array) A list of category objects, each with:
  - `categoryName` (string)
  - `items` (object) A list of items (checkbox labels) for this category with true/false states
  - `notes` (object) Optional: label notes, input type notes, or descriptions for UI rendering

Example of a `projectSchema` document:

```json
{
  "projectName": "Community Resources - Winter",
  "collectionName": "communityResourcesWinter",
  "categories": [
    {
      "categoryName": "Resources",
      "items": { "Shelter": true, "Washroom": true, "Water Fountain": true },
      "notes": {
        "Shelter": "Overnight warming centre",
        "Water Fountain": "Outdoor or indoor access"
      }
    },
    {
      "categoryName": "Services",
      "items": { "Meals": true, "First Aid": true },
      "notes": { "Meals": "Free or low-cost meals" }
    }
  ]
}
```

### 4. Create Collections for Location Data

You can create **one or more collections for storing location markers.**

For example:

- `communityResourcesWinter`
- `communityResourcesSummer`
- `KitchenerResources`
- `TorontoResources`
- `parks`
- `housing`
- `jobs`

You can **separate collections by city, season, or project type.**

> 📦 You can copy the `projectSchema` for multiple collections if their category structure is the same. (by city or by season)

### 5. Connect the Frontend and Backend

- In your `.env` file, make sure your `MONGO_URI` points to your MongoDB cluster.
- In your `db.js` file, make sure the database name matches the one you created in MongoDB.

```js
return client.db("urban-resource-map-dev");
```

### 🔑 Key Notes:

- The app reads the `projectSchema` from your database to **build the categories, filters, and input forms.**
- The app currently **does not store hours, names, latitude, longitude, phone, or address in the `projectSchema`** — those are stored in your location data collections.
- The **categories in `projectSchema` are connected to checkboxes** (true/false values) and control what items show up in the filters and the analysis tools.
- Multiple collections can be used to separate cities, seasons, or resource types without changing the schema structure.
- This prevents loading large datasets, displaying too many map markers at once, or trying to analyze unrelated types of data all together.
- The MongoDB database name can be **anything you like.**
- You can have multiple databases within the same cluster
- The collection name for storing your schema must be `projectSchema`.
- projectSchema and collections must be in the same database, but you only need one projectSchema to support multiple collections within that database.
- The API route `/api/locations` is a frontend/backend convention and does **not need to match your MongoDB collection names.**

---

## 🌐 Environment Setup

This project can be run in **multiple environments** using different configurations.

You can:

- Run the app fully locally on your machine.
- Deploy the backend to Render and run the frontend locally.
- Deploy both backend and frontend using Render and Vercel.

Each environment setup requires using **environment variables** to tell the app where to find your backend server and MongoDB database.

### 🧠 What Are Environment Variables?

Environment variables are external configuration values that tell your app where to find:

- Your backend API server.
- Your MongoDB database.

You must create a `.env` file in the **root folder** of your project that contains these variables (for local development or Vercel setups):

```bash
MONGO_URI=your-mongodb-connection-string-here
VITE_API_URL=your-vite-api-base-url
```

- `MONGO_URI` connects the backend server to your MongoDB database.
- `VITE_API_URL` connects the frontend to your backend server.

### 🔧 Where to Store Environment Variables

- **Local `.env` File:**  
  Used for fully local setups or when running the frontend locally.

- **Render Dashboard (Backend):**  
  When using Render to host the backend, your MongoDB connection string must be added to Render’s **Environment Variables panel.**  
  Render will automatically generate a backend URL that you can use as your `VITE_API_URL`.

- **Vercel Dashboard (Frontend - Optional):**  
  When using Vercel to host the frontend, your `VITE_API_URL` must be added to Vercel’s **Environment Variables panel.**

### ⚡ Axios and API Communication

This project uses **Axios** to send requests between the frontend and backend.

In components like `App.jsx`, `AddLocationModal.jsx`, `EditLocation.jsx`, and `EditScoreModal.jsx`, the API base URL is defined as:

```js
const BASE_URL = import.meta.env.VITE_API_URL;
```

All API requests use:

```js
const res = await axios.get(`${BASE_URL}/api/locations`);
const res = await axios.post(`${BASE_URL}/api/locations`, data);
const res = await axios.put(`${BASE_URL}/api/locations/${id}`, updatedData);
await axios.delete(`${BASE_URL}/api/locations/${id}`);
```

If you are using **fully local development**, you can skip the `BASE_URL` entirely and just use:

```js
const res = await axios.get("/api/locations");
```

Vite’s built-in proxy will automatically forward these requests to your local backend.

### 🧩 Development Proxy (Vite → Express)

During development, Vite is configured to **proxy API requests to the backend server.**

This allows you to use **relative paths** in your frontend code like:

```js
fetch("/api/locations");
```

instead of hardcoding:

```js
fetch("http://localhost:3000/api/locations");
```

This works automatically when you run the project locally using:

```bash
npm run dev
```

### 🗺️ Possible Configurations

MongoDB database setup is **always the same across all configurations.**  
What changes is:

- Where the backend and frontend are hosted.
- Where you store your environment variables.

#### 1. **Fully Local Setup (Frontend and Backend on Your Machine)**

- Run `npm run dev` to launch both frontend and backend locally.
- MongoDB connection string is stored in your local `.env` file.
- `VITE_API_URL` is **not required** because Vite automatically proxies API requests to your local backend.
- Axios can use **relative paths** like:
  ```js
  const res = await axios.get("/api/locations");
  ```

#### 2. **Local Frontend + Render Backend**

- Frontend runs locally on `http://localhost:5173`.
- Backend is deployed to Render.
- MongoDB connection string is stored in **Render’s environment variables.**
- Render automatically generates your backend URL, which you must copy and paste into your local `.env` as:
  ```bash
  VITE_API_URL=https://your-render-backend.onrender.com
  ```
- Axios must use:
  ```js
  const BASE_URL = import.meta.env.VITE_API_URL;
  const res = await axios.get(`${BASE_URL}/api/locations`);
  ```

#### 3. **Vercel Frontend + Render Backend**

- Frontend is deployed on Vercel.
- Backend is deployed on Render.
- MongoDB connection string is stored in **Render’s environment variables.**
- Render automatically generates your backend URL, which you must copy and paste into **Vercel’s environment variables** as:
  ```bash
  VITE_API_URL=https://your-render-backend.onrender.com
  ```
- Axios must use:
  ```js
  const BASE_URL = import.meta.env.VITE_API_URL;
  const res = await axios.get(`${BASE_URL}/api/locations`);
  ```

### 🏃 Running the Project Locally

When you run:

```bash
npm run dev
```

The project will:

- Start the **backend API server** on `http://localhost:3000`
- Start the **frontend app** on `http://localhost:5173`

---

### 📦 Available Scripts for Local Development

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| npm run dev          | Runs both frontend and backend concurrently |
| npm run start-client | Runs only the Vite frontend                 |
| npm run start-server | Runs only the Express backend (via nodemon) |

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

Note: I have a separate github repo that is for a client version with read-only permissions. This page does not exist in that version.

### 🖨 Export Tools (Export Page)

Generate PDF maps with filtered results for offline use or sharing with:

- Outreach teams
- People without phones or reliable connectivity
- Printed handouts for service providers

### 📊 Data Analysis (Analysis Page)

Analyze location coverage and quality across the city using tools for:

- Generating heatmaps from scored data (services, resources, amenities)
- Viewing score-based zones with customizable overlays
- Filtering by resource type, minimum score, or location cluster
- Identifying gaps, redundancies, or outreach opportunities

Note: I have a separate github repo that is for a client version with read-only permissions. The EditScoreModal does not exist in that version.

---

## 🌍 Use Cases and Applications

The Urban Resource Map can be used in **two primary ways:**

- As a **personal or community tool** to map resources, services, and assets that matter to individuals or small groups.
- As a **professional or industry tool** for managing complex spatial data across cities, regions, or specialized domains.

The system is fully modular and can be customized for almost any purpose by adjusting the project schema and categories.

### 🧭 General Use Cases

#### 1. **Map Management**

- Visualize markers by category, type, zone, or project.
- Highlight resource deserts, coverage gaps, or high-risk areas.
- Plan spatial relationships (e.g., buffer zones, proximity overlaps).

#### 2. **Data Management**

- Add, modify, or delete entries in real time.
- Sync changes directly with a MongoDB database.
- Validate data visually before committing changes (e.g., “Is this shelter in a flood zone?”).

#### 3. **Resource Management**

- Monitor distribution and access to public resources.
- Track seasonal availability or quality of services.
- Generate printable reports or maps showing gaps or redundancies.

#### 4. **Analytical Insight**

- Apply layered filters to detect patterns (e.g., “Which parks are within 10km of transit AND have washrooms?”)
- Generate heatmaps, scoring zones, or corridor overlays.
- Export datasets and visual reports for research, planning, or outreach.

### 🛠️ Example Applications

| Industry / Context            | Example Use Case                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| 🏙️ City Planning              | Visualize zoning changes, permit locations, or accessibility overlays                     |
| 🌲 Forestry / Land Management | Map forest types, wildfire risks, logging sites, or trail access points                   |
| 🏘️ Housing Resource Tracking  | Monitor available housing, track rental listings, and use cron jobs to flag expired units |
| 🧰 Environmental Science      | Track water sources, air quality sensors, or species sightings                            |
| 🚲 Transportation Mapping     | Plan bike lanes, bus routes, walkability zones, and sidewalk networks                     |
| 🏥 Public Health              | Map clinics, hospitals, vaccination sites, or emergency services                          |
| 🛑 Disaster Response          | Pre-plan shelters, evacuation routes, and hazard zones                                    |
| 🌐 Infrastructure Mapping     | Plot cell towers, dead zones, or fiber coverage for telecom planning                      |
| 🛒 Social Enterprises         | Map mutual aid hubs, pop-up markets, delivery routes, or outreach services                |
| 🚶 Homeless Outreach          | Build local resource maps with real-time availability and seasonal changes                |

This platform’s **flexible schema and decentralized data connection** allow it to support both small, individual mapping projects and large-scale, professional datasets — all within the same user interface.

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

This platform is a **general-purpose, spatial data management interface** with:

- 🔧 Modular filters
- 🗺️ Real-time visualization
- ✏️ Editable data points
- 📊 Exportable insights

And it can be customized to serve nearly **any industry that works with location-based data.**

---

## 🔮 Future Improvements

We are moving toward a **fully decentralized, user-driven mapping system** where users can connect to their own databases and build fully customizable projects without needing backend modifications.

### 🗂️ Decentralized Database Connections

- Allow users to input their own **MongoDB connection string** to connect directly to their own databases.
- Eliminate the need for user accounts or centralized hosting.
- Enable instant database access through the frontend UI by providing the connection string.

### 🧩 Fully Dynamic Project Schemas

- Currently, project schemas support only **categories** and their checkbox labels.
- In the future, schemas will support **custom input types** like:
  - Text inputs (for addresses, phone numbers, websites)
  - Dropdowns (single and multi-select)
  - Checkboxes (true/false)
  - Optional: Numeric inputs, date pickers, etc.
- Users will be able to:
  - Build project schemas **through the UI** (not just by editing the database)
  - Select input types for each field
  - Define required fields and validation rules
  - Customize the display and layout of input forms

### 🧱 Schema Templates

- Develop **starter templates** to help users quickly build their own project schemas.
- Provide presets for common use cases like:
  - Community Resources
  - Parks and Amenities
  - Housing and Jobs
  - Transit and Pathway Networks

### 🚀 Advanced Mapping Features

- Add support for **complex shapes**:
  - Multi-location features
  - Paths and routes (bike lanes, walking corridors)
- Enable **routing and directions** between locations
- Support **seasonal dependencies, real-time availability, and exceptions** (e.g. holidays, closures)
- Develop more advanced **spatial analysis algorithms and scoring methods**

> These improvements will support a **fully customizable, decentralized mapping system** that can adapt to a wide range of user needs — all through a powerful, user-controlled interface.

### ⚡ Rapid Pinning Mode (Symbol-Only Marker Inventory)

- Add an optional **Rapid Pinning Mode** for fast, form-free data collection.
- Users can:
  - Select a marker type from a toolbar (e.g., Water Fountain, Bench, Wi-Fi Spot)
  - Click directly on the map to place a pin without opening a form or entering data
- Each pin will store:
  - `type` (marker type)
  - `lat` and `lng` (automatically generated)
  - `id` (auto-generated or Mongo `_id`)
- Optional Features:
  - Drag-to-reposition pins
  - Right-click to remove pins
  - Pin clustering or grouping
  - Quick filter by pin type
  - Export pins to CSV, GeoJSON, or PDF
  - Add minimal notes via quick popover or right-click edit
  - Offline pinning for mobile field teams
- Benefits:
  - Rapid pinning increases survey speed, simplifies mobile fieldwork, and supports rapid urban audits.
  - Can be used for tasks like:
    - Logging water fountains, benches, graffiti, potholes, accessibility features
    - Mapping infrastructure like signal dead zones or trash bins
    - Conducting accessibility audits and trail mapping
- Rapid Pinning Mode would **require no new backend code changes** — it would use the existing map and marker infrastructure with a streamlined frontend workflow.
