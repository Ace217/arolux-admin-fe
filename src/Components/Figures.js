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
    justifyContent='space-between'
     boxShadow="1px 1px 1px 1px var(--secondary)"
    >
      <BoxComponent
      
      display='flex'
    flexDirection='column'
    justifyContent='space-between'
    gap="10px"
      >
      <TypographyComponent
      fontSize='20px'
      fontWeight='400'
      fontFamily='var(--main)'
      textAlign='left'
      color='var(--dark)'
      >{props.numbers}</TypographyComponent>
      <TypographyComponent
      fontSize='14px'
      fontFamily='var(--main)'
      color='var(--paragraph)'
      textAlign='left'
      marginRight='10px'
      >{props.title}</TypographyComponent> 
      </BoxComponent>
      <BoxComponent
      width="20%"
      height="95%"
      overflow="hidden"
      
      >
      <img 
          style={{
            width: '100%',
            height: '100%'
          }}
          src={props.img} alt={props.alt}
        />
      </BoxComponent>
    </BoxComponent>
  );
}
