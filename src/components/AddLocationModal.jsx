// src/components/AddLocationModal.jsx

import React, { useState, useEffect } from "react";
import "../styles/modals.css";
import axios from "axios";
import { renderCheckboxGroupWithNotesBySchema } from "../utils/renderingHelpers.jsx";

import {
  daysOfWeek,
  timeOptionsAMPM,
  validateRequiredFields,
  initializeLocationData,
} from "../utils/locationHelpers.jsx";

function AddLocationModal({
   mongoURI,
  isOpen,
  onClose,
  setMarkers,
  currentSchema,
  currentCollection,
}) {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(
    initializeLocationData(currentSchema)
  );

  // Reset form when modal opens or schema changes
  useEffect(() => {
    if (isOpen) {
      setFormData(initializeLocationData(currentSchema));
      setPage(1);
    }
  }, [isOpen, currentSchema]);

  const resetForm = () => {
    setFormData(initializeLocationData(currentSchema));
  };

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    const locationData = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    if (!validateRequiredFields(locationData)) {
      window.alert(
        "Missing required entries, invalid latitude or longitude, no open days selected, or invalid hours (closing must be after opening)."
      );
      return;
    }

    try {
     const res = await axios.post(`${BASE_URL}/api/locations`, locationData, {
  params: { collectionName: currentCollection, mongoURI: mongoURI }
});
      const newMarker = { _id: res.data.id, ...locationData };
      setMarkers((prev) => [...prev, newMarker]);

      resetForm();
      setPage(1);
      onClose();
      alert("Location added!");
    } catch (err) {
      console.error("Submit failed:", err);
      window.alert("Failed to save location.");
    }
  };

  const handleCheckboxChange = (categoryName, label, checked) => {
    setFormData((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryName]: {
          ...prev.categories[categoryName],
          [label]: checked,
        },
      },
      scores: {
        ...prev.scores,
        [categoryName]: {
          ...prev.scores[categoryName],
          [label]: checked ? 3 : 0,
        },
      },
    }));
  };

  if (!isOpen) return null;

  const totalPages = 1 + (currentSchema?.categories.length || 0);
  const isCategoryPage = page > 1 && page <= totalPages;
  const currentCategoryIndex = page - 2; // Page 2 is the first category
  const currentCategory = currentSchema?.categories[currentCategoryIndex];

  return (
    <div className="modal-overlay centered-modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Add New Location</h2>

        {page === 1 && (
          <>
            <h3>Basic Information</h3>
            <label>
              Location Name:
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Required..."
                required
              />
            </label>
            <label>
              Latitude:
              <input
                type="number"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    latitude: parseFloat(e.target.value),
                  }))
                }
                placeholder="Required..."
                required
              />
            </label>
            <label>
              Longitude:
              <input
                type="number"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    longitude: parseFloat(e.target.value),
                  }))
                }
                placeholder="Required..."
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={formData.address}
                placeholder="Optional..."
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </label>
            <label>
              Website:
              <input
                type="text"
                value={formData.website}
                placeholder="Optional..."
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                value={formData.phone}
                placeholder="Optional..."
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </label>
            <div className="inline-checkbox-row">
              <label className="label-container">
                ♿ Wheelchair Accessible
              </label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  checked={formData.wheelchairAccessible}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      wheelchairAccessible: e.target.checked,
                    }))
                  }
                />
              </div>
            </div>

            <h3>Open Hours</h3>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Open?</th>
                  <th>Open</th>
                  <th>Close</th>
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map((day) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.isLocationOpen[day]}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            isLocationOpen: {
                              ...prev.isLocationOpen,
                              [day]: checked,
                            },
                            openHours: {
                              ...prev.openHours,
                              [day]: checked
                                ? { open: "9:00 a.m.", close: "5:00 p.m." }
                                : { open: "", close: "" },
                            },
                          }));
                        }}
                      />
                    </td>
                    {formData.isLocationOpen[day] ? (
                      <>
                        <td>
                          <select
                            value={formData.openHours[day].open}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                openHours: {
                                  ...prev.openHours,
                                  [day]: {
                                    ...prev.openHours[day],
                                    open: e.target.value,
                                  },
                                },
                              }))
                            }
                          >
                            {timeOptionsAMPM.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={formData.openHours[day].close}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                openHours: {
                                  ...prev.openHours,
                                  [day]: {
                                    ...prev.openHours[day],
                                    close: e.target.value,
                                  },
                                },
                              }))
                            }
                          >
                            {timeOptionsAMPM.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <td colSpan={2}>
                        <div className="closed-cell">Closed</div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Dynamic Category Rendering */}
        {isCategoryPage &&
          renderCheckboxGroupWithNotesBySchema(
            currentCategory,
            formData.categories[currentCategory.categoryName],
            (label, checked) =>
              handleCheckboxChange(currentCategory.categoryName, label, checked)
          )}

        <div className="buttons-container">
          {page > 1 && <button onClick={() => setPage(page - 1)}>Back</button>}
          {page < totalPages ? (
            <button onClick={() => setPage(page + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddLocationModal;

