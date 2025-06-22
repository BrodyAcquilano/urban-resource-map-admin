import React from "react";
import "../styles/panels.css";
import { resources, services, amenities } from "../data/dataModel.jsx";
import { renderCheckedItems } from "../utils/renderingHelpers.jsx";

function InfoPanel({ selectedLocation }) {
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
    resources: selectedResources = {},
    services: selectedServices = {},
    amenities: selectedAmenities = {},
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
                {times.open
                  ? `${times.open || "??"} – ${times.close || "??"}`
                  : "Closed"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hours listed</p>
        )}
      </div>

      {renderCheckedItems(selectedResources, resources, "Resources")}
      {renderCheckedItems(selectedServices, services, "Services")}
      {renderCheckedItems(selectedAmenities, amenities, "Amenities")}
    </div>
  );
}

export default InfoPanel;
