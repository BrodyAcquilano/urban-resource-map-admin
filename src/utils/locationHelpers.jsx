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

export function getSafeLocationData(raw = {}, schema) {
  const safeCategories = {};
  const safeScores = {};

  schema.categories.forEach((category) => {
    // Build default categories
    safeCategories[category.categoryName] = {
      ...Object.fromEntries(category.items.map((item) => [item.label, false])),
      ...(raw.categories?.[category.categoryName] || {}),
    };

    // Build default scores
    safeScores[category.categoryName] = {
      ...Object.fromEntries(category.items.map((item) => [item.label, 0])),
      ...(raw.scores?.[category.categoryName] || {}),
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
    scores: safeScores,
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
