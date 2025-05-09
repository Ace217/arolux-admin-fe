import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import DetailComponent from "./DetailComponent";
import ButtonComponent from "./Button";
import MapComponent from "./MapComponent";
import Cookies from "js-cookie";
import { getGeoLocationDetails } from "../api/constants";
import { toast } from "react-toastify";
import L from "leaflet";

const LocationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const locationId = queryParams.get("id");

  useEffect(() => {
    const fetchLocationDetails = async () => {
      if (!locationId) {
        toast.error("Location ID is missing");
        navigate("/locations");
        return;
      }

      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await getGeoLocationDetails(locationId, token);

        if (
          response?.data?.success &&
          response.data.data.geoLocation &&
          response.data.data.geoLocation.length > 0
        ) {
          setLocationData(response.data.data.geoLocation[0]);
        } else {
          toast.error("Failed to fetch location details");
          navigate("/locations");
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
        toast.error("An error occurred while fetching location details");
        navigate("/locations");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationDetails();
  }, [locationId, navigate]);

  const handleBackClick = () => {
    navigate("/locations");
  };

  // Function to find the center of the polygon
  const findPolygonCenter = (coordinates) => {
    if (
      !coordinates ||
      !coordinates.length ||
      !coordinates[0] ||
      !coordinates[0].length
    ) {
      return [0, 0]; // Default center if no coordinates
    }

    // Calculate center of polygon
    let latSum = 0;
    let lngSum = 0;
    const points = coordinates[0];

    points.forEach((point) => {
      latSum += point[1]; // Lat is the second element
      lngSum += point[0]; // Lng is the first element
    });

    return [latSum / points.length, lngSum / points.length];
  };

  // Function to prepare map boundaries for display
  const prepareBoundaries = (boundaries) => {
    if (
      !boundaries ||
      !boundaries.coordinates ||
      !boundaries.coordinates.length
    ) {
      return [];
    }

    // Convert API format [lng, lat] to Leaflet format [lat, lng]
    return boundaries.coordinates[0].map((coord) => [coord[1], coord[0]]);
  };

  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="30px"
      backgroundColor="var(--light)"
      minHeight="100vh"
      width="100%"
    >
      <BoxComponent
        display="flex"
        justifyContent="space-between"
        width="80%"
        maxWidth="1200px"
        marginBottom="20px"
      >
        <TypographyComponent
          fontSize="36px"
          color="var(--primary)"
          fontFamily="var(--main)"
          fontWeight="700"
        >
          Location Details
        </TypographyComponent>
        <ButtonComponent
          onClick={handleBackClick}
          variant="contained"
          backgroundColor="var(--primary)"
          sx={{
            color: "var(--white)",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          Back to Locations
        </ButtonComponent>
      </BoxComponent>

      {loading ? (
        <BoxComponent display="flex" justifyContent="center" padding="50px">
          <TypographyComponent fontSize="20px">
            Loading location details...
          </TypographyComponent>
        </BoxComponent>
      ) : locationData ? (
        <BoxComponent
          width="80%"
          maxWidth="1200px"
          backgroundColor="var(--white)"
          borderRadius="10px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
          display="flex"
          flexDirection="column"
          padding="20px"
          gap="20px"
        >
          {/* Basic Details */}
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Location Information
            </TypographyComponent>
            <BoxComponent
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
            >
              <DetailComponent
                title="Location Name"
                details={locationData.name}
              />
              <DetailComponent
                title="Status"
                details={locationData.isActive ? "Active" : "Inactive"}
              />
              <DetailComponent
                title="Created At"
                details={new Date(locationData.createdAt).toLocaleString()}
              />
              <DetailComponent title="ID" details={locationData._id} />
            </BoxComponent>
          </BoxComponent>

          {/* Map with Boundaries */}
          {locationData.boundaries && (
            <BoxComponent width="100%" marginBottom="20px">
              <TypographyComponent
                fontSize="24px"
                color="var(--primary)"
                fontWeight="600"
                marginBottom="15px"
              >
                Location Boundaries
              </TypographyComponent>
              <BoxComponent height="500px" width="100%">
                {/* Use the updated MapComponent with polygonPositions prop */}
                <MapComponent
                  center={findPolygonCenter(
                    locationData.boundaries.coordinates
                  )}
                  zoom={5}
                  isDrawingAllowed={false}
                  polygonPositions={prepareBoundaries(locationData.boundaries)}
                />
              </BoxComponent>
            </BoxComponent>
          )}
        </BoxComponent>
      ) : (
        <BoxComponent display="flex" justifyContent="center" padding="50px">
          <TypographyComponent fontSize="20px">
            No location data found
          </TypographyComponent>
        </BoxComponent>
      )}
    </BoxComponent>
  );
};

export default LocationDetails;
