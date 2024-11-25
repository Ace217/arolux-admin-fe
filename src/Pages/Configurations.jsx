import React, { useState } from 'react';
import BoxComponent from '../Components/Box';
import Sidebar from '../Components/Sidebar';
import Head from '../Components/Head';
import TypographyComponent from '../Components/Typography';
import Table from '../Components/Table';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

export default function Configurations() {
  const [rows] = useState([
    { id: 1, key: 'ABc', value: '1' },
    { id: 2, key: 'CDF', value: '2' },
  ]);

  const headings = [
    { field: 'key', headerName: 'Key', width: 100 },
    {
      field: 'value',
      headerName: 'Value',
      width: 150,
    },
  ];
  const icons = {
    edit: <ModeEditOutlineOutlinedIcon />,
  };


  return (
    <BoxComponent>
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent display="flex" flexDirection="column" width="82%" padding="20px">
          <BoxComponent display="flex" justifyContent="space-between" width="100%">
            <TypographyComponent
              fontSize="30px"
              fontFamily="var(--main)"
              color="var(--dull)"
              fontWeight="400"
            >
              Configurations
            </TypographyComponent>
          </BoxComponent>
          <Table
            rows={rows}
            headings={headings}
            icons={icons}
          />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
