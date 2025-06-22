// src/data/dataModel.jsx

// ────────────────
// Keys and Labels
// ────────────────

// Used in: FilterPanel.jsx, AddLocationModal.jsx, EditLocation.jsx
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

// Used in: FilterPanel.jsx, AddLocationModal.jsx, EditLocation.jsx, InfoPanel.jsx
export const resources = [
  "Warming Centre",
  "Cooling Centre",
  "Clean Air Space",
  "Drinking Water",
  "Meals",
  "Shelter Space",
  "Washrooms",
  "Hygiene Products",
  "Tampons or Pads",
  "Showers",
  "Community Centre",
  "Food Bank",
  "Clothing",
  "Laundry",
];

// Used in: FilterPanel.jsx, AddLocationModal.jsx, EditLocation.jsx, InfoPanel.jsx
export const services = [
  "Health Services",
  "Mental Health Services",
  "Hospital",
  "Addiction Services",
  "Harm Reduction Services",
  "Housing Services",
  "Legal Aid Services",
  "Employment Services",
  "Financial Assistance Services",
  "Identification Services",
  "Interpretation Services",
  "Community Outreach",
  "Accessibility Services",
  "Transportation Services",
  "Daycare or child services",
  "Drop-in Classes"
];

// Used in: FilterPanel.jsx, AddLocationModal.jsx, EditLocation.jsx, InfoPanel.jsx
export const amenities = [
  "Wi-Fi",
  "Outdoor Power Outlets",
  "Indoor Power Outlets",
   "Storage/Lockers",
  "Indoor Seating",
  "Outdoor Seating",
  "Pet Friendly",
  "Quiet Space",
  "Public Computer Access",
  "Library",
  "Art or Music Programs",
  "Exercise Space",
  "Social Space",
  "Private Space",
  "Low-Intervention Environment",
  "Nap or Sleep",
  "No Purchases Required",
  "Coffee Shop",
  "Shopping Centre",
  "Restaurant",
  "Groceries",
  "Public Access",
  "Request Access",
  "All Ages",
  "Senior Centre",
  "Youth Centre",
  "Printers",
  "Phone Access",
  "Community Fridge",
  "Little Library",
  "Park or scenic area",
  "Art Display Space",
  "Vending Machines",
  "Microwave Access",
];

// Used in: AddLocationModal.jsx
export const resourceNotes = {
  "Warming Centre": "Indoor space to stay warm during cold weather",
  "Cooling Centre": "Indoor space to stay cool during extreme heat",
  "Clean Air Space": "Shelter from smoke, pollution, or poor air quality",
  "Drinking Water": "Access to safe water for drinking or refilling bottles",
  "Meals": "Prepared food provided for free or at low cost",
  "Shelter Space": "Place to sleep overnight, may have limited capacity",
  "Washrooms": "Toilets available for public use",
  "Hygiene Products": "Free soap, toothbrushes, or other hygiene supplies",
  "Tampons or Pads": "Free menstrual products available",
  "Showers": "Facilities to bathe or freshen up",
  "Community Centre": "Public building with programs or general support",
  "Food Bank": "Free groceries or non-perishable food available",
  "Clothing": "Free or low-cost clothes, sometimes seasonal",
  "Laundry": "Washer and dryer access, may be supervised or self-serve",
};

// Used in: AddLocationModal.jsx
export const serviceNotes = {
  "Health Services": "General medical care",
  "Hospital": "Emergency health services",
  "Mental Health Services": "Counseling or crisis support",
  "Addiction Services": "Substance use support",
  "Harm Reduction Services": "Supplies or education",
  "Housing Services": "Transitional or emergency housing support",
  "Legal Aid Services": "Access to legal help",
  "Employment Services": "Job training or search assistance",
  "Financial Assistance Services": "Direct aid or financial advice",
  "Identification Services": "Help obtaining IDs or documents",
  "Interpretation Services": "Language support",
  "Community Outreach": "Street outreach and mobile help",
  "Accessibility Services": "Help navigating barriers or providing accessible equipment",
  "Transportation Services": "Public transportation terminal or intercity bus stop",
  "Daycare or child services": "Childminding, early learning, or parent relief available",
  "Drop-in Classes": "Casual educational or creative sessions open to the public",
};

