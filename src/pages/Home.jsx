import React, { useState } from "react";
import InfoPanel from "../components/InfoPanel.jsx";
import SettingsModal from "../components/SettingsModal.jsx";
import "../styles/pages.css";

function Home({ mongoURI, setMongoURI, selectedLocation, currentSchema }) {
  const [showInfo, setShowInfo] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  return (
    <>
      {/* Info Panel Toggle + Panel */}
      <button
        className={`side-toggle toggle ${showInfo ? "" : "collapsed-toggle"}`}
        onClick={() => setShowInfo(!showInfo)}
      >
        ☰
      </button>
      <div
        className={`overlay-panel panel-wrapper ${showInfo ? "" : "collapsed"}`}
      >
        <InfoPanel
          selectedLocation={selectedLocation}
          currentSchema={currentSchema}
        />
      </div>

       <button
          className="modal-button"
          onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}
        >
          ⚙️
        </button>
        <SettingsModal
          isSettingsModalOpen={isSettingsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          mongoURI={mongoURI}
          setMongoURI={setMongoURI}
        />
    </>
  );
}

export default Home;
