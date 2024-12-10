import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'; // Import leaflet-draw styles
import 'leaflet-draw'; // Ensure leaflet-draw is correctly imported

import BoxComponent from './Box';
import TypographyComponent from './Typography';
import ButtonComponent from './Button';

const carIconUrl = 'Images/cars.png';
const carIcon = L.icon({
  iconUrl: carIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapComponent = ({ cars = [], center, zoom, drawBoundary, boundaries }) => {
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [mapInstance, setMapInstance] = useState(null); // State to hold the map instance for control
  const [drawingActive, setDrawingActive] = useState(false);

  useEffect(() => {
    if (mapInstance) {
      // Create a feature group for the drawn items
      const drawnItems = new L.FeatureGroup();
      mapInstance.addLayer(drawnItems);

      // Initialize Leaflet Draw
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            allowIntersection: false, // Prevent self-intersecting polygons
            showArea: true, // Show area of the polygon
          },
          rectangle: false,
          circle: false,
          marker: false,
        },
        edit: {
          featureGroup: drawnItems,
        },
      });

      mapInstance.addControl(drawControl); // Add the draw control to the map

      // Debug: Check if Leaflet Draw is being initialized
      console.log("Leaflet Draw control initialized:", drawControl);

      // Event listener for when a polygon is created
      mapInstance.on(L.Draw.Event.CREATED, (event) => {
        console.log('Polygon Created:', event.layer);
        const layer = event.layer;
        const coordinates = layer.getLatLngs()[0].map((latlng) => [latlng.lat, latlng.lng]);
        setPolygonCoordinates(coordinates); // Update polygon coordinates state
        if (boundaries) boundaries(coordinates); // Pass coordinates back to parent component
      });

      // Debugging: Log the map instance to check if it's initialized
      console.log("Map instance initialized:", mapInstance);
    }
  }, [mapInstance, drawBoundary, boundaries]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      whenCreated={setMapInstance} // Set the map instance once it's created
    >
      <TileLayer
        url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b8e68eb148ac419c913cd230a9dca1f1"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render markers for cars */}
      {cars.length > 0 &&
        cars.map((car) => (
          <Marker key={car.id} position={car.position} icon={carIcon}>
            <Popup>
              <BoxComponent>
                <strong>{car.name}</strong>
                <TypographyComponent>Status: {car.status}</TypographyComponent>
                <TypographyComponent>City: {car.city || 'Not Specified'}</TypographyComponent>
              </BoxComponent>
            </Popup>
          </Marker>
        ))}

      {/* Render polygon if coordinates are available */}
      {polygonCoordinates.length > 2 && <Polygon positions={polygonCoordinates} color="blue" />}
    </MapContainer>
  );
};

export default MapComponent;
