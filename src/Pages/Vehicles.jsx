import React, { useState } from 'react';
import BoxComponent from '../Components/Box';
import Sidebar from '../Components/Sidebar';
import Head from '../Components/Head';
import TypographyComponent from '../Components/Typography';
import ButtonComponent from '../Components/Button';
import Confirm from '../Components/Confirm';
import { useNavigate } from 'react-router-dom';
import Table from '../Components/Table';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Find from '../Components/Find';

export default function Vehicles() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  const handleAddNews = () => {
    navigate('', { state: { title: 'Add Vehicle' } });
  };

  const handleEditNews = () => {
    navigate('', { state: { title: 'Update Vehicle' } });
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const [rows, setRows] = useState([
    { id: 1, coverImage: 'Images/logo.png', Status: 'Active' },
    { id: 2, coverImage: 'Images/logo.png', Status: 'Active' },
]);

  const headings = [
    { field: 'id', headerName: 'Vehicle ID', width: 100 },
    {
      field: 'coverImage',
      headerName: 'Cover Image',
      width: 100,
      renderCell: (params) => <img src={params.row.coverImage} alt="Cover" style={{ width: '80px', height: '40px' }} />,
    },
    { field: 'Add text here', headerName: 'Add text here', width: 200 },
    { field: 'Add text here', headerName: 'Add text here', width: 150 },
    { field: 'Add text here', headerName: 'Add text here', width: 150 },
    {
      field: 'Status',
      headerName: 'Status',
      width:'100',
      renderCell: (params) => <span style={{ color: params.value === 'Active' ? 'green' : 'red' }}>{params.value}</span>,
    },
  ];

  const icons = {
    edit: <ModeEditOutlineOutlinedIcon/>,
    details:<VisibilityIcon/>
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedNewsId(id);
    setConfirmMessage(
      currentStatus === 'Active'
        ? 'Are you sure you want to remove this vehicle?'
        : 'Are you sure you want to add this vehicle?'
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
              Vehicle Management
            </TypographyComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddNews}
              title="Add Vehicle"
            >
              + Add Vehicle
            </ButtonComponent>
          </BoxComponent>
          <Find placeholder="Search a Vehicle by ID" label="Status" status={status} />
          <Table
            rows={rows}
            headings={headings}
            icons={icons}
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
