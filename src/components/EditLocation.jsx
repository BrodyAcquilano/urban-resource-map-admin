// src/components/EditLocation.jsx

import React, { useState, useEffect } from "react";
import "../styles/panels.css";
import axios from "axios";
import {
  daysOfWeek,
  resources,
  services,
  amenities,
  timeOptionsAMPM,
  validateRequiredFields,
  getSafeLocationData,
} from "../data/dataModel.jsx";
import { renderCheckboxGroup } from "../utils/renderingHelpers.jsx";

function EditLocation({ setMarkers, selectedLocation, setSelectedLocation }) {
  const [formData, setFormData] = useState(getSafeLocationData());

  useEffect(() => {
    if (selectedLocation) {
      setFormData(getSafeLocationData(selectedLocation));
    }
  }, [selectedLocation]);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const handleEditSubmit = async () => {
    if (!validateRequiredFields(formData)) {
      window.alert(
        "Missing required entries, invalid latitude or longitude, no open days selected, or invalid hours (closing must be after opening)."
      );
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/locations/${selectedLocation._id}`,
        formData
      );
      const response = await axios.get(`${BASE_URL}/api/locations`);
      setMarkers(response.data);
      const updated = response.data.find(
        (loc) => loc._id === selectedLocation._id
      );
      if (updated) {
        setSelectedLocation(updated);
      }
      alert("Location updated!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update location");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this location?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/locations/${selectedLocation._id}`);
      const response = await axios.get(`${BASE_URL}/api/locations`);
      setMarkers(response.data);
      setSelectedLocation(null);
      alert("Location deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete location");
    }
  };

  const handleResourceChange = (label, checked) => {
    setFormData((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        [label]: checked,
      },
      scores: {
        ...prev.scores,
        resources: {
          ...prev.scores.resources,
          [label]: checked ? 3 : 0,
        },
      },
    }));
  };

  const handleServiceChange = (label, checked) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [label]: checked,
      },
      scores: {
        ...prev.scores,
        services: {
          ...prev.scores.services,
          [label]: checked ? 3 : 0,
        },
      },
    }));
  };

  const handleAmenityChange = (label, checked) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [label]: checked,
      },
      scores: {
        ...prev.scores,
        amenities: {
          ...prev.scores.amenities,
          [label]: checked ? 3 : 0,
        },
      },
    }));
  };

  if (!selectedLocation) {
    return (
      <div className="panel">
        <div className="section">
          <h2>Edit Location</h2>
        </div>
        <p>Select a marker to view details.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="section">
        <h2>Edit Location</h2>
      </div>

      <div className="section">
        <div className="form-group">
          <label>Name:</label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Required..."
            required
          />
        </div>

        <div className="form-group">
          <label>Latitude:</label>
          <input
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: e.target.value })
            }
            placeholder="Required..."
            required
          />
        </div>

        <div className="form-group">
          <label>Longitude:</label>
          <input
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: e.target.value })
            }
            placeholder="Required..."
            required
          />
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Optional..."
          />
        </div>

        <div className="form-group">
          <label>Website:</label>
          <input
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            placeholder="Optional..."
          />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Optional..."
          />
        </div>

        <div className="inline-checkbox-row">
          <label className="label-container">♿ Wheelchair Accessible</label>
          <div className="checkbox-container">
            <input
              type="checkbox"
              checked={formData.wheelchairAccessible}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  wheelchairAccessible: e.target.checked,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="section">
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
                        value={formData.openHours[day]?.open || ""}
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
                        value={formData.openHours[day]?.close || ""}
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
      </div>

      {renderCheckboxGroup(
        "Resources",
        resources,
        formData.resources,
        handleResourceChange
      )}
      {renderCheckboxGroup(
        "Services",
        services,
        formData.services,
        handleServiceChange
      )}
      {renderCheckboxGroup(
        "Amenities",
        amenities,
        formData.amenities,
        handleAmenityChange
      )}

      <div className="buttons-container">
        <button onClick={handleEditSubmit}>Save Changes</button>
        <button onClick={handleDelete} className="delete-btn">
          Delete Location
        </button>
      </div>
    </div>
  );
}

export default EditLocation;
