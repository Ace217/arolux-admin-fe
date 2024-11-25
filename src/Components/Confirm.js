import React from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import ButtonComponent from "./Button";

export default function Confirm({ message, onConfirm }) {
  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      flexDirection="column"
      width="350px"
      padding="20px 10px"
      borderRadius="10px"
      backgroundColor="var(--light)"
      zIndex={1001}
    >
      <TypographyComponent
        fontSize="15px"
        fontFamily="var(--main)"
        fontWeight="600"
        color="var(--dull)"
      >
        {message}
      </TypographyComponent>
      <BoxComponent display="flex" justifyContent="right" width="90%" marginTop="15px">
        <ButtonComponent
          onClick={() => onConfirm(false)}
          sx={{
            textTransform: "none",
            color: "var(--primary)",
            fontSize: "14px",
          }}
        >
          No
        </ButtonComponent>
        <ButtonComponent
          variant="contained"
          backgroundColor="var(--primary)"
          onClick={() => onConfirm(true)}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            color: "var(--light)",
          }}
        >
          Yes
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
