import React from "react";
import PromoCodeDetails from "../Components/PromoCodeDetails";
import Head from "../Components/Head";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";

const PromoCodeDetailsPage = () => {
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
          <PromoCodeDetails />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
};

export default PromoCodeDetailsPage;
