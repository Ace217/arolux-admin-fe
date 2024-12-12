import React from "react";
import BoxComponent from "../Components/Box";
import Head from "../Components/Head";
import Sidebar from "../Components/Sidebar";
import FiguresBox from "../Components/FiguresBox";
import TypographyComponent from "../Components/Typography";
import MapComponent from "../Components/MapComponent";

export default function Dashboard() {
  const cars = [
    { id: 1, name: "Car 1", position: [24.8607, 67.0011], status: "Active", city: "Karachi" },
    { id: 2, name: "Car 2", position: [31.5497, 74.3436], status: "Inactive", city: "Lahore" },
    { id: 3, name: "Car 3", position: [33.6844, 73.0479], status: "Active", city: "Islamabad" },
    { id: 4, name: "Car 4", position: [33.6844, 73.0579], status: "Inactive", city: "Islamabad" },
    { id: 5, name: "Car 5", position: [33.6656, 73.0483], status: "Active", city: "Rawalpindi" },
    { id: 6, name: "Car 6", position: [33.7000, 73.0785], status: "Inactive", city: "Rawalpindi" },
    { id: 7, name: "Car 7", position: [33.6849, 73.0521], status: "Active", city: "Islamabad" },
    { id: 8, name: "Car 8", position: [33.6250, 73.0380], status: "Inactive", city: "Rawalpindi" },
    { id: 9, name: "Car 9", position: [33.7458, 73.0687], status: "Active", city: "Rawalpindi" },
    { id: 10, name: "Car 10", position: [33.6593, 73.0554], status: "Inactive", city: "Rawalpindi" },
    { id: 11, name: "Car 11", position: [33.6704, 73.0419], status: "Active", city: "Islamabad" },
    { id: 12, name: "Car 12", position: [33.6954, 73.0427], status: "Inactive", city: "Rawalpindi" },
    { id: 13, name: "Car 13", position: [23.6345, 68.1280], status: "Active", city: "Gwadar" },
    { id: 14, name: "Car 14", position: [32.0836, 75.0242], status: "Inactive", city: "Sialkot" },
    { id: 15, name: "Car 15", position: [35.1480, 74.1950], status: "Active", city: "Gilgit" },
    { id: 16, name: "Car 16", position: [30.3753, 69.3451], status: "Inactive", city: "Quetta" },
    { id: 17, name: "Car 17", position: [34.0280, 71.5227], status: "Active", city: "Peshawar" },
    { id: 18, name: "Car 18", position: [34.0018, 73.6036], status: "Inactive", city: "Abbottabad" },
    { id: 19, name: "Car 19", position: [29.9732, 71.6045], status: "Active", city: "Multan" },
    { id: 20, name: "Car 20", position: [28.6139, 70.7635], status: "Inactive", city: "Hyderabad" },
    { id: 21, name: "Car 21", position: [31.5490, 74.3436], status: "Active", city: "Lahore" },
    { id: 22, name: "Car 22", position: [33.6844, 73.0479], status: "Inactive", city: "Islamabad" },
    { id: 23, name: "Car 23", position: [35.3842, 74.6557], status: "Active", city: "Skardu" },
    { id: 24, name: "Car 24", position: [33.7178, 73.0841], status: "Inactive", city: "Islamabad" },
    { id: 25, name: "Car 25", position: [34.0162, 73.2091], status: "Active", city: "Mansehra" },
    { id: 26, name: "Car 26", position: [28.5851, 68.1785], status: "Inactive", city: "Nawabshah" },
    { id: 27, name: "Car 27", position: [31.5497, 73.3436], status: "Active", city: "Lahore" },
    { id: 28, name: "Car 28", position: [33.6974, 73.0692], status: "Inactive", city: "Rawalpindi" },
    { id: 29, name: "Car 29", position: [35.1965, 73.1365], status: "Active", city: "Khaplu" },
    { id: 30, name: "Car 30", position: [31.5497, 74.3436], status: "Inactive", city: "Lahore" },
    { id: 31, name: "Car 31", position: [32.0774, 73.1539], status: "Active", city: "Faisalabad" },
    { id: 32, name: "Car 32", position: [32.1001, 74.3738], status: "Inactive", city: "Lahore" },
    { id: 33, name: "Car 33", position: [30.1575, 71.5249], status: "Active", city: "Dera Ghazi Khan" },
    { id: 34, name: "Car 34", position: [33.7490, 73.0500], status: "Inactive", city: "Rawalpindi" },
    { id: 35, name: "Car 35", position: [34.5853, 73.0078], status: "Active", city: "Mardan" },
    { id: 36, name: "Car 36", position: [35.8658, 74.0344], status: "Inactive", city: "Bunji" },
    { id: 37, name: "Car 37", position: [30.1575, 71.5249], status: "Active", city: "Multan" },
    { id: 38, name: "Car 38", position: [31.4442, 73.0423], status: "Inactive", city: "Sargodha" },
    { id: 39, name: "Car 39", position: [30.7500, 72.1290], status: "Active", city: "Rahim Yar Khan" },
    { id: 40, name: "Car 40", position: [32.0853, 74.2422], status: "Inactive", city: "Lahore" }
  ];
  
  const mapCenter = [30.3753, 69.3451];
  const mapZoom = 6;

  return (
    <BoxComponent backgroundColor="var(--light)">
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent
          width="82%"
          sx={{ padding: "20px", overflowY: "auto", maxHeight: "85vh" }}
        >
          <TypographyComponent fontSize="18px" fontFamily="var(--main)" color="var(--dark)" fontWeight="400">
            DASHBOARD
          </TypographyComponent>
          <FiguresBox />
          <BoxComponent
            display="flex"
            flexDirection="column"
            marginTop="15px"
            overflow="hidden"
            backgroundColor="var(--white)"
          >
            <TypographyComponent fontSize="16px" color="var(--paragraph)" width="100%" padding="15px" backgroundColor="var(--white)" boxShadow="1px 1px 1px 1px var(--secondary)">
              Location of the Cars
            </TypographyComponent>
            <MapComponent cars={cars} center={mapCenter} zoom={mapZoom} isDrawingAllowed={false} />
          </BoxComponent>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
