import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import BoxComponent from './Box';
import TypographyComponent from './Typography';
import ButtonComponent from './Button';

// Custom car icon
const carIconUrl = 'https://img.icons8.com/ios-filled/50/000000/car.png';
const carIcon = L.icon({
  iconUrl: carIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapComponent = ({ cars = [], center, zoom, drawBoundary, boundaries }) => {
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);

  // Map reference for controlling zoom and dragging
  const mapRef = React.useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.leafletElement;

      if (drawBoundary) {
        // Disable zooming and dragging when drawing boundary
        map.dragging.disable();
        map.scrollWheelZoom.disable();
      } else {
        // Enable zooming and dragging if not drawing
        map.dragging.enable();
        map.scrollWheelZoom.enable();
      }
    }
  }, [drawBoundary]);

  // Handle map click to add points for boundary drawing
  const handleMapClick = (e) => {
    if (drawBoundary) {
      const newCoordinates = [...polygonCoordinates, e.latlng];
      setPolygonCoordinates(newCoordinates);
    }
  };

  // Handle boundary submission
  const handleSubmitBoundary = () => {
    if (polygonCoordinates.length > 2) {
      boundaries(polygonCoordinates); // Pass the coordinates back to parent
      setPolygonCoordinates([]); // Reset after submission
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      onClick={handleMapClick}
      ref={mapRef} // Use mapRef to control map zoom/drag behavior
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

      {/* Render the Submit Boundary button only if drawing mode is enabled and enough points are added */}
      {drawBoundary && polygonCoordinates.length > 2 && (
        <BoxComponent padding="10px">
          <ButtonComponent onClick={handleSubmitBoundary}>
            Submit Boundary
          </ButtonComponent>
        </BoxComponent>
      )}
    </MapContainer>
  );
};

export default MapComponent;
