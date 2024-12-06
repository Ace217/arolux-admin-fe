import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import BoxComponent from './Box';
import TypographyComponent from './Typography';

// Use an online car icon URL for demonstration
const carIconUrl = 'https://img.icons8.com/ios-filled/50/000000/car.png'; // Replace this with your own car icon URL or local path

// Custom car icon
const carIcon = L.icon({
  iconUrl: carIconUrl,
  iconSize: [32, 32], // Adjust the size of the car icon
  iconAnchor: [16, 32], // Adjust anchor to align icon properly
  popupAnchor: [0, -32], // Adjust popup position
});

const MapComponent = ({ cars, center, zoom }) => {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
      {/* Use OpenStreetMap tiles with English labels */}
<TileLayer
  url="https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=b8e68eb148ac419c913cd230a9dca1f1"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
/>

      {cars.map((car) => (
        <Marker
          key={car.id}
          position={car.position}
          icon={carIcon} // Use the custom car icon here
        >
          <Popup>
            <BoxComponent>
              <strong>{car.name}</strong>
              <TypographyComponent>Status: {car.status}</TypographyComponent>
              <TypographyComponent>City: {car.city || 'Not Specified'}</TypographyComponent>
            </BoxComponent>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
