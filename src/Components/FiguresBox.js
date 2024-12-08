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
      <Figures title='Total Revenue Generated' numbers='$ 1221323' img="Images/revenue.png"/>
      <Figures title='No. of Completed Rides' numbers='140' img="Images/completed-ride.png"/>
      <Figures title='No. of Current Rides' numbers='122' img="Images/current-ride.png"/>
    </BoxComponent>
  );
}
