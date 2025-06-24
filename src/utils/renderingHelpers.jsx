import React from "react";

// ─────────────────────────────────────────────
// Rendering Helpers (Updated for Dynamic Schema)
// ─────────────────────────────────────────────

// Used in: InfoPanel.jsx to display only checked items by dynamic category.
export const renderCheckedItemsBySchema = (marker, categories) => {
  return categories.map((category) => {
    // Correct: Check inside the correct category
    const checkedItems = category.items.filter(
      (item) => marker.categories?.[category.categoryName]?.[item.label]
    );

    return (
      <div className="section" key={category.categoryName}>
        <h3>{category.categoryName}</h3>
        {checkedItems.length ? (
          <ul>
            {checkedItems.map((item) => (
              <li key={item.label}>{item.label}</li>
            ))}
          </ul>
        ) : (
          <p>No {category.categoryName.toLowerCase()} listed</p>
        )}
      </div>
    );
  });
};

// Used in: FilterPanel.jsx and EditLocation.jsx for rendering dynamic categories.
export function renderCheckboxGroupBySchema(title, items, values, onChange) {
  return (
    <div className="section" key={title}>
      <h3>{title}</h3>
      {items.map((item) => (
        <div key={item.label} className="inline-checkbox-row">
          <label className="label-container">{item.label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[item.label]}
              onChange={(e) => onChange(item.label, e.target.checked)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Used in: AddLocationModal.jsx for rendering dynamic categories with notes.
export function renderCheckboxGroupWithNotesBySchema(
  category,
  values,
  onChange
) {
  return (
    <div key={category.categoryName}>
      <h3>{category.categoryName}</h3>
      {category.items.map((item) => (
        <div key={item.label} className="inline-checkbox-row">
          <label className="label-container">{item.label}</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={!!values[item.label]}
              onChange={(e) => onChange(item.label, e.target.checked)}
            />
          </div>
          <div className="notes-cell">{item.note || ""}</div>
        </div>
      ))}
    </div>
  );
}
