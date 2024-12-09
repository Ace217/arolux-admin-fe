import React from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import DetailComponent from "./DetailComponent";

export default function Details() {
  // Array with one object containing the data and image
  const detailsData = {
    image: "Images/bg.png", // Replace with actual image URL
    details: [
      { title: "Add Heading 1 Here", details: "Add details of Heading 1 Here" },
      { title: "Add Heading 2 Here", details: "Add details of Heading 2 Here" },
      { title: "Add Heading 3 Here", details: "Add details of Heading 3 Here" },
      { title: "Add Heading 4 Here", details: "Add details of Heading 4 Here" },
      { title: "Add Heading 5 Here", details: "Add details of Heading 5 Here" },
      { title: "Date of Joining", details: "28January,2023" },
      { title: "Last Login", details: "28November,2024" },
    ],
  };

  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      padding="30px"
      backgroundColor="var(--white)"
    >
      <TypographyComponent
        fontSize="40px"
        color="var(--dull)"
        fontFamily="var(--main)"
        fontWeight="600"
        marginBottom="20px"
        textAlign="center"
      >
        Details
      </TypographyComponent>
      <BoxComponent
        width="60%"
        display="flex"
        alignItems="center"
        flexDirection="column"
        gap="10px"
      >
        <BoxComponent
          width="80%"
          height="40vh"
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

        {detailsData.details.map((detail, index) => (
          <DetailComponent
            key={index}
            title={detail.title}
            details={detail.details}
          />
        ))}
      </BoxComponent>
    </BoxComponent>
  );
}
