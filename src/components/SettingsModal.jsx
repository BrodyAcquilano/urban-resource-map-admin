import React, { useState, useEffect } from "react";
import "../styles/modals.css";

function SettingsModal({
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  mongoURI,
  setMongoURI,
}) {
  const [inputValue, setInputValue] = useState(mongoURI || "");

  useEffect(() => {
    if (isSettingsModalOpen) {
      setInputValue(mongoURI || "");
    }
  }, [isSettingsModalOpen, mongoURI]);

  const handleSave = () => {
    setMongoURI(inputValue.trim());
    setIsSettingsModalOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    setMongoURI("");
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
