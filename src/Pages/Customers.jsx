import React, { useState } from 'react';
import BoxComponent from '../Components/Box';
import Sidebar from '../Components/Sidebar';
import Head from '../Components/Head';
import TypographyComponent from '../Components/Typography';

import Confirm from '../Components/Confirm';
import { useNavigate } from 'react-router-dom';
import Table from '../Components/Table';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Find from '../Components/Find';

export default function Customers() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  

  const handleDetailClick = (data) => {
    navigate("/details", { state: { ...data } }); // Ensure full row data is passed
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const [rows, setRows] = useState([
    { id: 1, image: 'Images/logo.png', name:'Zain', CNIC:'123423543254', Email:'zeeforzain@gmail.com', Phone:'1231434', vehicle:"RIM 1234", city:'Rawalpindi', Status: 'Active' },
    { id: 2, image: 'Images/logo.png', name:'Zain', CNIC:'123423543254', Email:'zeeforzain@gmail.com', Phone:'1231434', vehicle:"RIM 1234", city:'Rawalpindi', Status: 'Active' },
    { id: 3, image: 'Images/logo.png', name:'Zain', CNIC:'123423543254', Email:'zeeforzain@gmail.com', Phone:'1231434', vehicle:"RIM 1234", city:'Rawalpindi', Status: 'Active' },
]);

  const headings = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => <img src={params.row.image} alt="Cover" style={{ width: '80px', height: '40px' }} />,
    },
    { field: 'name', headerName: 'Name' },
    { field: 'CNIC', headerName: 'CNIC' },
    { field: 'Email', headerName: 'E-mail' },
    { field: 'Phone', headerName: 'Phone' },
    { field: 'vehicle', headerName: 'Vehicle No' },
    { field: 'city', headerName: 'City'},
    {
      field: 'Status',
      headerName: 'Status',
      renderCell: (params) => <span style={{ color: params.value === 'Active' ? 'green' : 'red' }}>{params.value}</span>,
    },
     {
          field: "view",
          headerName: "View",
          renderCell: (params) => (
            <VisibilityIcon
              onClick={() => handleDetailClick(params.row)}
              style={{ cursor: "pointer" }}
            />
          ),
        },
  ];


  const icons = {
    edit: <ModeEditOutlineOutlinedIcon />,
    // details:<VisibilityIcon onClick={handleDetailClick}/>
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedNewsId(id);
    setConfirmMessage(
      currentStatus === 'Active'
        ? 'Are you sure you want to remove this customer?'
        : 'Are you sure you want to add this customer?'
    );
    setShowConfirm(true);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedNewsId
            ? { ...row, Status: row.Status === 'Active' ? 'Inactive' : 'Active' }
            : row
        )
      );
    }
    setShowConfirm(false);
  };

  return (
    <BoxComponent
    backgroundColor="var(--light)"
    >
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent display="flex" flexDirection="column" width="82%" padding="20px">
          <BoxComponent display="flex" justifyContent="space-between" width="100%">
            <TypographyComponent
               fontSize="18px"
               fontFamily="var(--main)"
               color="var(--dark)"
               fontWeight="400"
            >
              CUSTOMER MANAGEMENT
            </TypographyComponent>
            {/* <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddNews}
              title="Add Customer"
            >
              + Add Customer
            </ButtonComponent> */}
          </BoxComponent>
          <Find placeholder="Search a Customer by ID" label="Status" status={status} />
          <Table
          // getRowId={getRowId}
            rows={rows}
            headings={headings}
            icons={icons}
            onDetailClick={(id) => {
              const currentRow = rows.find((row) => row.id === id);
              if (currentRow) {
                handleDetailClick(id, currentRow.id);
              }
            }}
            onStatusChange={(id) => {
              const currentRow = rows.find((row) => row.id === id);
              if (currentRow) {
                handleToggleClick(id, currentRow.Status);
              }
            }}
          />
          {showConfirm && (
            <BoxComponent style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}>
              <Confirm message={confirmMessage} onConfirm={handleConfirm} />
            </BoxComponent>
          )}
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
