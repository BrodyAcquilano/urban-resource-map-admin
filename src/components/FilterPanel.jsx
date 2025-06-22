// src/components/FilterPanel.jsx
import React, { useState, useEffect } from "react";
import {
  daysOfWeek,
  resources,
  services,
  amenities,
  timeOptionsAMPM,
  timeAMPMToMinutes,
} from "../data/dataModel.jsx";
import "../styles/panels.css";
import { renderCheckboxGroup } from "../utils/renderingHelpers.jsx";

function FilterPanel({
  tileStyle,
  setTileStyle,
  markers,
  setFilteredMarkers,
  setSelectedFilters,
}) {
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [dayFilter, setDayFilter] = useState("Any");
  const [timeFilter, setTimeFilter] = useState("Any");

  const initCheckedState = (labels) =>
    Object.fromEntries(labels.map((label) => [label, false]));

  const [resourceChecks, setResourceChecks] = useState(
    initCheckedState(resources)
  );
  const [serviceChecks, setServiceChecks] = useState(
    initCheckedState(services)
  );
  const [amenityChecks, setAmenityChecks] = useState(
    initCheckedState(amenities)
  );

  useEffect(() => {
    const filterMinutes =
      timeFilter !== "Any" ? timeAMPMToMinutes(timeFilter) : null;

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

      const allChecks = [
        [resourceChecks, marker.resources],
        [serviceChecks, marker.services],
        [amenityChecks, marker.amenities],
      ];

      return allChecks.every(([checks, values]) =>
        Object.entries(checks).every(([key, active]) =>
          active ? values?.[key] : true
        )
      );
    };

    setFilteredMarkers(markers.filter(matchesFilter));
  }, [
    markers,
    wheelchairOnly,
    dayFilter,
    timeFilter,
    resourceChecks,
    serviceChecks,
    amenityChecks,
    setFilteredMarkers,
  ]);

  const handleResourceChange = (label, checked) => {
    setResourceChecks((prev) => ({
      ...prev,
      [label]: checked,
    }));
  };

  const handleServiceChange = (label, checked) => {
    setServiceChecks((prev) => ({
      ...prev,
      [label]: checked,
    }));
  };

  const handleAmenityChange = (label, checked) => {
    setAmenityChecks((prev) => ({
      ...prev,
      [label]: checked,
    }));
  };

  useEffect(() => {
    const filterMinutes =
      timeFilter !== "Any" ? timeAMPMToMinutes(timeFilter) : null;

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

      const allChecks = [
        [resourceChecks, marker.resources],
        [serviceChecks, marker.services],
        [amenityChecks, marker.amenities],
      ];

      return allChecks.every(([checks, values]) =>
        Object.entries(checks).every(([key, active]) =>
          active ? values?.[key] : true
        )
      );
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

    updatedFilters.push(
      ...collectChecked(resourceChecks, "Resources"),
      ...collectChecked(serviceChecks, "Services"),
      ...collectChecked(amenityChecks, "Amenities")
    );

    setSelectedFilters(updatedFilters);
  }, [
    markers,
    wheelchairOnly,
    dayFilter,
    timeFilter,
    resourceChecks,
    serviceChecks,
    amenityChecks,
    setFilteredMarkers,
  ]);

  return (
    <div className="panel">
      <div className="section">
        <h2>Filter Panel</h2>
      </div>

      <div className="section">
        <h3>Global Settings</h3>

        <div className="form-group">
          <label>Map Style:</label>
          <select
            value={tileStyle}
            onChange={(e) => setTileStyle(e.target.value)}
          >
            <option value="Standard">Standard</option>
            <option value="Terrain">Terrain</option>
          </select>
        </div>

        <div className="form-group">
          <label>Day of Week:</label>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
          >
            <option value="Any">Any Day</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Time of Day:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="Any">Any Time</option>
            {timeOptionsAMPM.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

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

      {renderCheckboxGroup(
        "Resources",
        resources,
        resourceChecks,
        handleResourceChange
      )}
      {renderCheckboxGroup(
        "Services",
        services,
        serviceChecks,
        handleServiceChange
      )}
      {renderCheckboxGroup(
        "Amenities",
        amenities,
        amenityChecks,
        handleAmenityChange
      )}
    </div>
  );
}

export default FilterPanel;