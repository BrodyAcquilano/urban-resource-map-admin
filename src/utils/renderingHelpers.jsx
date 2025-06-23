import React from "react";

// ────────────────
// Rendering Helpers
// ────────────────

// Used in: InfoPanel.jsx for displaying only checked items.
//Edit this if you want the information displayed differently.
//Like sorting labels alphabetically
export const renderCheckedItems = (data, labelList, title) => {
  const checked = labelList.filter((label) => data?.[label]);
  return (
    <div className="section">
      <h3>{title}</h3>
      {checked.length ? (
        <ul>
          {checked.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      ) : (
        <p>No {title.toLowerCase()} listed</p>
      )}
    </div>
  );
};

//Used in FilterPanel.jsx, and EditLocation.jsx
export function renderCheckboxGroup(title, items, values, onChange) {
  return (
    <div className="section">
      <h3>{title}</h3>
      {items.map((label) => (
        <div key={label} className="inline-checkbox-row">
          <label className="label-container">{label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[label]}
              onChange={(e) => onChange(label, e.target.checked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Used in AddLocationModal.jsx to render checkboxes with notes
export function renderCheckboxGroupWithNotes(title, items, values, onChange, notes) {
  return (
    <div className="section">
      <h3>{title}</h3>
      {items.map((label) => (
        <div key={label} className="inline-checkbox-row">
          <label className="label-container">{label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[label]}
              onChange={(e) => onChange(label, e.target.checked)}
            />
          </div>
          <div className="notes-cell">{notes[label] || ""}</div>
        </div>
      ))}
    </div>
  );
}