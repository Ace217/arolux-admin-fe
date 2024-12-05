import React from 'react';
import BoxComponent from './Box';
import Figures from './Figures';

export default function FiguresBox() {
  return (
    <BoxComponent
    display='flex'
    justifyContent='space-between'
    padding='20px'
    >
      <Figures title='Total Revenue Generated' numbers='$ 1221323'/>
      <Figures title='Number of Current Rides' numbers='122'/>
      <Figures title='Number of Completed Rides' numbers='140'/>
    </BoxComponent>
  );
}
