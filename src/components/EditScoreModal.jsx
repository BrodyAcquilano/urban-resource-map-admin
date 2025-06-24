// src/components/EditScoreModal.jsx

import React, { useState, useEffect } from "react";
import "../styles/modals.css";
import axios from "axios";
import { getSafeLocationData } from "../utils/locationHelpers.jsx";

function EditScoreModal({
  isOpen,
  onClose,
  selectedLocation,
  setSelectedLocation,
  setMarkers,
  currentSchema,
  currentCollection,
}) {
  const [page, setPage] = useState(1); // Page 1 is the selected location page
  const [locationData, setLocationData] = useState(getSafeLocationData({}, currentSchema));

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (selectedLocation) {
      setLocationData(getSafeLocationData(selectedLocation, currentSchema));
      setPage(1);
    }
  }, [selectedLocation, currentSchema]);

  const handleScoreChange = (categoryName, key, value) => {
    setLocationData((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [categoryName]: {
          ...(prev.scores?.[categoryName] || {}),
          [key]: parseInt(value),
        },
      },
    }));
  };

  const handleSubmit = async () => {
    if (!selectedLocation || !locationData) {
      alert("No location selected.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/locations/${selectedLocation._id}`,
        locationData,
        { params: { collectionName: currentCollection } }
      );

      const res = await axios.get(`${BASE_URL}/api/locations`, {
        params: { collectionName: currentCollection },
      });
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
        <h2>Edit Score</h2>

        {page === 1 && (
          <>
            <h3>Selected Location:</h3>
            <p>{locationData.name}</p>
          </>
        )}

        {isCategoryPage && currentCategory && (
          <>
            <h3>{currentCategory.categoryName}</h3>
            {Object.values(locationData.categories?.[currentCategory.categoryName] || {}).some((val) => val) ? (
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Rating</th>
                    <th>Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategory.items.map((item) =>
                    locationData.categories?.[currentCategory.categoryName]?.[item.label] ? (
                      <tr key={item.label}>
                        <td>{item.label}</td>
                        <td>
                          <select
                            value={locationData.scores?.[currentCategory.categoryName]?.[item.label] || ""}
                            onChange={(e) =>
                              handleScoreChange(
                                currentCategory.categoryName,
                                item.label,
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
                            locationData.scores?.[currentCategory.categoryName]?.[item.label] || 0
                          )}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            ) : (
              <p className="empty-message">No {currentCategory.categoryName.toLowerCase()} available at this location.</p>
            )}
          </>
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

export default EditScoreModal;

