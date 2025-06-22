// src/pages/Export.jsx

import React, { useState } from "react";
import ExportOptions from "../components/ExportOptions.jsx";
import ExportPreviewModal from "../components/ExportPreviewModal.jsx";
import '../styles/pages.css';
import { captureOffscreenMap } from "../utils/captureOffscreenMap.js";

function Export({ filteredMarkers, selectedLocation, selectedFilters }) {
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [title, setTitle] = useState("");
  const [includeFilters, setIncludeFilters] = useState(false);
  const [includeAllLocations, setIncludeAllLocations] = useState(false);
  const [includeSelected, setIncludeSelected] = useState(false);
  const [orientation, setOrientation] = useState("portrait");
  const [notes, setNotes] = useState("");
  const [mapImage, setMapImage] = useState(null);
  return (
    <>
      {/* Editor Panel Toggle + Panel */}
      <button
        className={`side-toggle toggle ${
          showExportOptions ? "" : "collapsed-toggle"
        }`}
        onClick={() => setShowExportOptions(!showExportOptions)}
      >
        ☰
      </button>
      <div
        className={`overlay-panel panel-wrapper ${
          showExportOptions ? "" : "collapsed"
        }`}
      >
        <ExportOptions
          setTitle={setTitle}
          setIncludeFilters={setIncludeFilters}
          setIncludeAllLocations={setIncludeAllLocations}
          setIncludeSelected={setIncludeSelected}
          orientation={orientation}
          setOrientation={setOrientation}
          setNotes={setNotes}
        />
      </div>

      {/* Centered Export Button */}
      <button
        className="modal-button"
        onClick={async () => {
          const snapshot = await captureOffscreenMap();
          setMapImage(snapshot);
          setExportModalOpen(true);
        }}
      >
        ⬇️
      </button>

      {/* Modal */}
      <ExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title={title}
        includeFilters={includeFilters}
        includeAllLocations={includeAllLocations}
        includeSelected={includeSelected}
        orientation={orientation}
        notes={notes}
        filteredMarkers={filteredMarkers}
        selectedLocation={selectedLocation}
        selectedFilters={selectedFilters}
        mapImage={mapImage}
      />
    </>
  );
}

export default Export;
