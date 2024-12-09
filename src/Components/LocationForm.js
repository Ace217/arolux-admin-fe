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

  const [boundaries, setBoundaries] = useState([]);

  const handleAddBoundary = (newBoundary) => {
    setBoundaries(newBoundary); // Save the newly drawn boundary
  };

  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      sx={{
        backgroundImage: `url('Images/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: '100vh', // Ensure full viewport height
      }}
    >
      <BoxComponent
        margin="50px"
        padding="30px 15px"
        borderRadius='10px'
        width="40%"
        gap='10px'
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor='var(--light)'
      >
        <TypographyComponent
          fontSize="40px"
          color="var(--dull)"
          fontFamily="var(--main)"
          fontWeight="600"
          marginBottom='20px'
        >
          {title}
        </TypographyComponent>

        <BoxComponent width='90%'>
          <InputComponent variant="outlined" label="Name" />
        </BoxComponent>

        <BoxComponent width='90%' height='300px' margin="20px 0"
        // border='2px solid var(--white)'
        >
          <MapComponent
            center={[30.3753, 69.3451]} // Center of Pakistan
            zoom={6}
            drawBoundary={true} // Enable drawing mode
            boundaries={handleAddBoundary} // Pass boundaries to handle state update
          />
        </BoxComponent>

        <ButtonComponent
          variant="contained"
          backgroundColor="var(--primary)"
          sx={{
            width: "90%",
            padding: "10px",
          }}
        >
          Submit
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
