import React from "react";
import LocationDetails from "../Components/LocationDetails";
import Head from "../Components/Head";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";

const LocationDetailsPage = () => {
  return (
    <BoxComponent backgroundColor="var(--light)">
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent
          display="flex"
          flexDirection="column"
          width="82%"
          padding="20px"
        >
          <LocationDetails />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
};

export default LocationDetailsPage;
