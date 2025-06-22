// src/pages/Editor.jsx

import React, { useState } from "react";
import EditLocation from "../components/EditLocation.jsx";
import AddLocationModal from "../components/AddLocationModal.jsx";
import '../styles/pages.css';

function Editor({ setMarkers, selectedLocation, setSelectedLocation }) {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [showEditLocation, setShowEditLocation] = useState(false);

  return (
    <>
      {/* Editor Panel Toggle + Panel */}
      <button
        className={`side-toggle toggle ${
          showEditLocation ? "" : "collapsed-toggle"
        }`}
        onClick={() => setShowEditLocation(!showEditLocation)}
      >
        ☰
      </button>
      <div
        className={`overlay-panel panel-wrapper ${
          showEditLocation ? "" : "collapsed"
        }`}
      >
        <EditLocation
          setMarkers={setMarkers}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>

      {/* Centered Add Button */}
      <button
        className="modal-button"
        onClick={() => setAddModalOpen(true)}
      >
        ➕
      </button>

      {/* Modal */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        setMarkers={setMarkers}
      />
    </>
  );
}

export default Editor;
