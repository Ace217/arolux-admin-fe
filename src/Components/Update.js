import React from 'react';
import BoxComponent from './Box';
import InputComponent from './InputComponent';
import ButtonComponent from './Button';

export default function Update({ onCancel }) {
  return (
    <BoxComponent
      width='95%'
      height='35vh'
      padding='10px'
      borderRadius='10px'
      backgroundColor='var(--light)'
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
    >
      <InputComponent label="New Password" type="password" />
      <InputComponent label="Confirm Password" type="password" />
      <BoxComponent display="flex" flexDirection='column' justifyContent="center" width="100%" gap='10px'>
        <ButtonComponent
          variant="contained"
          backgroundColor="var(--primary)"
          sx={{
            textTransform: "none",
            fontSize: "14px",
            color: "var(--light)",
          }}
        >
          Update Password
        </ButtonComponent>
        <ButtonComponent
          sx={{
            textTransform: "none",
            color: "var(--primary)",
            fontSize: "14px",
          }}
          onClick={onCancel} 
        >
          Cancel
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
