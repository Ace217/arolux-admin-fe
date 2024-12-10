import React, { useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet"; // Updated import
import { EditControl } from "react-leaflet-draw";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Ensure you have osm-providers or a similar module defined
import osm from "./osm-providers"; // Adjust if necessary for osm-providers or your custom osm object

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const MapComponent = () => {
  const [center, setCenter] = useState({ lat: 24.4539, lng: 54.3773 });
  const ZOOM_LEVEL = 12;
  const mapRef = useRef();

  const _created = (e) => console.log(e);

  return (
    <>
    

      <div className="row">
        <div className="col text-center">

          <div className="col">
            {/* Replace Map with MapContainer */}
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef} style={{ height: "500px", width: "100%" }}>
              <FeatureGroup>
                <EditControl
                  position="topright"
                  onCreated={_created}
                  draw={{
                    // Uncomment or modify according to what you need to draw
                    // rectangle: false,
                    // circle: false,
                    // circlemarker: false,
                    // marker: false,
                    // polyline: false,
                  }}
                />
              </FeatureGroup>
              {/* Ensure osm is defined or import correctly */}
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapComponent;
