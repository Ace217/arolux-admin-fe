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
import ButtonComponent from '../Components/Button';

export default function Locations() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  const handleDetailClick = (id) => {
    navigate(`/details?id=${id}`);
  };

  const handleAddLocation = () => {
    navigate('/location-form', { state: { title: 'Add Location'}});
  };

  const handleEditLocation = () => {
    navigate('/location-form', { state: { title: 'Update Location' } });
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const [rows, setRows] = useState([
    { id: 1,  name:'Rawalpindi', add_text:'AddTextHere', add_text:'AddTextHere', add_here:'AddTextHere', Status: 'Active' },
  ]);

  const headings = [
    { field: 'id', headerName: 'ID'},
    { field: 'name', headerName: 'Location Name'},
    { field: 'add_text', headerName: 'Add-Text' },
    { field: 'add_text', headerName: 'Add-Text' },
    { field: 'add_here', headerName: 'Add-Here' },
    {
      field: 'Status',
      headerName: 'Status',
      renderCell: (params) => <span style={{ color: params.value === 'Active' ? 'green' : 'red' }}>{params.value}</span>,
    },
  ];



  const icons = {
    edit: <ModeEditOutlineOutlinedIcon onClick={handleEditLocation}/>,
    details:<VisibilityIcon onClick={handleDetailClick} />
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedLocationId(id);
    setConfirmMessage(
      currentStatus === 'Active'
        ? 'Are you sure you want to remove this location?'
        : 'Are you sure you want to add this location?'
    );
    setShowConfirm(true);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedLocationId
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
              LOCATION MANAGEMENT
            </TypographyComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddLocation}
              title="Add Location"
            >
              + Add Location
              </ButtonComponent>
          </BoxComponent>
          <Find placeholder="Search a Location by Name" label="Status" status={status} />
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
