import React from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import DetailComponent from "./DetailComponent";

export default function Details() {
  const detailsData = {
    image: "Images/bg.png", // Replace with actual image URL
    details: [
      { title: "Add Heading 1 Here", details: "Add details of Heading 1 Here" },
      { title: "Add Heading 2 Here", details: "Add details of Heading 2 Here" },
      { title: "Add Heading 3 Here", details: "Add details of Heading 3 Here" },
      { title: "Add Heading 4 Here", details: "Add details of Heading 4 Here" },
      { title: "Add Heading 5 Here", details: "Add details of Heading 5 Here" },
      { title: "Add Heading 6 Here", details: "Add details of Heading 6 Here" },
      { title: "Add Heading 7 Here", details: "Add details of Heading 7 Here" },
      { title: "Add Heading 8 Here", details: "Add details of Heading 8 Here" },
      { title: "Date of Joining", details: "28 January, 2023" },
      { title: "Last Login", details: "28 November, 2024" },

    ],
  };

  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="30px"
      backgroundColor="var(--light)" // Add a light background color
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
        justifyContent='space-around'
      >
        {/* Left Side (Details) */}
        <BoxComponent
          width="60%"
          display="flex"
          flexDirection="column"
          gap="20px"
        >
          {/* Dynamically Generate Rows of Two Details */}
          {detailsData.details.map((detail, index) => {
            if (index % 2 === 0) {
              return (
                <BoxComponent
                  key={index}
                  display="flex"
                  justifyContent="flex-start"
                  gap="20px"
                >
                  <DetailComponent
                    title={detailsData.details[index].title}
                    details={detailsData.details[index].details}
                  />
                  {detailsData.details[index + 1] && (
                    <DetailComponent
                      title={detailsData.details[index + 1].title}
                      details={detailsData.details[index + 1].details}
                    />
                  )}
                </BoxComponent>
              );
            }
            return null;
          })}
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
            src={detailsData.image}
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