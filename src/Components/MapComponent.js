import React, { useRef, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { Polyline, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import osm from "./osm-providers";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "Images/location-pointer.png",
  iconUrl: "Images/location-pointer.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const carIcon = L.icon({
  iconUrl: "Images/cars.png",
  iconSize: [22, 22],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const pickupIcon = L.icon({
  iconUrl: "Images/location-pointer.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "pickup-marker", // This will be green
});

const dropoffIcon = L.icon({
  iconUrl: "Images/location-pointer.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: "dropoff-marker", // This will be red
});

const decodePolyline = (str, precision = 5) => {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, precision);

  while (index < str.length) {
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    shift = result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

    lat += latitude_change;
    lng += longitude_change;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
};

const MapComponent = ({
  cars = [],
  center,
  zoom,
  isDrawingAllowed = false,
  drawBoundary,
  boundaries,
  markers = [],
  polyline,
  children, // Added children prop to accept additional elements
  polygonPositions = [], // Added prop for polygon positions
}) => {
  const mapRef = useRef();
  const [decodedPolyline, setDecodedPolyline] = React.useState([]);

  useEffect(() => {
    if (polyline) {
      const decoded = decodePolyline(polyline);
      setDecodedPolyline(decoded);
    }
  }, [polyline]);

  const handleCreated = (e) => {
    const layer = e.layer;
    let newBoundary = [];

    if (layer instanceof L.Marker) {
      const markerCoords = layer.getLatLng();
      newBoundary = [markerCoords.lat, markerCoords.lng];
    } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
      const coords = layer
        .getLatLngs()[0]
        .map((latlng) => [latlng.lat, latlng.lng]);
      newBoundary = coords;
    } else if (layer instanceof L.Circle) {
      const center = layer.getLatLng();
      const radius = layer.getRadius();
      newBoundary = [{ center: [center.lat, center.lng], radius }];
    } else if (layer instanceof L.CircleMarker) {
      const center = layer.getLatLng();
      newBoundary = [
        { center: [center.lat, center.lng], radius: layer.getRadius() },
      ];
    }

    if (boundaries) {
      boundaries(newBoundary);
    }
  };

  const handleDeleted = (e) => {
    if (boundaries) {
      boundaries([]);
    }
  };

  return (
    <BoxComponent className="row">
      <BoxComponent className="col text-center">
        <BoxComponent className="col">
          <style>
            {`
              .pickup-marker img {
                filter: hue-rotate(120deg); /* Makes the marker green */
              }
              .dropoff-marker img {
                filter: hue-rotate(0deg); /* Keeps the marker red */
              }
              .location-label {
                background: none;
                border: none;
                box-shadow: none;
                font-weight: bold;
                padding: 0;
                text-align: center;
                margin-top: -5px;
              }
              .location-label.pickup {
                color: #00a800;
              }
              .location-label.dropoff {
                color: #d10000;
              }
            `}
          </style>
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
                  onDeleted={handleDeleted}
                  draw={{
                    rectangle: true,
                    circle: true,
                    circlemarker: true,
                    marker: true,
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
                      <TypographyComponent fontWeight="600">
                        {car.name}
                      </TypographyComponent>
                      <TypographyComponent>
                        Status: {car.status}
                      </TypographyComponent>
                      <TypographyComponent>
                        City: {car.city || "Not Specified"}
                      </TypographyComponent>
                    </BoxComponent>
                  </Popup>
                </Marker>
              ))}
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={marker.position}
                icon={marker.type === "pickup" ? pickupIcon : dropoffIcon}
              >
                <Popup>
                  <BoxComponent>
                    <TypographyComponent
                      fontWeight="600"
                      className={`location-label ${marker.type}`}
                    >
                      {marker.type === "pickup"
                        ? "📍 Pickup Location"
                        : "🎯 Drop-off Location"}
                    </TypographyComponent>
                    <TypographyComponent>{marker.title}</TypographyComponent>
                  </BoxComponent>
                </Popup>
              </Marker>
            ))}
            {decodedPolyline.length > 0 && (
              <Polyline
                positions={decodedPolyline}
                color="#0066ff"
                weight={4}
                opacity={0.7}
              />
            )}
            {/* Display polygon if positions are provided */}
            {polygonPositions.length > 0 && (
              <Polygon
                positions={polygonPositions}
                pathOptions={{
                  color: "#ff5722",
                  weight: 3,
                  fillColor: "#ff9800",
                  fillOpacity: 0.3,
                }}
              />
            )}
            {/* Render children components (if any) */}
            {children}
          </MapContainer>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
};

export default MapComponent;
