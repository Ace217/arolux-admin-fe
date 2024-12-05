import React from 'react';
import BoxComponent from '../Components/Box';
import Head from '../Components/Head';
import Sidebar from '../Components/Sidebar';
import FiguresBox from '../Components/FiguresBox';
import TypographyComponent from '../Components/Typography';

export default function Dashboard() {
  return (
    <BoxComponent>
      <Head />
      <BoxComponent
        display="flex"
        justifyContent="space-between"
      >
        <Sidebar />
        <BoxComponent  width="82%"  sx={{padding:'20px',
            overflowY: "auto", 
            maxHeight: "85vh",
           }}>
              <TypographyComponent
              fontSize="30px"
              fontFamily="var(--main)"
              color="var(--dull)"
              fontWeight="400"
              >
                Dashboard
              </TypographyComponent>
          <FiguresBox/>
          <BoxComponent
            display="flex"
            justifyContent="space-between"
            marginTop='15px'
          ></BoxComponent>
        </BoxComponent>
    </BoxComponent>
    </BoxComponent>
  );
}
