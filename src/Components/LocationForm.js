import React, { useState, useEffect } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import MapComponent from "./MapComponent";
import ButtonComponent from "./Button";
import { useLocation } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  createGeoLocation,
  updateGeoLocation,
  getGeoLocationDetails,
} from "../api/constants";
import { toast } from "react-toastify";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function LocationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state?.title || "Add Location";
  const locationData = location.state?.locationData;
  const isEditMode = title.toLowerCase().includes("update");

  const [locationName, setLocationName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [boundaries, setBoundaries] = useState([]);
  const [boundaryStatus, setBoundaryStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);

  useEffect(() => {
    // If we're in edit mode, fetch complete location details if we don't have boundaries
    const fetchLocationDetails = async () => {
      if (
        isEditMode &&
        locationData &&
        locationData.id &&
        !locationData.boundaries
      ) {
        setFetchingLocation(true);
        try {
          const token = Cookies.get("token");
          const response = await getGeoLocationDetails(locationData.id, token);

          if (
            response?.data?.success &&
            response.data.data.geoLocation &&
            response.data.data.geoLocation.length > 0
          ) {
            const fullLocationData = response.data.data.geoLocation[0];

            setLocationName(fullLocationData.name);
            setIsActive(fullLocationData.isActive);

            // Set boundaries if available
            if (
              fullLocationData.boundaries &&
              fullLocationData.boundaries.coordinates &&
              fullLocationData.boundaries.coordinates[0]
            ) {
              const coords = fullLocationData.boundaries.coordinates[0];
              // Convert from API format [lng, lat] to Leaflet format [lat, lng]
              const convertedCoords = coords.map((coord) => [
                coord[1],
                coord[0],
              ]);
              setBoundaries(convertedCoords);
              setBoundaryStatus(true);
            }
          } else {
            toast.error("Failed to fetch location details");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          toast.error("An error occurred while fetching location details");
        } finally {
          setFetchingLocation(false);
        }
      } else if (locationData) {
        // If we already have location data from the state, use it
        setLocationName(locationData.name || "");
        setIsActive(locationData.Status === "Active");
      }
    };

    fetchLocationDetails();
  }, [isEditMode, locationData]);

  // Set boundaries from location data if available
  useEffect(() => {
    if (locationData?.boundaries && locationData.boundaries.coordinates) {
      try {
        const coords = locationData.boundaries.coordinates[0];
        setBoundaries(coords.map((coord) => [coord[1], coord[0]])); // Convert from API format
        setBoundaryStatus(true);
      } catch (error) {
        console.error("Error parsing existing boundaries:", error);
      }
    }
  }, [locationData]);

  const handleAddBoundary = (newBoundary) => {
    if (!newBoundary || newBoundary.length === 0) {
      setBoundaryStatus(false);
    } else {
      setBoundaries(newBoundary);
      setBoundaryStatus(true);
    }
  };

  const handleCancel = () => {
    navigate("/locations");
  };

  const validateForm = () => {
    if (!locationName.trim()) {
      setErrorMessage("Location name is required");
      return false;
    }

    if (!boundaryStatus || boundaries.length === 0) {
      setErrorMessage("Please draw a boundary on the map");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const prepareCoordinatesForAPI = (boundaryCoords) => {
    // Convert from Leaflet format [lat, lng] to API format [lng, lat]
    // Make sure the polygon is closed by adding the first point as the last point if needed
    let formattedCoords = boundaryCoords.map((coord) => [coord[1], coord[0]]);

    // Check if the polygon is closed (first point = last point)
    if (
      formattedCoords.length > 0 &&
      (formattedCoords[0][0] !==
        formattedCoords[formattedCoords.length - 1][0] ||
        formattedCoords[0][1] !==
          formattedCoords[formattedCoords.length - 1][1])
    ) {
      // Close the polygon by adding the first point at the end
      formattedCoords.push(formattedCoords[0]);
    }

    return formattedCoords;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = Cookies.get("token");
      const coordinates = prepareCoordinatesForAPI(boundaries);

      const locationPayload = {
        name: locationName,
        isActive: isActive,
        coordinates: coordinates,
      };

      let response;

      if (isEditMode && locationData && locationData.id) {
        // Update existing location
        response = await updateGeoLocation(
          locationData.id,
          locationPayload,
          token
        );
        if (response?.data?.success) {
          toast.success("Location updated successfully!");
          navigate("/locations");
        } else {
          toast.error(response?.data?.message || "Failed to update location");
        }
      } else {
        // Create new location
        response = await createGeoLocation(locationPayload, token);
        if (response?.data?.success) {
          toast.success("Location created successfully!");
          navigate("/locations");
        } else {
          toast.error(response?.data?.message || "Failed to create location");
        }
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(
        `An error occurred while ${
          isEditMode ? "updating" : "creating"
        } the location`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      backgroundColor="var(--light)"
    >
      <BoxComponent
        margin="50px"
        padding="15px"
        borderRadius="10px"
        width="80%"
        gap="5px"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor="var(--white)"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <BoxComponent width="100%" display="flex" flexDirection="column">
          <BoxComponent
            display="flex"
            justifyContent="flex-end"
            width="100%"
            sx={{ cursor: "pointer" }}
          >
            <CancelIcon onClick={handleCancel} fontSize="large" />
          </BoxComponent>

          <TypographyComponent
            fontSize="40px"
            color="var(--dull)"
            fontFamily="var(--main)"
            fontWeight="600"
            marginBottom="10px"
            textAlign="center"
            width="100%"
          >
            {title}
          </TypographyComponent>
        </BoxComponent>

        {fetchingLocation ? (
          <BoxComponent display="flex" justifyContent="center" padding="50px">
            <TypographyComponent fontSize="20px">
              Loading location details...
            </TypographyComponent>
          </BoxComponent>
        ) : (
          <>
            <BoxComponent width="80%" marginBottom="15px">
              <InputComponent
                variant="outlined"
                label="Location Name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                fullWidth
              />
            </BoxComponent>

            <BoxComponent
              width="80%"
              marginBottom="15px"
              display="flex"
              justifyContent="flex-start"
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    color="primary"
                  />
                }
                label="Active"
              />
            </BoxComponent>

            <BoxComponent width="90%" height="500px" margin="20px 0">
              <TypographyComponent marginBottom="10px" fontWeight="500">
                {boundaries.length > 0
                  ? "Edit Boundary on Map"
                  : "Draw Boundary on Map"}
              </TypographyComponent>
              <MapComponent
                center={[30.3753, 69.3451]}
                zoom={6}
                isDrawingAllowed={true}
                drawBoundary={true}
                boundaries={handleAddBoundary}
                polygonPositions={boundaries} // Display existing boundaries
              />
            </BoxComponent>

            {!boundaryStatus && (
              <TypographyComponent color="red" fontSize="16px">
                Please draw a boundary or place a marker/circle on the map to
                submit.
              </TypographyComponent>
            )}

            {errorMessage && (
              <TypographyComponent color="red" fontSize="16px" marginTop="10px">
                {errorMessage}
              </TypographyComponent>
            )}

            <ButtonComponent
              variant="contained"
              disabled={loading || !boundaryStatus}
              onClick={handleSubmit}
              sx={{
                width: "90%",
                padding: "10px",
                marginTop: "20px",
                backgroundColor:
                  boundaryStatus && !loading
                    ? "var(--primary)"
                    : "var(--paragraph)",
                color: boundaryStatus ? "var(--white)" : "var(--dark)",
              }}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update"
                : "Submit"}
            </ButtonComponent>
          </>
        )}
      </BoxComponent>
    </BoxComponent>
  );
}
