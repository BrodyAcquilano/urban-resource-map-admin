import React, { useState, useEffect } from "react";
import "../styles/modals.css";

function SettingsModal({
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  mongoURI,
  setMongoURI,
}) {
  const [mongoURIInputString, setMongoURIInputString] = useState("");

  useEffect(() => {
    if (isSettingsModalOpen) {
      // Only show user input, never the default
      if (mongoURI === import.meta.env.VITE_DEFAULT_MONGO_URI) {
        setMongoURIInputString("");
      } else {
        setMongoURIInputString(mongoURI);
      }
    }
  }, [isSettingsModalOpen, mongoURI]);

  const handleSave = () => {
    if (mongoURIInputString.trim() === "") {
      // User left input blank → fallback to default
      setMongoURI(import.meta.env.VITE_DEFAULT_MONGO_URI);
    } else {
      // User provided a custom URI
      setMongoURI(mongoURIInputString.trim());
    }
    setIsSettingsModalOpen(false);
  };

  const handleClear = () => {
    setMongoURIInputString("");
    // Do not update mongoURI yet → mongoURI will fallback to default only on save
  };

  if (!isSettingsModalOpen) return null;

  return (
    <div className="modal-overlay centered-modal-overlay">
      <div className="modal">
        <button
          className="close-button"
          onClick={() => setIsSettingsModalOpen(false)}
        >
          ×
        </button>
        <h3>Database Connection Settings</h3>

        <div className="form-group">
          <label>MongoDB Connection String:</label>
          <input
            type="text"
            value={mongoURIInputString}
            onChange={(e) => setMongoURIInputString(e.target.value)}
            placeholder="mongodb+srv://<username>:<password>@<cluster-address>/<database>?retryWrites=true&w=majority"
          />
        </div>

        <div className="buttons-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;