// Used in: AddLocationModal.jsx
export const amenityNotes = {
  "Wi-Fi": "Public wireless internet access",
  "Outdoor Power Outlets":"Public electrical outlets available outside",
  "Indoor Power Outlets":"Electrical outlets available indoors",
  "Storage/Lockers":"Secure space to store personal belongings",
  "Indoor Seating": "Safe indoor places to sit and rest",
  "Outdoor Seating": "Benches or sheltered outdoor areas",
  "Pet Friendly": "Allows animals or has accommodations for pets",
  "Quiet Space": "Noise-free or calm areas for rest or focus",
  "Public Computer Access": "Workstations with internet or tools",
  "Library": "Books, reading space, or educational resources",
  "Art or Music Programs": "Creative drop-ins or workshops",
  "Exercise Space": "Room to walk, stretch, or do light fitness",
  "Social Space": "Supports informal interaction or community",
  "Private Space": "Places to be alone or with limited supervision",
  "Low-Intervention Environment": "You’re unlikely to be asked to leave",
  "Nap or Sleep": "Comfortable seating or space to lay down",
  "No Purchases Required": "You can access this space without buying something",
  "Coffee Shop": "Offers seating or Wi-Fi, usually requires a purchase",
  "Shopping Centre": "Malls or plazas you can walk around or hang out",
  "Restaurant": "Prepared meals available, typically for purchase",
  "Groceries": "Fresh or packaged food available to buy",
  "Public Access": "Open to everyone without restriction",
  "Request Access": "You must ask or sign up before using resources",
  "All Ages": "Available to people of any age",
  "Senior Centre": "Primarily serves seniors (ages 55+ or 65+)",
  "Youth Centre": "Primarily serves youth (typically under 25)",
  "Printers": "Print documents here, may require staff help or small fee",
   "Phone Access":"Landline, payphone, or shared phone available for calls",
  "Community Fridge": "A shared fridge where anyone can take or leave food",
  "Little Library": "Free book exchange - take one, leave one",
  "Park or scenic area" : "Outdoor space with greenery, shade, or natural beauty",
  "Art Display Space":"Public exhibits featuring community art or creative work",
  "Vending Machines":"Snacks or drinks available for purchase onsite",
  "Microwave Access": "You can heat up food here",
};

// ────────────────
// Initialization
// ────────────────

//Used in itialLocationData()
export const defaultScores = {
  resources: Object.fromEntries(resources.map((r) => [r, 0])),
  services: Object.fromEntries(services.map((s) => [s, 0])),
  amenities: Object.fromEntries(amenities.map((a) => [a, 0])),
};

//Used in: AddLocationModal.jsx to initialize a new location object using default values, before setting them manually.
export const initialLocationData = {
  name: "",
  latitude: "",
  longitude: "",
  address: "",
  website: "",
  phone: "",
  wheelchairAccessible: false,
  isLocationOpen: { ...defaultIsLocationOpen },
  openHours: { ...defaultOpenHours },
  resources: Object.fromEntries(resources.map((label) => [label, false])),
  services: Object.fromEntries(services.map((label) => [label, false])),
  amenities: Object.fromEntries(amenities.map((label) => [label, false])),
   scores: JSON.parse(JSON.stringify(defaultScores)),
};

// Used in: EditLocation.jsx and EditScoreModal.jsx for initializing states to the values from the selected Location.
export function getSafeLocationData(raw = {}) {
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
    resources: {
      ...Object.fromEntries(resources.map((r) => [r, false])),
      ...(raw.resources || {}),
    },
    services: {
      ...Object.fromEntries(services.map((s) => [s, false])),
      ...(raw.services || {}),
    },
    amenities: {
      ...Object.fromEntries(amenities.map((a) => [a, false])),
      ...(raw.amenities || {}),
    },
    scores: {
      resources: {
        ...Object.fromEntries(resources.map((r) => [r, 0])),
        ...(raw.scores?.resources || {}),
      },
      services: {
        ...Object.fromEntries(services.map((s) => [s, 0])),
        ...(raw.scores?.services || {}),
      },
      amenities: {
        ...Object.fromEntries(amenities.map((a) => [a, 0])),
        ...(raw.scores?.amenities || {}),
      },
    },
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
