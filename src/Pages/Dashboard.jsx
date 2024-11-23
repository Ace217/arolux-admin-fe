import React from 'react';
import BoxComponent from '../Components/Box';
import Head from '../Components/Head';
import Sidebar from '../Components/Sidebar';

export default function Dashboard() {
  return (
    <BoxComponent>
      <Head/>
      <Sidebar/>
    </BoxComponent>
  );
}
