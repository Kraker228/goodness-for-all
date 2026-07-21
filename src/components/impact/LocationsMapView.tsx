"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./locations-map.css";

import { IMPACT_LOCATIONS } from "./locations";

// Marker-druppel in de huisstijl-oranje (Harvest Orange #ed961d) die ook
// elders op de site wordt gebruikt. De standaard Leaflet-marker is een vaste
// blauwe afbeelding; om dezelfde druppelvorm in onze kleur te tonen gebruiken
// we een divIcon met een inline SVG (geen externe icoon-CDN nodig).
const markerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="26" height="40" viewBox="0 0 26 40" aria-hidden="true">
  <path d="M13 .8C6.1.8.5 6.4.5 13.3.5 22.4 13 39.2 13 39.2S25.5 22.4 25.5 13.3C25.5 6.4 19.9.8 13 .8z"
        fill="#ed961d" stroke="#334e1f" stroke-width="1.5"/>
  <circle cx="13" cy="13.3" r="4.6" fill="#334e1f"/>
</svg>`;

const orangeIcon = L.divIcon({
  className: "gfa-marker",
  html: markerSvg,
  iconSize: [26, 40],
  iconAnchor: [13, 39],
  popupAnchor: [0, -34],
});

// Begrenzing rond alle 15 locaties (Rotterdam + Den Haag), zodat ze allemaal
// goed zichtbaar zijn bij het laden van de kaart.
const bounds = L.latLngBounds(IMPACT_LOCATIONS.map((loc) => loc.position));

export default function LocationsMapView() {
  return (
    <MapContainer
      className="gfa-map"
      bounds={bounds}
      boundsOptions={{ padding: [40, 40] }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-bijdragers'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {IMPACT_LOCATIONS.map((loc) => (
        <Marker
          key={`${loc.title}-${loc.address}`}
          position={loc.position}
          icon={orangeIcon}
        >
          <Popup>
            <span className="gfa-popup__subtitle">{loc.subtitle}</span>
            <p className="gfa-popup__title">{loc.title}</p>
            <p className="gfa-popup__city">{loc.city}</p>
            <p className="gfa-popup__address">{loc.address}</p>
            <a
              className="gfa-popup__link"
              href={loc.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Bezoek website
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
