import React from "react";
import BoxComponent from "../Components/Box";
import Head from "../Components/Head";
import Sidebar from "../Components/Sidebar";
import FiguresBox from "../Components/FiguresBox";
import TypographyComponent from "../Components/Typography";
import MapComponent from "../Components/MapComponent"; // Import the MapComponent

export default function Dashboard() {
  const cars = [
    {
      id: 1,
      name: "Car 1",
      position: [24.8607, 67.0011],
      status: "Active",
      city: "Karachi",
    },
    {
      id: 2,
      name: "Car 2",
      position: [31.5497, 74.3436],
      status: "Inactive",
      city: "Lahore",
    },
    {
      id: 3,
      name: "Car 3",
      position: [33.6844, 73.0479],
      status: "Active",
      city: "Islamabad",
    },
    // Add more cars as needed
  ];

  const mapCenter = [30.3753, 69.3451]; // Center of Pakistan
  const mapZoom = 6; // Zoom level for Pakistan

  return (
    <BoxComponent backgroundColor="var(--light)">
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent
          width="82%"
          sx={{
            padding: "20px",
            overflowY: "auto",
            maxHeight: "85vh",
          }}
        >
          <TypographyComponent
            fontSize="18px"
            fontFamily="var(--main)"
            color="var(--dark)"
            fontWeight="400"
          >
            DASHBOARD
          </TypographyComponent>
          <FiguresBox />
          <BoxComponent
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            marginTop="15px"
            overflow="hidden"
            backgroundColor="var(--white)"
            sx={{
              height: "80vh", // Set height for the map container
              width: "100%", // Full width
            }}
          >
            <TypographyComponent
              fontSize="16px"
              color="var(--paragraph)"
              width="100%"
              padding="15px"
              backgroundColor="var(--white)"
              boxShadow="1px 1px 1px 1px var(--secondary)"
            >
              Location of the Cars
            </TypographyComponent>
            <MapComponent cars={cars} center={mapCenter} zoom={mapZoom} isDrawingAllowed={false} />
          </BoxComponent>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
