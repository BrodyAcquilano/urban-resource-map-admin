// src/data/locationHelpers.jsx

// ────────────────
// Keys and Labels
// ────────────────

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Used in: initialLocationData() and getSafeLocationData
export const defaultIsLocationOpen = Object.fromEntries(
  daysOfWeek.map((day) => [day, false])
);

// Used in: AddLocationModal.jsx
export const defaultOpenHours = Object.fromEntries(
  daysOfWeek.map((day) => [day, { open: "", close: "" }])
);

// ────────────────
// Dynamic Initialization Helpers
// ────────────────

// Build default categories and scores based on the current schema
export function buildDefaultCategories(schema) {
  const categories = {};
  schema.categories.forEach((category) => {
    categories[category.categoryName] = Object.fromEntries(
      category.items.map((item) => [item.label, false])
    );
  });
  return categories;
}

export function buildDefaultScores(schema) {
  const scores = {};
  schema.categories.forEach((category) => {
    scores[category.categoryName] = Object.fromEntries(
      category.items.map((item) => [item.label, 0])
    );
  });
  return scores;
}

// Used to initialize a new location
export function initializeLocationData(schema) {
  return {
    name: "",
    latitude: "",
    longitude: "",
    address: "",
    website: "",
    phone: "",
    wheelchairAccessible: false,
    isLocationOpen: { ...defaultIsLocationOpen },
    openHours: { ...defaultOpenHours },
    categories: buildDefaultCategories(schema),
    scores: buildDefaultScores(schema),
  };
}

// Used to safely load existing location data into forms
export function getSafeLocationData(raw = {}, schema) {
  const safeCategories = {};
  schema.categories.forEach((category) => {
    safeCategories[category.categoryName] = {
      ...Object.fromEntries(category.items.map((item) => [item.label, false])),
      ...(raw.categories?.[category.categoryName] || {}),
    };
  });

  return {
    name: raw.name || "",
    latitude: raw.latitude || "",
    longitude: raw.longitude || "",
    address: raw.address || "",
    website: raw.website || "",
    phone: raw.phone || "",
    wheelchairAccessible: !!raw.wheelchairAccessible,
    isLocationOpen: raw.isLocationOpen || { ...defaultIsLocationOpen },
    openHours: raw.openHours || { ...defaultOpenHours },
    categories: safeCategories,
    scores: raw.scores || {}, 
  };
}


// ────────────────
// Utility Functions
// ────────────────

// Used in: FilterPanel.jsx
export const time24ToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// Used in: FilterPanel.jsx
export const timeAMPMToMinutes = (timeStr) => {
  const cleaned = timeStr.trim().toLowerCase();
  const [timePart, period] = cleaned.split(/\s+/);
  if (!timePart || !period) return 0;
  let [hour, minute] = timePart.split(":").map(Number);
  if (period === "p.m." && hour !== 12) hour += 12;
  if (period === "a.m." && hour === 12) hour = 0;
  return hour * 60 + minute;
};

