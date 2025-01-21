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

export default function Categories() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCategoryClick = (categoryName) => {
    navigate(`/vehicles?category=${categoryName}`);
  };

  const handleAddCategory = () => {
    navigate('/vehicle-form', { state: { title: 'Add Category' } });
  };

  const handleEditCategory = (category) => {
    navigate('/vehicle-form', {
      state: { title: 'Update Category', categoryId: category.id }
    });
  };
  
  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const [rows, setRows] = useState([
    { id: 1, image: 'Images/logo.png', categoryName: 'Ride AC', Status: 'Active' },
    { id: 2, image: 'Images/logo.png', categoryName: 'Ride', Status: 'Active' },
    { id: 3, image: 'Images/logo.png', categoryName: 'Ride Mini', Status: 'Active' },
    { id: 4, image: 'Images/logo.png', categoryName: 'Bike', Status: 'Active' },
    { id: 5, image: 'Images/logo.png', categoryName: 'Trip Booking', Status: 'Active' },
    { id: 6, image: 'Images/logo.png', categoryName: 'Courier', Status: 'Active' },
  ]);

  const headings = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => <img src={params.row.image} alt="Cover" style={{ width: '80px', height: '40px' }} />,
    },
    { field: 'categoryName', headerName: 'Category Name' },
    { field: 'Add text here', headerName: 'Add text here'  },
    { field: 'Add text here', headerName: 'Add text here' },
    {
      field: 'Status',
      headerName: 'Status',
      renderCell: (params) => <span style={{ color: params.value === 'Active' ? 'green' : 'red' }}>{params.value}</span>,
    },
  ];

  const icons = {
    edit:<ModeEditOutlineOutlinedIcon onClick={handleEditCategory}/>,
    details:<VisibilityIcon/>,
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedCategoryId(id);
    setConfirmMessage(
      currentStatus === 'Active'
        ? 'Are you sure you want to remove this category?'
        : 'Are you sure you want to add this category?'
    );
    setShowConfirm(true);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedCategoryId
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
            <TypographyComponent   fontSize="18px"
            fontFamily="var(--main)"
            color="var(--dark)"
            fontWeight="400">
              VEHICLE CATEGORIES
            </TypographyComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddCategory}
              title="Add Category"
            >
              + Add Category
            </ButtonComponent>
          </BoxComponent>
          <Find placeholder="Search a Category by Name" label="Status" status={status} />
          <Table
            rows={rows}
            headings={headings}
            icons={icons}
            onDetailClick={(categoryName) => {
              const currentRow = rows.find((row) => row.categoryName === categoryName);
              if (currentRow) {
                handleCategoryClick(categoryName, currentRow.categoryName);
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
