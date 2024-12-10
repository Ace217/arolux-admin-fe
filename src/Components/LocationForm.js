import React, { useState } from 'react';
import BoxComponent from './Box';
import TypographyComponent from './Typography';
import InputComponent from './InputComponent';
import MapComponent from './MapComponent';
import ButtonComponent from './Button';
import { useLocation } from 'react-router-dom';

export default function LocationForm() {
  const location = useLocation();
  const title = location.state?.title || 'Add Location';

  const [boundaries, setBoundaries] = useState([]); // Store the coordinates of the drawn boundary
  const [boundaryStatus, setBoundaryStatus] = useState(false); // Flag to track if the boundary is drawn

  const handleAddBoundary = (newBoundary) => {
    setBoundaries(newBoundary); // Update the boundaries state with the new boundary
    setBoundaryStatus(newBoundary.length > 2); // Check if the boundary is valid (more than 2 points)
  };

  const handleSubmit = () => {
    console.log('Submitted Boundary Coordinates:', boundaries);
  };

  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      sx={{
        backgroundImage: `url('Images/bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <BoxComponent
        margin="50px"
        padding="30px 15px"
        borderRadius="10px"
        width="80%"
        gap="5px"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor="var(--light)"
      >
        <TypographyComponent
          fontSize="40px"
          color="var(--dull)"
          fontFamily="var(--main)"
          fontWeight="600"
          marginBottom="10px"
        >
          {title}
        </TypographyComponent>

        <BoxComponent width="80%">
          <InputComponent variant="outlined" label="Name" />
        </BoxComponent>

        <BoxComponent width="90%" height="500px" margin="20px 0">
          <MapComponent
            center={[30.3753, 69.3451]} // Center of Pakistan
            zoom={6}
            drawBoundary={true} // Enable drawing mode
            boundaries={handleAddBoundary} // Pass the boundaries to handle state update
          />
        </BoxComponent>

        {!boundaryStatus && (
          <TypographyComponent color="red" fontSize="16px">
            Please draw a boundary on the map.
          </TypographyComponent>
        )}

        <ButtonComponent
          variant="contained"
          backgroundColor="var(--primary)"
          sx={{
            width: '90%',
            padding: '10px',
          }}
          onClick={handleSubmit}
          disabled={!boundaryStatus} // Disable button if no boundary
        >
          Submit
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
