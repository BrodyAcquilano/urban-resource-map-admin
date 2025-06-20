import React, { useState } from "react";
import * as turf from "@turf/turf";
import "./AnalysisOptions.css";

function AnalysisOptions({ markers, setHeatMap }) {
  //state for Proximity Influence Zones
  const [proximityBufferRadius, setProximityBufferRadius] = useState(1000);
  const [proximityResolution, setProximityResolution] = useState(100);
  const [proximityDecay, setProximityDecay] = useState("slow");

  //state for Resource Distirbution Mapping
  const [distributionBufferRadius, setDistributionBufferRadius] =
    useState(1000);
  const [distributionResolution, setDistributionResolution] = useState(100);
  const [distributionResourceType, setDistributionResourceType] =
    useState("all");
  const [distributionMinPercentile, setDistributionMinPercentile] = useState(0);
  const [distributionMaxPercentile, setDistributionMaxPercentile] =
    useState(100);

  //state for Cumulative Resource Influence
  const [cumulativeBufferRadius, setCumulativeBufferRadius] = useState(1000);
  const [cumulativeResolution, setCumulativeResolution] = useState(100);
  const [cumulativeResourceType, setCumulativeResourceType] = useState("all");
  const [cumulativeMinPercentile, setCumulativeMinPercentile] = useState(0);
  const [cumulativeMaxPercentile, setCumulativeMaxPercentile] = useState(100);
  const [cumulativeDecayPower, setCumulativeDecayPower] = useState(1);

  const normalize = (value, min, max) =>
    max !== min ? (value - min) / (max - min) : 1;

  const calculateScore = (scores = {}, flags = {}) => {
    const values = Object.entries(flags)
      .filter(([key, enabled]) => enabled)
      .map(([key]) => scores[key] ?? 0);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  function interpolateColor(value) {
    value = Math.max(0, Math.min(1, value));
    const hue = value * 120; // 0 = red, 120 = green
    return `hsl(${hue}, 100%, 50%)`;
  }

  const getPercentile = (arr, percentile) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
  };

  const distributionGetScore = (marker) => {
    let types = [];
    if (distributionResourceType === "all") {
      types = ["resources", "services", "amenities"];
    } else if (distributionResourceType === "resources_amenities") {
      types = ["resources", "amenities"];
    } else if (distributionResourceType === "resources_services") {
      types = ["resources", "services"];
    } else if (distributionResourceType === "services_amenities") {
      types = ["services", "amenities"];
    } else {
      types = [distributionResourceType];
    }

    const allScores = types.map((type) =>
      calculateScore(marker.scores?.[type], marker[type])
    );
    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  };

  const cumulativeGetScore = (marker) => {
    let types = [];
    if (cumulativeResourceType === "all") {
      types = ["resources", "services", "amenities"];
    } else if (cumulativeResourceType === "resources_amenities") {
      types = ["resources", "amenities"];
    } else if (cumulativeResourceType === "resources_services") {
      types = ["resources", "services"];
    } else if (cumulativeResourceType === "services_amenities") {
      types = ["services", "amenities"];
    } else {
      types = [cumulativeResourceType];
    }

    const allScores = types.map((type) =>
      calculateScore(marker.scores?.[type], marker[type])
    );
    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  };

  const handleGenerateProximity = () => {
    const allPoints = markers.map((m) =>
      turf.point([m.longitude, m.latitude], { marker: m })
    );

    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

    const cols = proximityResolution;
    const rows = proximityResolution;
    const latStep = (maxLat - minLat) / rows;
    const lngStep = (maxLng - minLng) / cols;
    const pixels = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lat = maxLat - y * latStep;
        const lng = minLng + x * lngStep;
        const pixelPoint = turf.point([lng, lat]);

        let totalInfluence = 0;
        let totalWeight = 0;

        for (const m of markers) {
          const dist = turf.distance(
            pixelPoint,
            turf.point([m.longitude, m.latitude]),
            { units: "kilometers" }
          );

          const distance = dist * 1000;
          if (distance > proximityBufferRadius) continue;

          let proximityInfluence = 0;
          const decayFactor = 1 - distance / proximityBufferRadius;

          if (proximityDecay === "slow") {
            proximityInfluence = Math.sqrt(decayFactor);
          } else if (proximityDecay === "fast") {
            proximityInfluence = decayFactor;
          }

          if (proximityInfluence > 0) {
            totalInfluence += proximityInfluence;
            totalWeight += 1;
          }
        }

        const normalized = totalWeight > 0 ? totalInfluence / totalWeight : 0;
        const color = interpolateColor(normalized);

        pixels.push({ x, y, value: normalized, color });
      }
    }

    setHeatMap({
      pixels,
      bounds: [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
    });
  };

  const handleGenerateDistribution = () => {
    // Step 1: Score and normalize markers
    const scoredMarkers = markers.map((m) => ({
      ...m,
      score: distributionGetScore(m),
    }));
    const scores = scoredMarkers.map((m) => m.score);

    const min = getPercentile(scores, distributionMinPercentile);
    const max = getPercentile(scores, distributionMaxPercentile);

    const normalizedMarkers = scoredMarkers.map((m) => ({
      ...m,
      normalized: normalize(m.score, min, max),
    }));

    // Step 2: Calculate bounds
    const allPoints = normalizedMarkers.map((m) =>
      turf.point([m.longitude, m.latitude])
    );
    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

    // Step 3: Iterate grid and calculate weighted influence
    const cols = distributionResolution;
    const rows = distributionResolution;
    const latStep = (maxLat - minLat) / rows;
    const lngStep = (maxLng - minLng) / cols;
    const pixels = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lat = maxLat - y * latStep;
        const lng = minLng + x * lngStep;
        const pixelPoint = turf.point([lng, lat]);

        let totalInfluence = 0;
        let totalWeight = 0;

        for (const m of normalizedMarkers) {
          const dist = turf.distance(
            pixelPoint,
            turf.point([m.longitude, m.latitude]),
            { units: "kilometers" }
          );

          const distance = dist * 1000;
          if (distance > distributionBufferRadius) continue;

          const decayFactor = 1 - distance / distributionBufferRadius;
          const decayPower =
            distributionBufferRadius > 5000
              ? 6
              : distributionBufferRadius > 2000
              ? 3
              : 1.5;
          const proximityInfluence = Math.pow(decayFactor, decayPower);

          if (proximityInfluence > 0) {
            totalInfluence += proximityInfluence * m.normalized;
            totalWeight += proximityInfluence;
          }
        }

        const value = totalWeight > 0 ? totalInfluence / totalWeight : 0;
        const color = interpolateColor(value);

        pixels.push({ x, y, value, color });
      }
    }

    // Step 4: Output result
    setHeatMap({
      pixels,
      bounds: [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
    });
  };

  const handleGenerateCumulative = () => {
    // Step 1: Score and normalize markers
    const scoredMarkers = markers.map((m) => ({
      ...m,
      score: cumulativeGetScore(m),
    }));
    const scores = scoredMarkers.map((m) => m.score);

    const min = getPercentile(scores, cumulativeMinPercentile);
    const max = getPercentile(scores, cumulativeMaxPercentile);

    const normalizedMarkers = scoredMarkers.map((m) => ({
      ...m,
      normalized: normalize(m.score, min, max),
    }));

    // Step 2: Calculate bounds
    const allPoints = normalizedMarkers.map((m) =>
      turf.point([m.longitude, m.latitude])
    );
    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

    // Step 3: Iterate grid and integrate influence
    const cols = cumulativeResolution;
    const rows = cumulativeResolution;
    const latStep = (maxLat - minLat) / rows;
    const lngStep = (maxLng - minLng) / cols;
    const pixels = [];

    let maxPixelValue = 0;
    const decayPower = cumulativeDecayPower;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lat = maxLat - y * latStep;
        const lng = minLng + x * lngStep;
        const pixelPoint = turf.point([lng, lat]);

        let cumulativeValue = 0;

        for (const m of normalizedMarkers) {
          const dist = turf.distance(
            pixelPoint,
            turf.point([m.longitude, m.latitude]),
            { units: "kilometers" }
          );
          const meters = dist * 1000;

          if (meters <= cumulativeBufferRadius) {
            const decay = 1 - meters / cumulativeBufferRadius;
            const adjusted = decay ** cumulativeDecayPower;
            cumulativeValue += m.normalized * adjusted;
          }
        }

        maxPixelValue = Math.max(maxPixelValue, cumulativeValue);
        pixels.push({
          x,
          y,
          value: cumulativeValue,
          color: interpolateColor(cumulativeValue / maxPixelValue),
        });
      }
    }

    // Step 4: Output result
    setHeatMap({
      pixels,
      bounds: [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
    });
  };

  return (
    <div className="options-panel">
      <h2>Analysis Options</h2>

      <div className="options-section">
        <h3>Proximity Influence Zones</h3>
        <p className="tooltip">
          A measure of closeness. Having many locations close together is a good
          indicator of high resource value.
        </p>

        <div className="inputs">
          <label>Buffer Radius (m):</label>
          <select
            value={proximityBufferRadius}
            onChange={(e) => setProximityBufferRadius(Number(e.target.value))}
          >
            {[250, 500, 1000, 2000, 3000, 5000, 8000, 10000].map((val) => (
              <option key={val} value={val}>
                {val} m
              </option>
            ))}
          </select>

          <label>Decay Rate:</label>
          <select
            value={proximityDecay}
            onChange={(e) => setProximityDecay(e.target.value)}
          >
            <option value="slow">slow</option>
            <option value="fast">fast</option>
          </select>

          <label>Resolution:</label>
          <select
            value={proximityResolution}
            onChange={(e) => setProximityResolution(Number(e.target.value))}
          >
            {[50, 100, 150, 200].map((val) => (
              <option key={val} value={val}>
                {val} x {val}
              </option>
            ))}
          </select>
        </div>

        <div className="analysis-buttons">
          <button className="generate-button" onClick={handleGenerateProximity}>
            Generate
          </button>
          <button
            className="clear-button"
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="options-section">
        <h3>Resource Distribution Mapping</h3>

        <p className="tooltip">
          This type of calculation creates a local gradient when locations merge
          into clusters, and highlights the resource distribution within local
          clusters. If an area is orange or red it means locations in that area
          are not contributing as much value as the others around it.
        </p>

        <div className="inputs">
          <label>Buffer Radius (m):</label>

          <select
            value={distributionBufferRadius}
            onChange={(e) =>
              setDistributionBufferRadius(Number(e.target.value))
            }
          >
            {[250, 500, 1000, 2000, 3000, 5000, 8000, 10000].map((val) => (
              <option key={val} value={val}>
                {val} m
              </option>
            ))}
          </select>

          <label>Resolution:</label>
          <select
            value={distributionResolution}
            onChange={(e) => setDistributionResolution(Number(e.target.value))}
          >
            {[50, 100, 150, 200].map((val) => (
              <option key={val} value={val}>
                {val} x {val}
              </option>
            ))}
          </select>

          <label>Resource Type:</label>
          <select
            value={distributionResourceType}
            onChange={(e) => setDistributionResourceType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="resources_amenities">Resources + Amenities</option>
            <option value="resources_services">Resources + Services</option>
            <option value="services_amenities">Services + Amenities</option>
            <option value="resources">Resources</option>
            <option value="services">Services</option>
            <option value="amenities">Amenities</option>
          </select>

          <label>Percentile Range:</label>
          <div className="percentile-controls">
            <select
              value={distributionMinPercentile}
              onChange={(e) =>
                setDistributionMinPercentile(Number(e.target.value))
              }
            >
              {[0, 5, 10, 15, 20].map((val) => (
                <option key={val} value={val}>
                  Min: {val}%
                </option>
              ))}
            </select>
            <select
              value={distributionMaxPercentile}
              onChange={(e) =>
                setDistributionMaxPercentile(Number(e.target.value))
              }
            >
              {[80, 85, 90, 95, 100].map((val) => (
                <option key={val} value={val}>
                  Max: {val}%
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="analysis-buttons">
          <button
            className="generate-button"
            onClick={handleGenerateDistribution}
          >
            Generate
          </button>
          <button
            className="clear-button"
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="options-section">
        <h3>Cumulative Resource Influence</h3>

        <p className="tooltip">
          This type of calculation highlights the added value of resource
          sharing within communities and shows the interconnectedness of
          different services.
        </p>

        <div className="inputs">
          <label>Buffer Radius:</label>

          <select
            value={cumulativeBufferRadius}
            onChange={(e) => setCumulativeBufferRadius(Number(e.target.value))}
          >
            {[250, 500, 1000, 2000, 3000, 5000, 8000, 10000].map((val) => (
              <option key={val} value={val}>
                {val} m
              </option>
            ))}
          </select>

          <label>
            Decay Power:
            <select
              value={cumulativeDecayPower}
              onChange={(e) => setCumulativeDecayPower(Number(e.target.value))}
            >
              {[0.5, 1, 2, 5, 10].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </label>

          <label>Resolution:</label>
          <select
            value={cumulativeResolution}
            onChange={(e) => setCumulativeResolution(Number(e.target.value))}
          >
            {[50, 100, 150, 200].map((val) => (
              <option key={val} value={val}>
                {val} x {val}
              </option>
            ))}
          </select>

          <label>Resource Type:</label>
          <select
            value={cumulativeResourceType}
            onChange={(e) => setCumulativeResourceType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="resources_amenities">Resources + Amenities</option>
            <option value="resources_services">Resources + Services</option>
            <option value="services_amenities">Services + Amenities</option>
            <option value="resources">Resources</option>
            <option value="services">Services</option>
            <option value="amenities">Amenities</option>
          </select>

          <label>Percentile Range:</label>
          <div className="percentile-controls">
            <select
              value={cumulativeMinPercentile}
              onChange={(e) =>
                setCumulativeMinPercentile(Number(e.target.value))
              }
            >
              {[0, 5, 10, 15, 20].map((val) => (
                <option key={val} value={val}>
                  Min: {val}%
                </option>
              ))}
            </select>
            <select
              value={cumulativeMaxPercentile}
              onChange={(e) =>
                setCumulativeMaxPercentile(Number(e.target.value))
              }
            >
              {[80, 85, 90, 95, 100].map((val) => (
                <option key={val} value={val}>
                  Max: {val}%
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="analysis-buttons">
          <button
            className="generate-button"
            onClick={handleGenerateCumulative}
          >
            Generate
          </button>
          <button
            className="clear-button"
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="legend">
        <h4>Color Legend:</h4>
        <ul>
          <li>
            <span></span> 🟢 = Well-Served / High Resource Zone
          </li>
          <li>
            <span></span> 🟡 = Moderately Served / Stable but Limited
          </li>
          <li>
            <span></span> 🟠 = Under-Served / Needs Attention
          </li>
          <li>
            <span></span> 🔴 = Critical Shortage / Resource Desert
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AnalysisOptions;
