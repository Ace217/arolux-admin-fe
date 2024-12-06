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
    {
      id: 4,
      name: "Car 4",
      position: [25.396, 68.3578],
      status: "Active",
      city: "Hyderabad",
    },
    {
      id: 5,
      name: "Car 5",
      position: [34.0151, 71.5805],
      status: "Inactive",
      city: "Peshawar",
    },
    {
      id: 6,
      name: "Car 6",
      position: [26.2285, 68.4124],
      status: "Active",
      city: "Nawabshah",
    },

    {
      id: 7,
      name: "Car 7",
      position: [33.7099, 73.0302],
      status: "Active",
      city: "Islamabad",
    },
    {
      id: 8,
      name: "Car 8",
      position: [33.7265, 73.0543],
      status: "Inactive",
      city: "Islamabad",
    },
    {
      id: 9,
      name: "Car 9",
      position: [33.6848, 73.0542],
      status: "Active",
      city: "Islamabad",
    },
    {
      id: 10,
      name: "Car 10",
      position: [33.6471, 73.0327],
      status: "Inactive",
      city: "Islamabad",
    },
    {
      id: 11,
      name: "Car 11",
      position: [33.7167, 73.066],
      status: "Active",
      city: "Islamabad",
    },
    {
      id: 12,
      name: "Car 12",
      position: [33.618004, 73.11953],
      status: "Active",
      city: "Rawalpindi",
    },
    {
      id: 13,
      name: "Car 13",
      position: [29.0588, 71.5249],
      status: "Inactive",
      city: "Sialkot",
    },
    {
      id: 14,
      name: "Car 14",
      position: [34.0186, 73.1148],
      status: "Active",
      city: "Murree",
    },
    {
      id: 15,
      name: "Car 15",
      position: [31.5204, 74.3587],
      status: "Active",
      city: "Faisalabad",
    },
    {
      id: 16,
      name: "Car 16",
      position: [32.0836, 74.3294],
      status: "Inactive",
      city: "Multan",
    },
    {
      id: 17,
      name: "Car 17",
      position: [33.6844, 73.0579],
      status: "Active",
      city: "G-5 Islamabad",
    },
    {
      id: 18,
      name: "Car 18",
      position: [35.3713, 73.0785],
      status: "Active",
      city: "Skardu",
    },
    {
      id: 19,
      name: "Car 19",
      position: [24.8607, 67.0011],
      status: "Inactive",
      city: "Karachi",
    },
    {
      id: 20,
      name: "Car 20",
      position: [34.8352, 73.5665],
      status: "Active",
      city: "Abbottabad",
    },
    {
      id: 21,
      name: "Car 21",
      position: [33.9711, 71.6957],
      status: "Inactive",
      city: "Dera Ismail Khan",
    },
    {
      id: 22,
      name: "Car 22",
      position: [33.6226, 73.0673],
      status: "Active",
      city: "Mardan",
    },
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
            <MapComponent cars={cars} center={mapCenter} zoom={mapZoom} />
          </BoxComponent>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
