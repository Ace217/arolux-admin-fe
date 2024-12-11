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
    { id: 12, name: "Car 12", position: [33.6954, 73.0427], status: "Inactive", city: "Rawalpindi" }
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
            sx={{ height: "80vh", width: "100%" }}
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
