import React, { useRef, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import BoxComponent from './Box';
import TypographyComponent from './Typography';
import osm from "./osm-providers";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "Images/location-pointer.png",
  iconUrl: "Images/location-pointer.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const carIconUrl = 'Images/cars.png';
const carIcon = L.icon({
  iconUrl: carIconUrl,
  iconSize: [25, 25],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapComponent = ({ cars = [], center, zoom, isDrawingAllowed = false, drawBoundary, boundaries }) => {
  const mapRef = useRef();

  const handleCreated = (e) => {
    const layer = e.layer;
    let newBoundary = [];

    if (layer instanceof L.Marker) {
      // Handle marker creation (location pointer)
      const markerCoords = layer.getLatLng();
      console.log("Marker Coordinates:", markerCoords);
      newBoundary = [markerCoords.lat, markerCoords.lng];
    } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      // Handle polygon/rectangle creation (boundary)
      const coords = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
      console.log("Boundary Coordinates:", coords);
      newBoundary = coords;
    } else if (layer instanceof L.Circle) {
      // Handle circle creation
      const center = layer.getLatLng();
      const radius = layer.getRadius();
      newBoundary = [{ center: [center.lat, center.lng], radius }];
      console.log("Circle Coordinates:", newBoundary);
    } else if (layer instanceof L.CircleMarker) {
      // Handle circle marker creation
      const center = layer.getLatLng();
      newBoundary = [{ center: [center.lat, center.lng], radius: layer.getRadius() }];
      console.log("Circle Marker Coordinates:", newBoundary);
    }

    // If boundary data is available, send it back to the parent
    if (boundaries) {
      boundaries(newBoundary);
    }
  };

  const handleDeleted = (e) => {
    // When shapes are deleted, clear the boundaries state
    if (boundaries) {
      boundaries([]);  // Clear boundary coordinates
    }
  };

  return (
    <BoxComponent className="row">
      <BoxComponent className="col text-center">
        <BoxComponent className="col">
          <MapContainer 
            center={center} 
            zoom={zoom} 
            ref={mapRef} 
            style={{ height: "500px", width: "100%" }}
          >
            {isDrawingAllowed && (
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={handleCreated}
                  onDeleted={handleDeleted} // Handle shape deletion
                  draw={{
                    rectangle: true,
                    circle: true,
                    circlemarker: true,
                    marker: true,  // Allow marker placement
                    polyline: false,
                    polygon: true,
                  }}
                />
              </FeatureGroup>
            )}
            <TileLayer
              url={osm.maptiler.url}
              attribution={osm.maptiler.attribution}
            />
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
          </MapContainer>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
};

export default MapComponent;
