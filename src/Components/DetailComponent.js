import React from 'react';
import TypographyComponent from './Typography';
import BoxComponent from './Box';

export default function DetailComponent(props) {
  return (
    <BoxComponent
    display="flex"
    justifyContent="space-between"
    alignItems='center'
    width='80%'
    >
      <TypographyComponent
      fontSize='18px'
      fontWeight='600'
      width='50%'
      color='var(--primary)'
      fontFamily='var(--main)'
     
      >{props.title}</TypographyComponent>
      <TypographyComponent
      fontSize='17px'
      width='50%'
      fontWeight='400'
      color='var(--paragraph)'
      fontFamily='var(--main)'
      
      >{props.details}</TypographyComponent>
    </BoxComponent>
  );
}
