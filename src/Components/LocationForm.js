import React, { useState, useEffect } from 'react';
import BoxComponent from './Box';
import TypographyComponent from './Typography';
import InputComponent from './InputComponent';
import MapComponent from './MapComponent';
import ButtonComponent from './Button';
import { useLocation } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { createGeoLocation } from '../api/constants';
import { toast } from 'react-toastify';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function LocationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state?.title || 'Add Location';
  const locationData = location.state?.locationData;

  const [locationName, setLocationName] = useState(locationData?.name || '');
  const [isActive, setIsActive] = useState(locationData?.isActive || false);
  const [boundaries, setBoundaries] = useState([]);
  const [boundaryStatus, setBoundaryStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If location data is provided for editing, set the boundaries
    if (locationData?.boundaries) {
      try {
        const coords = locationData.boundaries.coordinates[0];
        setBoundaries(coords.map(coord => [coord[1], coord[0]])); // Convert from API format
        setBoundaryStatus(true);
      } catch (error) {
        console.error('Error parsing existing boundaries:', error);
      }
    }
  }, [locationData]);

  const handleAddBoundary = (newBoundary) => {
    if (newBoundary.length === 0) {
      setBoundaryStatus(false);
    } else {
      setBoundaries(newBoundary);
      setBoundaryStatus(true);
    }
  };

  const handleCancel = () => {
    navigate('/locations');
  };

  const validateForm = () => {
    if (!locationName.trim()) {
      setErrorMessage('Location name is required');
      return false;
    }
    
    if (!boundaryStatus || boundaries.length === 0) {
      setErrorMessage('Please draw a boundary on the map');
      return false;
    }
    
    setErrorMessage('');
    return true;
  };

  const prepareCoordinatesForAPI = (boundaryCoords) => {
    // Convert from Leaflet format [lat, lng] to API format [lng, lat]
    // Make sure the polygon is closed by adding the first point as the last point if needed
    let formattedCoords = boundaryCoords.map(coord => [coord[1], coord[0]]);
    
    // Check if the polygon is closed (first point = last point)
    if (formattedCoords.length > 0 && 
        (formattedCoords[0][0] !== formattedCoords[formattedCoords.length - 1][0] || 
         formattedCoords[0][1] !== formattedCoords[formattedCoords.length - 1][1])) {
      // Close the polygon by adding the first point at the end
      formattedCoords.push(formattedCoords[0]);
    }
    
    return formattedCoords;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const token = Cookies.get('token');
      const coordinates = prepareCoordinatesForAPI(boundaries);
      
      const locationData = {
        name: locationName,
        isActive: isActive,
        coordinates: coordinates
      };
      
      const response = await createGeoLocation(locationData, token);
      
      if (response?.data?.success) {
        toast.success('Location created successfully!');
        navigate('/locations');
      } else {
        toast.error(response?.data?.message || 'Failed to create location');
      }
    } catch (error) {
      console.error('Error creating location:', error);
      toast.error('An error occurred while creating the location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      backgroundColor='var(--light)'
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
        <BoxComponent
          width="100%"
          display="flex"
          flexDirection="column"
        >
          <BoxComponent 
            display="flex" 
            justifyContent="flex-end" 
            width="100%"
            sx={{ cursor:'pointer' }}
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
        
        <BoxComponent width="80%" marginBottom="15px" display="flex" justifyContent="flex-start">
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
            Draw Boundary on Map
          </TypographyComponent>
          <MapComponent
            center={[30.3753, 69.3451]}
            zoom={6}
            isDrawingAllowed={true}
            drawBoundary={true}
            boundaries={handleAddBoundary}
          />
        </BoxComponent>

        {!boundaryStatus && (
          <TypographyComponent color="red" fontSize="16px">
            Please draw a boundary or place a marker/circle on the map to submit.
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
            width: '90%',
            padding: '10px',
            marginTop: '20px',
            backgroundColor: boundaryStatus && !loading ? 'var(--primary)' : 'var(--paragraph)',
            color: boundaryStatus ? 'var(--white)' : 'var(--dark)',
          }}
        >
          {loading ? 'Creating...' : 'Submit'}
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
