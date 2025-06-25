// src/components/FilterPanel.jsx
import React, { useState, useEffect } from "react";
import { daysOfWeek, timeOptionsAMPM, timeAMPMToMinutes } from "../utils/locationHelpers.jsx";
import "../styles/panels.css";
import { renderCheckboxGroupBySchema } from "../utils/renderingHelpers.jsx";
import { fetchSchemaByProjectName } from "../utils/schemaFetcher.js";

function FilterPanel({
   mongoURI,
  schemas,
  currentSchema,
  setCurrentSchema,
  setCurrentCollection,
  tileStyle,
  setTileStyle,
  markers,
  setFilteredMarkers,
  setSelectedFilters,
  setSelectedLocation
}) {
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [dayFilter, setDayFilter] = useState("Any");
  const [timeFilter, setTimeFilter] = useState("Any");

  // Initialize dynamic checkboxes
  const initCheckedState = () => {
    if (!currentSchema) return {};
   return Object.fromEntries(
  currentSchema.categories.flatMap((cat) => cat.items.map((item) => [item.label, false]))
);
  };

  const [categoryChecks, setCategoryChecks] = useState(initCheckedState);

  useEffect(() => {
    setCategoryChecks(initCheckedState());
  }, [currentSchema]);

  // Filter logic
  useEffect(() => {
    const filterMinutes = timeFilter !== "Any" ? timeAMPMToMinutes(timeFilter) : null;

    const matchesFilter = (marker) => {
      if (wheelchairOnly && !marker.wheelchairAccessible) return false;

      if (dayFilter !== "Any") {
        if (!marker.isLocationOpen?.[dayFilter]) return false;
        if (filterMinutes !== null) {
          const hours = marker.openHours?.[dayFilter];
          const open = timeAMPMToMinutes(hours?.open || "12:00 a.m.");
          const close = timeAMPMToMinutes(hours?.close || "12:00 a.m.");
          if (filterMinutes < open || filterMinutes > close) return false;
        }
      } else if (filterMinutes !== null) {
        const matchesAny = daysOfWeek.some((day) => {
          if (!marker.isLocationOpen?.[day]) return false;
          const hours = marker.openHours?.[day];
          const open = timeAMPMToMinutes(hours?.open || "12:00 a.m.");
          const close = timeAMPMToMinutes(hours?.close || "12:00 a.m.");
          return filterMinutes >= open && filterMinutes <= close;
        });
        if (!matchesAny) return false;
      }

      return Object.entries(categoryChecks).every(([key, active]) => {
  if (!active) return true;

  // Search through all categories to see if this key is active anywhere
  return Object.values(marker.categories || {}).some(categoryGroup => categoryGroup?.[key]);
});
    };

    setFilteredMarkers(markers.filter(matchesFilter));

    // Build selectedFilters array for export
    const updatedFilters = [];

    if (dayFilter !== "Any") {
      updatedFilters.push({ type: "day", label: dayFilter });
    }

    if (timeFilter !== "Any") {
      updatedFilters.push({ type: "time", label: timeFilter });
    }

    if (wheelchairOnly) {
      updatedFilters.push({ type: "accessibility", label: true });
    }

    const collectChecked = (checks, categoryLabel) => {
      const items = Object.entries(checks)
        .filter(([_, checked]) => checked)
        .map(([label]) => ({ type: "category-item", label }));

      return items.length
        ? [{ type: "category-header", label: categoryLabel }, ...items]
        : [];
    };

    currentSchema?.categories.forEach((category) => {
      updatedFilters.push(...collectChecked(categoryChecks, category.categoryName));
    });

    setSelectedFilters(updatedFilters);
  }, [
    markers,
    wheelchairOnly,
    dayFilter,
    timeFilter,
    categoryChecks,
    setFilteredMarkers,
    currentSchema,
  ]);

  const handleCheckboxChange = (label, checked) => {
    setCategoryChecks((prev) => ({
      ...prev,
      [label]: checked,
    }));
  };

  return (
    <div className="panel">
      <div className="section">
        <h2>Filter Panel</h2>
      </div>

      <div className="section">
        <h3>Global Settings</h3>

        {/* Project Selector */}
        <div className="form-group">
          <label>Select Project:</label>
          <select
            value={currentSchema?.projectName || ""}
            onChange={async (e) => {
              const selectedProjectName = e.target.value;
              const fetchedSchema = await fetchSchemaByProjectName( mongoURI, selectedProjectName);
              setCurrentSchema(fetchedSchema);
              setCurrentCollection(fetchedSchema.collectionName);
              setSelectedLocation(null);
            }}
          >
            {schemas.map((schema) => (
              <option key={schema.projectName} value={schema.projectName}>
                {schema.projectName}
              </option>
            ))}
          </select>
        </div>

        {/* Tile Style Selector */}
        <div className="form-group">
          <label>Map Style:</label>
          <select value={tileStyle} onChange={(e) => setTileStyle(e.target.value)}>
            <option value="Standard">Standard</option>
            <option value="Terrain">Terrain</option>
          </select>
        </div>

        {/* Day of Week Selector */}
        <div className="form-group">
          <label>Day of Week:</label>
          <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)}>
            <option value="Any">Any Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Time Selector */}
        <div className="form-group">
          <label>Time of Day:</label>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="Any">Any Time</option>
            {timeOptionsAMPM.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Wheelchair Toggle */}
        <div className="inline-checkbox-row">
          <label className="label-container">♿ Wheelchair Accessible</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={wheelchairOnly}
              onChange={() => setWheelchairOnly(!wheelchairOnly)}
            />
          </div>
        </div>
      </div>

      {/* Render Dynamic Categories */}
      {currentSchema?.categories.map((category) =>
        renderCheckboxGroupBySchema(
          category.categoryName,
          category.items,
          categoryChecks,
          handleCheckboxChange
        )
      )}
    </div>
  );
}

export default FilterPanel;
