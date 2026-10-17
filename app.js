/* ─────────────────────────────────────────────────────────────────────────
   Geocore City Data Visualizer — app logic
   Plots the worldcities.csv dataset on an interactive Leaflet map.
   ───────────────────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  // ── Map setup ────────────────────────────────────────────────────────────
  const canvasRenderer = L.canvas({ padding: 0.5 });

  const map = L.map("map", {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    worldCopyJump: true,
    renderer: canvasRenderer,
  });

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a> · City data: <a href="https://simplemaps.com/data/world-cities">SimpleMaps World Cities</a> (CC BY 4.0)',
      maxZoom: 19,
      subdomains: "abcd",
    },
  ).addTo(map);

  // ── State ─────────────────────────────────────────────────────────────────
  let allCities = []; // parsed CSV rows
  let markers = []; // parallel array of L.circleMarker
  let markerGroup = null;
  let activeMarker = null; // currently highlighted

  const NORMAL_STYLE = {
    radius: 3,
    fillColor: "#58a6ff",
    color: "transparent",
    fillOpacity: 0.75,
    weight: 0,
    renderer: canvasRenderer,
  };
  const HIGHLIGHT_STYLE = {
    radius: 9,
    fillColor: "#f0883e",
    color: "#ffffff",
    fillOpacity: 1,
    weight: 2,
    renderer: canvasRenderer,
  };
  const SEARCH_HIGHLIGHT_STYLE = {
    radius: 9,
    fillColor: "#ffd700",
    color: "#ffffff",
    fillOpacity: 1,
    weight: 2,
    renderer: canvasRenderer,
  };

  // ── Loading helpers ───────────────────────────────────────────────────────
  function showLoading(visible, text = "", pct = 0) {
    const el = document.getElementById("loading-overlay");
    el.classList.toggle("hidden", !visible);
    document.getElementById("loading-text").textContent = text;
    document.getElementById("loading-bar").style.width = pct + "%";
  }

  // ── CSV loading ───────────────────────────────────────────────────────────
  function loadCSV(source) {
    showLoading(true, "Parsing CSV…", 5);
    document.getElementById("welcome").classList.add("hidden");

    Papa.parse(source, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        allCities = results.data.filter(
          (r) =>
            r.lat &&
            r.lng &&
            !isNaN(parseFloat(r.lat)) &&
            !isNaN(parseFloat(r.lng)),
        );
        showLoading(
          true,
          `Plotting ${allCities.length.toLocaleString()} cities…`,
          15,
        );
        setTimeout(plotCities, 30);
      },
      error(err) {
        showLoading(false);
        alert("Error parsing CSV: " + err.message);
      },
    });
  }

  // ── Plot all cities ────────────────────────────────────────────────────────
  function plotCities() {
    if (markerGroup) map.removeLayer(markerGroup);
    markerGroup = L.layerGroup().addTo(map);
    markers = new Array(allCities.length);
    activeMarker = null;

    const total = allCities.length;
    const BATCH = 3000;
    let i = 0;

    function nextBatch() {
      const end = Math.min(i + BATCH, total);
      for (; i < end; i++) {
        const city = allCities[i];
        const lat = parseFloat(city.lat);
        const lng = parseFloat(city.lng);
        const m = L.circleMarker([lat, lng], { ...NORMAL_STYLE });
        m._cityIndex = i;
        m.on("click", onMarkerClick);
        markerGroup.addLayer(m);
        markers[i] = m;
      }

      const pct = 15 + Math.round((i / total) * 80);
      showLoading(
        true,
        `Plotting… ${i.toLocaleString()} / ${total.toLocaleString()}`,
        pct,
      );

      if (i < total) {
        setTimeout(nextBatch, 0);
      } else {
        showLoading(false);
        document.getElementById("stats").textContent =
          `${total.toLocaleString()} cities`;
      }
    }

    nextBatch();
  }

  // ── Marker click ──────────────────────────────────────────────────────────
  function onMarkerClick(e) {
    L.DomEvent.stopPropagation(e);
    selectMarker(e.target, HIGHLIGHT_STYLE);
  }

  function selectMarker(marker, style) {
    if (activeMarker && activeMarker !== marker) {
      activeMarker.setStyle(NORMAL_STYLE);
    }
    marker.setStyle(style);
    activeMarker = marker;
    showInfoPanel(allCities[marker._cityIndex]);
  }

  // ── Info panel ────────────────────────────────────────────────────────────
  function showInfoPanel(city) {
    document.getElementById("info-city-name").textContent =
      city.city || "Unknown";
    document.getElementById("info-panel").classList.add("open");

    let html = "";

    // ASCII name (if different)
    if (city.city_ascii && city.city_ascii !== city.city) {
      html += row("ASCII Name", city.city_ascii);
    }

    html += row("Country", city.country || "—");
    html += row(
      "ISO2 / ISO3",
      [city.iso2, city.iso3].filter(Boolean).join(" / ") || "—",
    );
    html += row("Admin Region", city.admin_name || "—");

    if (city.capital) {
      html += `<div class="info-row"><span class="info-label">Capital Status</span>
         <span class="info-value"><span class="capital-badge">${capitalLabel(city.capital)}</span></span></div>`;
    }

    if (city.population) {
      const pop = parseInt(city.population, 10);
      html += row(
        "Population",
        isNaN(pop) ? city.population : pop.toLocaleString(),
        "big",
      );
    }

    html += `<div class="info-divider"></div>`;
    html += row("Latitude", parseFloat(city.lat).toFixed(4) + "°");
    html += row("Longitude", parseFloat(city.lng).toFixed(4) + "°");
    html += row("Dataset ID", city.id || "—");

    document.getElementById("info-content").innerHTML = html;
  }

  function row(label, value, cls = "") {
    return `<div class="info-row">
    <span class="info-label">${label}</span>
    <span class="info-value${cls ? " " + cls : ""}">${value}</span>
  </div>`;
  }

  function capitalLabel(v) {
    const labels = {
      primary: "National Capital",
      admin: "Administrative Capital",
      minor: "Minor Capital",
      "": "Capital",
    };
    return labels[v] || v;
  }

  document.getElementById("info-close").addEventListener("click", () => {
    document.getElementById("info-panel").classList.remove("open");
    if (activeMarker) {
      activeMarker.setStyle(NORMAL_STYLE);
      activeMarker = null;
    }
  });

  // ── Search ────────────────────────────────────────────────────────────────
  const searchInput = document.getElementById("search-input");
  const searchResultsEl = document.getElementById("search-results");

  searchInput.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();
    if (q.length < 2 || allCities.length === 0) {
      searchResultsEl.style.display = "none";
      return;
    }

    // Exact-start matches first, then substring matches
    const starts = [];
    const contains = [];
    for (let i = 0; i < allCities.length; i++) {
      const name = (allCities[i].city || "").toLowerCase();
      const ascii = (allCities[i].city_ascii || "").toLowerCase();
      if (name.startsWith(q) || ascii.startsWith(q)) starts.push(i);
      else if (name.includes(q) || ascii.includes(q)) contains.push(i);
      if (starts.length >= 10 && contains.length >= 10) break;
    }

    const results = [...starts, ...contains].slice(0, 18);

    if (results.length === 0) {
      searchResultsEl.style.display = "none";
      return;
    }

    searchResultsEl.innerHTML = results
      .map((idx) => {
        const c = allCities[idx];
        return `<div class="sr-item" data-idx="${idx}">
        <span class="sr-city">${c.city}</span>
        <span class="sr-country">${c.country}</span>
      </div>`;
      })
      .join("");
    searchResultsEl.style.display = "block";
  });

  searchResultsEl.addEventListener("click", function (e) {
    const item = e.target.closest(".sr-item");
    if (!item) return;
    const idx = parseInt(item.dataset.idx, 10);
    zoomToCity(idx);
    searchResultsEl.style.display = "none";
    searchInput.value = allCities[idx].city;
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const first = searchResultsEl.querySelector(".sr-item");
      if (first) first.click();
    }
    if (e.key === "Escape") {
      searchResultsEl.style.display = "none";
      this.blur();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#search-wrap")) {
      searchResultsEl.style.display = "none";
    }
  });

  function zoomToCity(idx) {
    const city = allCities[idx];
    const marker = markers[idx];
    const lat = parseFloat(city.lat);
    const lng = parseFloat(city.lng);

    map.setView([lat, lng], 10, { animate: true, duration: 0.6 });

    if (marker) {
      selectMarker(marker, SEARCH_HIGHLIGHT_STYLE);
    } else {
      showInfoPanel(city);
    }
  }

  // ── File picker ───────────────────────────────────────────────────────────
  document.getElementById("load-btn").addEventListener("click", () => {
    document.getElementById("file-input").click();
  });
  document
    .getElementById("file-input")
    .addEventListener("change", function () {
      if (this.files[0]) loadCSV(this.files[0]);
    });

  // ── Auto-load worldcities.csv from same directory ─────────────────────────
  fetch("worldcities.csv")
    .then((r) => {
      if (!r.ok) throw new Error("not found");
      return r.blob();
    })
    .then((blob) => loadCSV(new File([blob], "worldcities.csv")))
    .catch(() => {
      document.getElementById("stats").textContent =
        "Click Load CSV to begin";
    });
})();
