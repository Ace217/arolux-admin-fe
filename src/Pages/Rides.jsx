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

export default function Rides() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedRideId, setSelectedRideId] = useState(null);

  const handleDetailClick = (id) => {
    navigate(`/details?id=${id}`);
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const [rows, setRows] = useState([
    { id: 1, coverImage: 'Images/logo.png', name:'Zain', CNIC:'123423543254', Email:'zeeforzain@gmail.com', Phone:'1231434', vehicle:"RIM 1234", city:'Rawalpindi', Status: 'Active' },
    { id: 2, coverImage: 'Images/logo.png', name:'Zain', CNIC:'123423543254', Email:'zeeforzain@gmail.com', Phone:'1231434', vehicle:"RIM 1234", city:'Rawalpindi', Status: 'Inactive' },
    { id: 3, coverImage: 'Images/logo.png', name:'Zain', CNIC:'123423543254', Email:'zeeforzain@gmail.com', Phone:'1231434', vehicle:"RIM 1234", city:'Rawalpindi', Status: 'Active' },
]);

  const headings = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'coverImage',
      headerName: 'Cover Image',
      width: 100,
      renderCell: (params) => <img src={params.row.coverImage} alt="Cover" style={{ width: '80px', height: '40px' }} />,
    },
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'CNIC', headerName: 'CNIC', width: 110 },
    { field: 'Email', headerName: 'E-mail', width: 110 },
    { field: 'Phone', headerName: 'Phone', width: 100 },
    { field: 'vehicle', headerName: 'Vehicle No', width: 100 },
    { field: 'city', headerName: 'City', width: 100 },
    {
      field: 'Status',
      headerName: 'Status',
      width:'100',
      renderCell: (params) => <span style={{ color: params.value === 'Active' ? 'green' : 'red' }}>{params.value}</span>,
    },
  ];



  const icons = {
    edit: <ModeEditOutlineOutlinedIcon />,
    details:<VisibilityIcon onClick={handleDetailClick} />
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedRideId(id);
    setConfirmMessage(
      currentStatus === 'Active'
        ? 'Are you sure you want to remove this ride?'
        : 'Are you sure you want to add this ride?'
    );
    setShowConfirm(true);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedRideId
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
              RIDE MANAGEMENT
            </TypographyComponent>
           
          </BoxComponent>
          <Find placeholder="Search a ride by ID" label="Status" status={status} />
          <Table
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
