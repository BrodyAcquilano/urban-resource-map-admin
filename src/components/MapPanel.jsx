import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  GeoJSON,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatMapLayer from "./HeatMapLayer";
import "../styles/MapPanel.css";

function MapSync({ setMapCenter, setMapZoom, clearPatches }) {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      setMapCenter(map.getCenter());
      setMapZoom(map.getZoom());
      clearPatches();
    },
    zoomend: (e) => {
      const map = e.target;
      setMapZoom(map.getZoom());
      clearPatches();
    },
  });
  return null;
}

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function MapPanel({
  tileUrl,
  filteredMarkers,
  setSelectedLocation,
  setMapCenter,
  setMapZoom,
  heatMap,
  setHeatMap,
}) {
  return (
    <div className="map-panel">
      <MapContainer
        center={[43.4516, -80.4925]}
        zoom={13}
        scrollWheelZoom={true}
        className="map-background"
        zoomControl={false}
        worldCopyJump={false}
        maxBoundsViscosity={1.0}
        minZoom={3}
        maxZoom={18}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
      >
        <MapSync
          setMapCenter={setMapCenter}
          setMapZoom={setMapZoom}
          clearPatches={() => {
            setHeatMap(null);
          }}
        />

        <ZoomControl position="bottomleft" />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url={tileUrl}
          noWrap={true}
          crossOrigin="anonymous"
        />

        {filteredMarkers.map((marker) => (
          <Marker
            key={marker._id}
            position={[parseFloat(marker.latitude), parseFloat(marker.longitude)]}
            icon={customIcon}
            eventHandlers={{
              click: () => setSelectedLocation(marker),
            }}
          >
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              {marker.address || "No address"}
            </Popup>
          </Marker>
        ))}


        {heatMap && heatMap.pixels && heatMap.bounds && (
          <HeatMapLayer pixels={heatMap.pixels} bounds={heatMap.bounds} />
        )}
      </MapContainer>
    </div>
  );
}

export default MapPanel;

