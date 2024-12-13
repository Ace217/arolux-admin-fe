import React, { useState } from 'react';
import BoxComponent from './Box';
import TypographyComponent from './Typography';
import InputComponent from './InputComponent';
import MapComponent from './MapComponent';
import ButtonComponent from './Button';
import { useLocation } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

export default function LocationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state?.title || 'Add Location';

  const [boundaries, setBoundaries] = useState([]);
  const [boundaryStatus, setBoundaryStatus] = useState(false);

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

  const handleSubmit = () => {
    console.log('Submitted Boundary Coordinates:', boundaries);
    const savedBoundaries = [...boundaries];
    console.log('Saved Boundaries:', savedBoundaries);
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

        <BoxComponent width="80%">
          <InputComponent variant="outlined" label="Name" />
        </BoxComponent>

        <BoxComponent width="90%" height="500px" margin="20px 0">
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

        <ButtonComponent
          variant="contained"
          disabled={!boundaryStatus}
          onClick={handleSubmit}
          sx={{
            width: '90%',
            padding: '10px',
            backgroundColor: boundaryStatus ? 'var(--primary)' : 'var(--paragraph)',
            color: boundaryStatus ? 'var(--white)' : 'var(--dark)',
          }}
        >
          Submit
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
