import React, { useState } from "react";
import InfoPanel from "../components/InfoPanel.jsx";
import '../styles/pages.css';

function Home({ selectedLocation }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
     {/* Info Panel Toggle + Panel */}
      <button
        className={`side-toggle toggle ${
          showInfo ? "" : "collapsed-toggle"
        }`}
        onClick={() => setShowInfo(!showInfo)}
      >
        ☰
      </button>
      <div
        className={`overlay-panel panel-wrapper ${
          showInfo ? "" : "collapsed"
        }`}
      >
        <InfoPanel selectedLocation={selectedLocation}/>
      </div>
    </>
  );
}

export default Home;
