import React from 'react';
import BoxComponent from './Box';
import TypographyComponent from './Typography';

export default function Figures(props) {
  return (
    <BoxComponent
    width="27%"
    height='60px'
    padding='15px'
    // borderRadius='10px'
    backgroundColor='var(--white)'
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
     boxShadow="1px 1px 1px 1px var(--secondary)"
    >
      <TypographyComponent
      fontSize='20px'
      fontWeight='400'
      fontFamily='var(--main)'
      textAlign='left'
      color='var(--dark)'
      >{props.numbers}</TypographyComponent>
      <BoxComponent
      display='flex'
      justifyContent='left'
      >
      <TypographyComponent
      fontSize='14px'
      fontFamily='var(--main)'
      color='var(--paragraph)'
      textAlign='left'
      marginRight='10px'
      >{props.title}</TypographyComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
