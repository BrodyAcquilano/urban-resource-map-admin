import React, { useState } from "react";
import "../styles/panels.css";

function ExportOptions({
  setTitle,
  setIncludeFilters,
  setIncludeAllLocations,
  setIncludeSelected,
  orientation,
  setOrientation,
  setNotes,
}) {
  const handleTitleChange = (e) => setTitle(e.target.value);
  const toggleFilters = () => setIncludeFilters((prev) => !prev);
  const toggleAllLocations = () => setIncludeAllLocations((prev) => !prev);
  const toggleSelected = () => setIncludeSelected((prev) => !prev);
  const handleOrientationChange = (e) => setOrientation(e.target.value);

  return (
    <div className="panel">
      <div className="section">
        <h2>Export Options</h2>
      </div>

      <div className="section">
        <h4>Header Title:</h4>
        <input
          type="text"
          onChange={handleTitleChange}
          placeholder="Enter header title..."
        />
      </div>

      <div className="section">
        <h4>Map Data:</h4>

        <div className="inline-checkbox-row">
          <label className="label-container">Include Applied Filters</label>
          <div className="checkbox-container">
            <input type="checkbox" onChange={toggleFilters} />
          </div>
        </div>

        <div className="inline-checkbox-row">
          <label className="label-container">List All Locations</label>
          <div className="checkbox-container">
            <input type="checkbox" onChange={toggleAllLocations} />
          </div>
        </div>

        <div className="inline-checkbox-row">
          <label className="label-container">
            List Selected Location Details
          </label>
          <div className="checkbox-container">
            <input type="checkbox" onChange={toggleSelected} />
          </div>
        </div>
      </div>

      <div className="section">
        <h4>Page Orientation:</h4>

        <div className="inline-checkbox-row">
          <label className="label-container">Portrait</label>
          <div className="checkbox-container">
            <input
              type="radio"
              name="orientation"
              value="portrait"
              checked={orientation === "portrait"}
              onChange={handleOrientationChange}
            />
          </div>
        </div>

        <div className="inline-checkbox-row">
          <label className="label-container">Landscape</label>
          <div className="checkbox-container">
            <input
              type="radio"
              name="orientation"
              value="landscape"
              checked={orientation === "landscape"}
              onChange={handleOrientationChange}
            />
          </div>
        </div>
      </div>

      <div className="section">
        <h4>Additional Notes</h4>
        <textarea
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="Enter any additional information or instructions here..."
        />
      </div>
    </div>
  );
}

export default ExportOptions;

