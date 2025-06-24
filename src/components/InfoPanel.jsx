// src/components/InfoPanel.jsx
import React from "react";
import "../styles/panels.css";
import { renderCheckedItemsBySchema } from "../utils/renderingHelpers.jsx";

function InfoPanel({ selectedLocation, currentSchema }) {
  if (!selectedLocation) {
    return (
      <div className="panel">
        <div className="section">
          <h2>Info Panel</h2>
        </div>
        <p>Select a marker to view details</p>
      </div>
    );
  }

  const {
    name,
    address,
    phone,
    website,
    wheelchairAccessible,
    openHours,
  } = selectedLocation;

  return (
    <div className="panel">
      <div className="section">
        <h2>Info Panel</h2>
      </div>

      <div className="section">
        <h3>{name}</h3>
        <p>{address?.trim() || "No address"}</p>
        {phone && <p>📞 {phone}</p>}
        {website && (
          <p>
            🌐{" "}
            <a href={website} target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </p>
        )}

        <p>
          ♿ {wheelchairAccessible ? "Wheelchair Accessible" : "Not Accessible"}
        </p>
      </div>

      <div className="section">
        <h3>Open Hours</h3>
        {openHours && Object.keys(openHours).length > 0 ? (
          <ul>
            {Object.entries(openHours).map(([day, times]) => (
              <li key={day}>
                <strong>{day}</strong>:{" "}
                {times.open ? `${times.open || "??"} – ${times.close || "??"}` : "Closed"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hours listed</p>
        )}
      </div>

      {/* Render dynamic categories */}
      {renderCheckedItemsBySchema(selectedLocation, currentSchema?.categories || [])}
    </div>
  );
}

export default InfoPanel;

