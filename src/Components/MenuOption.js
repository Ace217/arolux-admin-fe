import React from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";

export default function MenuOption({ icon: Icon, label, onClick, active }) {
  return (
    <BoxComponent
      display="flex"
      alignItems="center"
      justifyContent="left"
      width="auto"
      height="5vh"
      padding="5px 10px"
      sx={{
        backgroundColor: active ? '#FFF' : 'transparent', // Set background based on active state
        "&:hover": {
          cursor: "pointer",
          backgroundColor: '#FFF', 
          // boxShadow:'0px 0px 1px 1px transparent'// Maintain hover color
        },
        transition: 'background-color 0.3s ease', // Smooth transition for background color
      }}
      onClick={onClick} // Add the onClick handler here
    >
      <Icon />
      <TypographyComponent marginLeft="15px" color="var(--dull)">
        {label}
      </TypographyComponent>
    </BoxComponent>
  );
}
