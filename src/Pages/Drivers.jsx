import React, { useState } from 'react';
import BoxComponent from '../Components/Box';
import Sidebar from '../Components/Sidebar';
import Head from '../Components/Head';
import TypographyComponent from '../Components/Typography';
import ButtonComponent from '../Components/Button';
import Confirm from '../Components/Confirm';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Table from '../Components/Table';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Find from '../Components/Find';

export default function Drivers() {
  const navigate = useNavigate();  // For navigation
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
const [selectedDriverId, setSelectedDriverId] = useState(null);

 const handleDetailClick = (id) => {
    navigate(`/details?id=${id}`);
  };

  const handleAddDriver = () => {
    navigate('/driver-form', { state: { title: 'Add Driver'}});
  };

  const handleEditDriver = () => {
    navigate('/driver-form', { state: { title: 'Update Driver' } });
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const [rows, setRows] = useState([
    { id: 1, coverImage: 'Images/logo.png', name:'Zain', CNIC:'123423543254', Email:'zeeforzain@gmail.com', Phone:'1231434', vehicle:"RIM 1234", city:'Rawalpindi', Status: 'Active' },
    { id: 2, coverImage: 'Images/logo.png', name:'Ali', CNIC:'9876543210', Email:'ali@example.com', Phone:'9876543210', vehicle:"RIM 5678", city:'Islamabad', Status: 'Inactive' },
    { id: 3, coverImage: 'Images/logo.png', name:'Sara', CNIC:'1234532543', Email:'sara@example.com', Phone:'2345678901', vehicle:"RIM 9876", city:'Lahore', Status: 'Active' },
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
      width: 100,
      renderCell: (params) => <span style={{ color: params.value === 'Active' ? 'green' : 'red' }}>{params.value}</span>,
    },
  ];

  const icons = {
    edit: <ModeEditOutlineOutlinedIcon onClick={handleEditDriver}/>,
    details:<VisibilityIcon onClick={handleDetailClick} />,
  };
  const handleToggleClick = (id, currentStatus) => {
    setSelectedDriverId(id);
    setConfirmMessage(
      currentStatus === 'Active'
        ? 'Are you sure you want to remove this Driver?'
        : 'Are you sure you want to add this Driver?'
    );
    setShowConfirm(true);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedDriverId
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
              DRIVER MANAGEMENT
            </TypographyComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddDriver}
              title="Add Driver"
            
            >
              + Add Driver
            </ButtonComponent>
          </BoxComponent>
          <Find placeholder="Search a Driver by ID" label="Status" status={status} />
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
