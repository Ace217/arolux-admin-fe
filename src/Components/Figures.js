import React from 'react';
import BoxComponent from './Box';
import TypographyComponent from './Typography';

export default function Figures(props) {
  return (
    <BoxComponent
    width="300px"
    height='100px'
    padding='15px'
    borderRadius='10px'
    backgroundColor='var(--light)'
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
     boxShadow="1px 1px 1px 2px var(--paragraph)"
    >
      <TypographyComponent
      fontSize='22px'
      fontWeight='400'
      fontFamily='var(--main)'
      textAlign='left'
      color='var(--dull)'
      >{props.title}</TypographyComponent>
      <BoxComponent
      display='flex'
      justifyContent='right'
      >
      <TypographyComponent
      fontSize='22px'
      fontWeight='400'
      fontFamily='var(--main)'
      color='var(--dark)'
      textAlign='right'
      marginLeft='10px'
      >{props.numbers}</TypographyComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
