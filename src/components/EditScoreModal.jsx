import React, { useState, useEffect } from "react";
import "../styles/modals.css";
import axios from "axios";
import { getSafeLocationData } from "../data/dataModel.jsx";

function EditScoreModal({
  isOpen,
  onClose,
  selectedLocation,
  setSelectedLocation,
  setMarkers,
}) {
  const [page, setPage] = useState(1);
  const [locationData, setLocationData] = useState(getSafeLocationData());
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Initialize locationData safely when modal opens
  useEffect(() => {
    if (selectedLocation) {
      setLocationData(getSafeLocationData(selectedLocation));
    }
  }, [selectedLocation]);

  // Score editing handler
  const handleScoreChange = (category, key, value) => {
    setLocationData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [category]: {
          ...prev.scores[category],
          [key]: parseInt(value),
        },
      },
    }));
  };

  // Handle submit and resync local state
  const handleSubmit = async () => {
    if (!selectedLocation || !locationData) {
      alert("No location selected.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/locations/${selectedLocation._id}`,
        locationData
      );

      const res = await axios.get(`${BASE_URL}/api/locations`);
      setMarkers(res.data);

      const updated = res.data.find((loc) => loc._id === selectedLocation._id);
      if (updated) {
        setSelectedLocation(updated);
      }

      alert("Location updated!");
      setPage(1);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to save location.");
    }
  };

  // Handle no selection fallback
  if (!isOpen) return null;
  if (!selectedLocation) {
    return (
      <div className="modal-overlay centered-modal-overlay">
        <div className="modal">
          <h2>Edit Score</h2>
          <p>Select a marker to view and rate its resources.</p>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay centered-modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Edit Score</h2>

        {page === 1 && (
          <>
            <h3>Selected Location:</h3>
            <p>{locationData.name}</p>
          </>
        )}

        {page === 2 && (
          <>
            <h3>Resources</h3>
            {Object.values(locationData.resources || {}).some((val) => val) ? (
              <table>
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Rating</th>
                    <th>Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(locationData.resources || {}).map(
                    ([key, val]) =>
                      val ? (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            <select
                              value={locationData.scores.resources[key] || ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  "resources",
                                  key,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select</option>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {"⭐".repeat(
                              locationData.scores.resources[key] || 0
                            )}
                          </td>
                        </tr>
                      ) : null
                  )}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">
                No resources available at this location.
              </p>
            )}
          </>
        )}

        {page === 3 && (
          <>
            <h3>Services</h3>
            {Object.values(locationData.services || {}).some((val) => val) ? (
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Rating</th>
                    <th>Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(locationData.services || {}).map(
                    ([key, val]) =>
                      val ? (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            <select
                              value={locationData.scores.services[key] || ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  "services",
                                  key,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select</option>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {"⭐".repeat(
                              locationData.scores.services[key] || 0
                            )}
                          </td>
                        </tr>
                      ) : null
                  )}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">
                No services available at this location.
              </p>
            )}
          </>
        )}
        {page === 4 && (
          <>
            <h3>Amenities</h3>
            {Object.values(locationData.amenities || {}).some((val) => val) ? (
              <table>
                <thead>
                  <tr>
                    <th>Amenity</th>
                    <th>Rating</th>
                    <th>Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(locationData.amenities || {}).map(
                    ([key, val]) =>
                      val ? (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>
                            <select
                              value={locationData.scores.amenities[key] || ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  "amenities",
                                  key,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select</option>
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {"⭐".repeat(
                              locationData.scores.amenities[key] || 0
                            )}
                          </td>
                        </tr>
                      ) : null
                  )}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">
                No amenities available at this location.
              </p>
            )}
          </>
        )}

        <div className="buttons-container">
          {page > 1 && <button onClick={() => setPage(page - 1)}>Back</button>}
          {page < 4 ? (
            <button onClick={() => setPage(page + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditScoreModal;
