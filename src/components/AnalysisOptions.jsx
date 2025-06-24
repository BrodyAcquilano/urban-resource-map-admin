// src/components/AnalysisOptions.jsx

import React, { useState } from "react";
import * as turf from "@turf/turf";
import "../styles/panels.css";

function AnalysisOptions({ markers, setHeatMap, currentSchema }) {
  const categories = currentSchema?.categories || [];
  const categoryNames = categories.map((cat) => cat.categoryName);

  const allOptions = [
    "all",
    ...categoryNames,
    ...categoryNames.flatMap((cat1, i) =>
      categoryNames.slice(i + 1).map((cat2) => `${cat1}_${cat2}`)
    ),
  ];

  const [proximityBufferRadius, setProximityBufferRadius] = useState(1000);
  const [proximityResolution, setProximityResolution] = useState(100);
  const [proximityDecay, setProximityDecay] = useState("slow");

  const [distributionBufferRadius, setDistributionBufferRadius] =
    useState(1000);
  const [distributionResolution, setDistributionResolution] = useState(100);
  const [distributionCategoryType, setDistributionCategoryType] =
    useState("all");
  const [distributionMinPercentile, setDistributionMinPercentile] = useState(0);
  const [distributionMaxPercentile, setDistributionMaxPercentile] =
    useState(100);

  const [cumulativeBufferRadius, setCumulativeBufferRadius] = useState(1000);
  const [cumulativeResolution, setCumulativeResolution] = useState(100);
  const [cumulativeCategoryType, setCumulativeCategoryType] = useState("all");
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
    const hue = value * 120;
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

    if (distributionCategoryType === "all") {
      types = categoryNames;
    } else if (distributionCategoryType.includes("_")) {
      types = distributionCategoryType.split("_");
    } else {
      types = [distributionCategoryType];
    }

    const allScores = types.map((type) =>
      calculateScore(marker.scores?.[type], marker.categories?.[type])
    );

    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  };

  const cumulativeGetScore = (marker) => {
    let types = [];

    if (cumulativeCategoryType === "all") {
      types = categoryNames;
    } else if (cumulativeCategoryType.includes("_")) {
      types = cumulativeCategoryType.split("_");
    } else {
      types = [cumulativeCategoryType];
    }

    const allScores = types.map((type) =>
      calculateScore(marker.scores?.[type], marker.categories?.[type])
    );

    return allScores.reduce((a, b) => a + b, 0) / allScores.length;
  };

  const handleGenerateProximity = () => {
    const allPoints = markers.map((m) =>
      turf.point([parseFloat(m.longitude), parseFloat(m.latitude)], {
        marker: m,
      })
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
            turf.point([parseFloat(m.longitude), parseFloat(m.latitude)]),
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

    const allPoints = normalizedMarkers.map((m) =>
      turf.point([parseFloat(m.longitude), parseFloat(m.latitude)])
    );
    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

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

    setHeatMap({
      pixels,
      bounds: [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
    });
  };

  const handleGenerateCumulative = () => {
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

    const allPoints = normalizedMarkers.map((m) =>
      turf.point([parseFloat(m.longitude), parseFloat(m.latitude)])
    );
    const bbox = turf.bbox(turf.featureCollection(allPoints));
    let [minLng, minLat, maxLng, maxLat] = bbox;

    const expandLng = (maxLng - minLng) * 0.1;
    const expandLat = (maxLat - minLat) * 0.1;
    minLng -= expandLng;
    maxLng += expandLng;
    minLat -= expandLat;
    maxLat += expandLat;

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

    setHeatMap({
      pixels,
      bounds: [
        [minLat, minLng],
        [maxLat, maxLng],
      ],
    });
  };

  return (
    <div className="panel">
      <div className="section">
        <h2>Analysis Options</h2>
      </div>

      <div className="section">
        <h3>Proximity Influence Zones</h3>
        <p className="tooltip">
          Measures closeness. Clusters of nearby locations are a good indicator
          of high resource zones.
        </p>

        <div className="form-group">
          <label>Buffer Radius (m)::</label>
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
        </div>

        <div className="form-group">
          <label>Decay Rate:</label>
          <select
            value={proximityDecay}
            onChange={(e) => setProximityDecay(e.target.value)}
          >
            <option value="slow">slow</option>
            <option value="fast">fast</option>
          </select>
        </div>

        <div className="form-group">
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

        <div className="buttons-container">
          <button onClick={handleGenerateProximity}>Generate</button>
          <button
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Resource Distribution Mapping</h3>

        <p className="tooltip">
          This type of calculation creates a local gradient when locations merge
          into clusters, and highlights the resource distribution within local
          clusters. If an area is orange or red it means locations in that area
          are not contributing as much value as the others around it.
        </p>

        <div className="form-group">
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
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label>Category Type:</label>
          <select
            value={distributionCategoryType}
            onChange={(e) => setDistributionCategoryType(e.target.value)}
          >
            {allOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all"
                  ? "All"
                  : option.includes("_")
                  ? option.split("_").join(" + ")
                  : option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Percentile Range: </label>
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

        <div className="buttons-container">
          <button onClick={handleGenerateDistribution}>Generate</button>
          <button
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Cumulative Resource Influence</h3>

        <p className="tooltip">
          Highlights the added value of sharing resources and overlapping areas.
        </p>

        <div className="form-group">
          <label>Buffer Radius (m):</label>

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
        </div>

        <div className="form-group">
          <label>Decay Power:</label>
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
        </div>

        <div className="form-group">
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
        </div>

        <div className="form-group">
          <label>Category Type:</label>
          <select
            value={cumulativeCategoryType}
            onChange={(e) => setCumulativeCategoryType(e.target.value)}
          >
            {allOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all"
                  ? "All"
                  : option.includes("_")
                  ? option.split("_").join(" + ")
                  : option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Percentile Range:</label>
          <select
            value={cumulativeMinPercentile}
            onChange={(e) => setCumulativeMinPercentile(Number(e.target.value))}
          >
            {[0, 5, 10, 15, 20].map((val) => (
              <option key={val} value={val}>
                Min: {val}%
              </option>
            ))}
          </select>
          <select
            value={cumulativeMaxPercentile}
            onChange={(e) => setCumulativeMaxPercentile(Number(e.target.value))}
          >
            {[80, 85, 90, 95, 100].map((val) => (
              <option key={val} value={val}>
                Max: {val}%
              </option>
            ))}
          </select>
        </div>

        <div className="buttons-container">
          <button onClick={handleGenerateCumulative}>Generate</button>
          <button
            onClick={() => {
              setHeatMap(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="section">
        <h3>Color Legend:</h3>
      <ul>
  <li>🟢 = Well-Served / High Resource Zone</li>
  <li>🟡 = Moderately Served / Stable but Limited</li>
  <li>🟠 = Under-Served / Needs Attention</li>
  <li>🔴 = Critical Shortage / Resource Desert</li>
</ul>
      </div>
    </div>
  );
}

export default AnalysisOptions;
