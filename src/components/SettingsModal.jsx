// src/components/SettingsModal.jsx

import React, { useState } from "react";
import "../styles/modals.css";

function SettingsModal({
  isSettingsModalOpen,
  setIsSettingsModalOpen,
  setMongoURI,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleSave = () => {
    setMongoURI(inputValue);
    setIsSettingsModalOpen(false);
  };

  if (!isSettingsModalOpen) return null;

  return (
    <div className="modal-overlay centered-modal-overlay">
      <div className="modal">
        
       <button className="close-button" onClick={() => setIsSettingsModalOpen(false)}>
  ×
</button>

        <h2>Database Connection Settings</h2>
        <div className="form-group">
          <label>MongoDB Connection String:</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="mongodb+srv://..."
          />
        </div>
        <div className="buttons-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsSettingsModalOpen(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
