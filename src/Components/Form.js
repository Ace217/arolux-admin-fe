import React from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import AdminSelection from "./AdminSelection";
import ButtonComponent from "./Button";

export default function Form({ onCancel, title }) { // Accept title as a prop
  return (
    <BoxComponent
      boxShadow="1px 1px 1px 1px var(--paragraph)"
      maxHeight="90vh"
      overflow="auto" 
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center" 
    >
      <TypographyComponent
        marginTop="20px"
        fontSize="25px"
        fontWeight="600"
        fontFamily="var(--main)"
        color="var(--dull)"
      >
        {title} {/* Display the title prop here */}
      </TypographyComponent>
      <BoxComponent width='92%' gap='10px' display="flex" flexDirection="column">
        <InputComponent label="Sub-Admin Name" />
        <InputComponent label="Sub-Admin Email" />
        <InputComponent label="Sub-Admin Phone Number" />
        <InputComponent label="Password" type="password" />
        <InputComponent label="Confirm Password" type="password" />
      </BoxComponent>
      <BoxComponent padding="5px 20px">
        <AdminSelection />
      </BoxComponent>
      <BoxComponent
        display="flex"
        justifyContent="space-between"
        width="90%"
        marginBottom="20px"
      >
        <ButtonComponent
          sx={{
            color: 'var(--primary)',
            padding: '10px 70px',
            fontSize: '12px',
            textTransform: 'none',
            fontWeight: '600',
            borderRadius: '20px'
          }}
          onClick={onCancel} // Call the onCancel function when clicked
        >
          Cancel
        </ButtonComponent>
        <ButtonComponent
          variant="contained"
          backgroundColor="var(--primary)"
          sx={{
            padding: '10px 70px',
            fontSize: '12px',
            borderRadius: '20px'
          }}
        >
          {title === "Add Sub-Admin" ? "Add Sub-Admin" : "Update Sub-Admin"} {/* Change button text based on title */}
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
