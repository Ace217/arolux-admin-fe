import React from "react";
import { useLocation } from "react-router-dom";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import DetailComponent from "./DetailComponent";

export default function Details() {
  const location = useLocation();
  const data = location.state || {}; // Get row data or use an empty object if no data is passed

  // Function to convert keys to Title Case
  const formatKey = (key) => {
    return key
      .split("_") // Handle keys with underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="30px"
      backgroundColor="var(--light)"
      minHeight="100vh"
    >
      {/* Title Section */}
      <TypographyComponent
        fontSize="36px"
        color="var(--primary)"
        fontFamily="var(--main)"
        fontWeight="700"
        marginBottom="30px"
        textAlign="center"
      >
        Details
      </TypographyComponent>

      {/* Content Section */}
      <BoxComponent
        width="80%"
        maxWidth="1200px"
        backgroundColor="var(--white)"
        borderRadius="10px"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        display="flex"
        padding="20px"
        justifyContent="space-around"
      >
      {/* Left Side (Details) */}
<BoxComponent width="60%" display="flex" flexDirection="column" gap="20px">
  {Object.keys(data).length > 0 ? (
    Object.entries(data).map(([key, value], index) => {
      if (key !== "image") {
        if (index % 2 === 0) {
          return (
            <BoxComponent key={index} display="flex" justifyContent="flex-start" gap="20px">
              <DetailComponent 
                title={formatKey(key)} 
                details={typeof value === "boolean" ? (value ? "Yes" : "No") : value || "N/A"} 
              />
              {Object.entries(data)[index + 1] &&
                Object.entries(data)[index + 1][0] !== "image" && (
                  <DetailComponent
                    title={formatKey(Object.entries(data)[index + 1][0])}
                    details={typeof Object.entries(data)[index + 1][1] === "boolean"
                      ? (Object.entries(data)[index + 1][1] ? "Yes" : "No")
                      : Object.entries(data)[index + 1][1] || "N/A"}
                  />
                )}
            </BoxComponent>
          );
        }
      }
      return null;
    })
  ) : (
    <TypographyComponent fontSize="18px" color="var(--dark)">
      No Data Available
    </TypographyComponent>
  )}
</BoxComponent>


        {/* Right Side (Image) */}
        <BoxComponent
          width="40%"
          height="35vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          overflow="hidden"
        >
          <img
            src={data.image || "images/bg.png"}
            alt="Cover"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
