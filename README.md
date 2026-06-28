<div align="center">

<img src="assets/GeocoreLogo.png" alt="Geocore logo" width="110" />

# 🗺️ Geocore City Data Visualizer

**An interactive world map that plots a 47,000-city dataset for Geocore — search, click, and inspect every city's data in one page.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-f7df1e?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-anahatmudgal.com-796eb3?style=flat-square&logo=googlechrome&logoColor=white)](https://anahatmudgal.com)
[![GitHub](https://img.shields.io/badge/GitHub-AnahatM-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/AnahatM)

[![Play Geocore](https://img.shields.io/badge/Play-Geocore.fun-60a5fa?style=for-the-badge&logo=googlechrome&logoColor=white)](https://geocore.fun)
[![Geocore Org](https://img.shields.io/badge/GitHub_Org-Geocore--fun-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Geocore-fun)

</div>

## About

The **Geocore City Data Visualizer** is a single-page tool for exploring the world-cities dataset that powers our geography game [Geocore](https://geocore.fun). It plots every city as a point on a dark interactive map, lets you search by name, and opens a detail panel showing each city's country, region, capital status, population, and coordinates. Drop in any `worldcities.csv` and it renders in seconds — no build step, no server, just open the file.

## Screenshots

| ![Geocore City Data Visualizer — full map](assets/Screenshot-1.png) | ![Geocore City Data Visualizer — city detail](assets/Screenshot-2.png) |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |

## Features

- **~47,000 cities plotted** — the full `worldcities.csv` dataset rendered as points on an interactive world map.
- **Instant search** — type a city name to jump straight to it, with start-of-name matches ranked first.
- **City detail panel** — click any point to see country, ISO2/ISO3 codes, admin region, capital status, population, coordinates, and dataset ID.
- **Drag-and-drop your own data** — auto-loads `worldcities.csv`, or click **Load CSV** to point it at any compatible file.
- **Fast canvas rendering** — points are drawn in batches on a Leaflet canvas layer so even 47K markers stay smooth.

## How to Use

1. Open `index.html` in any modern browser (it auto-loads `worldcities.csv` from the same folder).
2. Use the search bar to find a city, or click any point on the map.
3. Read the detail panel on the right; click **×** to close it.
4. To view a different dataset, click **Load CSV** and pick your own file.

The CSV needs these columns: `city, city_ascii, lat, lng, country, iso2, iso3, admin_name, capital, population, id`.

## Built With

![HTML5](https://img.shields.io/badge/-HTML5-05122A?style=flat-square&logo=html5&color=2a2e34)
![CSS3](https://img.shields.io/badge/-CSS3-05122A?style=flat-square&logo=css3&color=2a2e34)
![JavaScript](https://img.shields.io/badge/-JavaScript-05122A?style=flat-square&logo=javascript&color=2a2e34)
![Leaflet](https://img.shields.io/badge/-Leaflet-05122A?style=flat-square&logo=leaflet&color=2a2e34)
![PapaParse](https://img.shields.io/badge/-PapaParse-05122A?style=flat-square&logo=files&color=2a2e34)

## Links

- 🎮 Play the game: [Geocore.fun](https://geocore.fun)
- 🏢 GitHub Organization: [Geocore-fun](https://github.com/Geocore-fun)
- 👤 Developer: [Anahat Mudgal](https://anahatmudgal.com) · [@AnahatM](https://github.com/AnahatM)

## Author

**Anahat Mudgal**

- Website: [anahatmudgal.com](https://anahatmudgal.com)
- GitHub: [@AnahatM](https://github.com/AnahatM)