// Used in: FilterPanel.jsx, AddLocationModal.jsx, EditLocation.jsx
export const timeOptionsAMPM = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const suffix = hour < 12 ? "a.m." : "p.m.";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minutes} ${suffix}`;
});

// ────────────────
// Validation
// ────────────────

// Used in: AddLocationModal.jsx, EditLocation.jsx to validate all the required fields.
//Validation functions can be added here, without having to add validation to separate files.
export function validateRequiredFields(data) {
  return (
    !!data.name &&
    isValidLatLng(data) &&
    validateHasOpenDay(data.isLocationOpen) &&
    validateOpenCloseTimes(data.openHours, data.isLocationOpen)
  );
}
//Used in: validateRequiredFields()
export function validateHasOpenDay(isLocationOpen = {}) {
  return Object.values(isLocationOpen).some((v) => v === true);
}

// Used in: validateRequiredFields()
export function isValidLatLng(data) {
  const lat = parseFloat(data.latitude);
  const lng = parseFloat(data.longitude);
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

//Used in: validateRequiredFields()
export function validateOpenCloseTimes(openHours, isLocationOpen) {
  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return null;

    const match = timeStr.match(/^(\d{1,2}):(\d{2}) (a\.m\.|p\.m\.)$/);
    if (!match) return null;

    const [, hourStr, minuteStr, period] = match;
    let hour = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (period === "p.m." && hour !== 12) hour += 12;
    if (period === "a.m." && hour === 12) hour = 0;

    return hour * 60 + minutes;
  };

  for (const day of daysOfWeek) {
    if (!isLocationOpen[day]) continue; // Skip closed days

    const open = openHours[day]?.open || "";
    const close = openHours[day]?.close || "";

    const openMins = parseTime(open);
    const closeMins = parseTime(close);

    if (openMins == null || closeMins == null) return false;
    if (closeMins <= openMins) return false;
  }

  return true;
}

/* 
────────────────────────────────────────────────────
📌 DATA MODEL STRUCTURE & FIELD KEY STRATEGY
────────────────────────────────────────────────────

There are two types of data keys used in this file:

1️⃣ Static Label Keys (User-Facing):
   - Examples: "Drinking Water", "Wi-Fi", "Health Services"
   - These appear in checkboxes, filters, and the UI.
   - ✅ We abstract these into arrays like `resources`, `services`, and `comforts`.
   - Changing these here **will affect the UI** wherever they’re mapped (e.g., AddLocationModal, FilterPanel, InfoPanel).
   - These lists also drive:
     - Initial state generation
     - Filter logic
     - Validation
     - Info display and export formatting

2️⃣ Schema Field Keys (Developer-Facing):
   - Examples: `wheelchairAccessible`, `openHours`, `isLocationOpen`
   - These are structural keys used in frontend state and backend MongoDB documents.
   - 🚫 These are NOT abstracted here. They are manually named in:
     - Component logic (`useState`, form bindings)
     - API routes (`req.body`, database schema)
   - Changing a schema key here (like `wheelchairAccessible`) **does not update the backend**.
   - Doing so would require updating all frontend and backend code where it's referenced.

────────────────────────────────────────────────────
🧠 GENERAL PURPOSE OF STATIC LABELS
────────────────────────────────────────────────────

Static label arrays control structure and behavior across the entire app.  
They synchronize logic between components, ensuring consistent categories and naming across:

🧩 UI Rendering  
🗂 Form creation and validation  
🧠 Understanding what a location provides  
🛠️ Generating default state objects  
📤 Sending data to the backend  
📥 Displaying consistent output in InfoPanel, FilterPanel, and Exports  

They form the **contract** between:

- What the user sees  
- What the app stores  
- What gets transmitted to or from the backend  

────────────────────────────────────────────────────
✅ SPECIFIC USE CASES
────────────────────────────────────────────────────

1. 📋 Dynamic UI Rendering (Forms & Filters)
Instead of hardcoding 15 checkboxes, we write:
```js
resources.map(label => <input type="checkbox" ... />)
```
➡️ So if someone adds `"Free Haircuts"` to `resources`, it auto-appears in:

- Add/Edit Modals  
- InfoPanel  
- FilterPanel  
- Export Logic (if included)  

2. 🧱 Default State Generation
Initial state like `initialLocationData` uses:
```js
resources: Object.fromEntries(resources.map(label => [label, false]))
```
➡️ This ensures new resources are always tracked without manual additions to state.

3. ✅ Validation & Logic
Functions like `validateHasOpenDay()` or `validateOpenCloseTimes()` iterate over lists like `daysOfWeek`.  
➡️ If you change the schedule system (e.g., non-weekly or region-specific), it updates everywhere automatically.

4. 🪪 Output & Display (InfoPanel, Exports)
Display logic like:
```js
comforts.filter(label => data.comforts[label]).join(", ")
```
➡️ ensures only valid, known keys are used — no mismatches, typos, or data loss in exports.

5. 🛠️ Centralized Repurposing
You can turn this into:

- A **clinic locator** → rename `resources` to `"Medical Services"`  
- A **community fridge app** → change `comforts` to `"Food Types"`  
- A **disaster relief tool** → rename `services`, modify `openHours`  

➡️ With almost no component refactoring needed — just update this file.

6. 🧮 Layered/Stacked Filtering
Each category array (`resources`, `services`, `comforts`) can be used as independent filter groups.  
➡️ To **add stacked filters** (e.g., "must have water *and* shelter"), just update filter logic to check combinations based on these label arrays.

────────────────────────────────────────────────────
🔁 HOW THE DATA MODEL ENABLES FLEXIBILITY
────────────────────────────────────────────────────

Your `dataModel.js` acts as a **centralized control panel** and **source of truth** for:

🔁 Plug-and-play rendering logic  
🧱 Modular UI elements  
🧪 Reliable and consistent validation  
📤 Clean and predictable data shape for backend  
📄 Ready-to-export JSON/CSV/PDF output  
🧩 Adaptability to other domains (just update the label arrays)

It's the most powerful entry point for **scaling**, **customizing**, or **repurposing** the app for any mission-specific deployment — with minimal code changes.

────────────────────────────────────────────────────
*/
