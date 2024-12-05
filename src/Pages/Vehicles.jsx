import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import ButtonComponent from "../Components/Button";
import Confirm from "../Components/Confirm";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
import Table from "../Components/Table";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Find from "../Components/Find";

export default function Vehicles() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  
  const handleDetailClick = (id) => {
    navigate(`/details?id=${id}`);
  }; 
  const handleVehicle = (id) => {
    navigate(`/vehicles`);
  }; 

  const handleAddVehicle = () => {
    navigate("/vehicle-form", { state: { title: "Add Vehicle" } });
  };

  const handleEditVehicle = () => {
    navigate("/vehicle-form", { state: { title: "Update Vehicle" } });
  };
  const [rows, setRows] = useState([
    { id: 1, coverImage: "Images/logo.png", category: "Ride", Status: "Active" },
    { id: 2, coverImage: "Images/logo.png", category: "Ride AC", Status: "Active" },
    { id: 3, coverImage: "Images/logo.png", category: "Courier", Status: "Active" },
    { id: 4, coverImage: "Images/logo.png", category: "Bike", Status: "Active" },
    { id: 5, coverImage: "Images/logo.png", category: "Ride Mini", Status: "Active" },
    { id: 6, coverImage: "Images/logo.png", category: "Trip Booking", Status: "Active" },
    { id: 7, coverImage: "Images/logo.png", category: "Bike", Status: "Active" },
    { id: 8, coverImage: "Images/logo.png", category: "Bike", Status: "Active" },
    { id: 9, coverImage: "Images/logo.png", category: "Ride", Status: "Active" },
    { id: 10, coverImage: "Images/logo.png", category: "Ride AC", Status: "Active" },
    { id: 11, coverImage: "Images/logo.png", category: "Ride", Status: "Active" },
    { id: 12, coverImage: "Images/logo.png", category: "Trip Booking", Status: "Active" },
    { id: 13, coverImage: "Images/logo.png", category: "Ride AC", Status: "Active" },
    { id: 14, coverImage: "Images/logo.png", category: "Courier", Status: "Active" },
    { id: 15, coverImage: "Images/logo.png", category: "Ride", Status: "Active" },
  ]);

  const headings = [
    { field: "id", headerName: "Vehicle ID", width: 100 },
    {
      field: "coverImage",
      headerName: "Cover Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.row.coverImage}
          alt="Cover"
          style={{ width: "80px", height: "40px" }}
        />
      ),
    },
    { field: "category", headerName: "Category", width: 200 },
    { field: "Add text here", headerName: "Add text here", width: 150 },
    { field: "Add text here", headerName: "Add text here", width: 150 },
    {
      field: "Status",
      headerName: "Status",
      width: "100",
      renderCell: (params) => (
        <span style={{ color: params.value === "Active" ? "green" : "red" }}>
          {params.value}
        </span>
      ),
    },
  ];

  const icons = {
    edit: <ModeEditOutlineOutlinedIcon onClick={handleEditVehicle} />,
    details: <VisibilityIcon onClick={handleDetailClick}/>,
  };

  

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const handleToggleClick = (id, currentStatus) => {
    setSelectedCategoryId(id);
    setConfirmMessage(
      currentStatus === "Active"
        ? "Are you sure you want to remove this vehicle?"
        : "Are you sure you want to add this vehicle?"
    );
    setShowConfirm(true);
  };

  const handleConfirm = (confirm) => {
    if (confirm) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedCategoryId
            ? {
                ...row,
                Status: row.Status === "Active" ? "Inactive" : "Active",
              }
            : row
        )
      );
    }
    setShowConfirm(false);
  };

  // Filter vehicles based on selected category from URL query
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");

    if (category) {
      setFilteredVehicles(rows.filter((vehicle) => vehicle.category === category));
    } else {
      setFilteredVehicles(rows); // Show all vehicles if no category filter is applied
    }
  }, [location.search, rows]); // Re-run effect when location.search or rows changes

  return (
    <BoxComponent>
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent display="flex" flexDirection="column" width="82%" padding="20px">
          <BoxComponent display="flex" justifyContent="space-between" width="100%">
            <TypographyComponent fontSize="30px" fontFamily="var(--main)" color="var(--dull)" fontWeight="400">
              Vehicles
            </TypographyComponent>
            <BoxComponent display='flex' justifyContent='space-between' gap='5px'>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleVehicle}
              
            >
              View All
            </ButtonComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddVehicle}
              title="Add Vehicle"
            >
              + Add Vehicle
            </ButtonComponent>
            </BoxComponent>
          </BoxComponent>
          <Find placeholder="Search a Vehicle by ID" label="Status" status={status} />
          <Table
            rows={filteredVehicles}  // Display filtered vehicles here
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
            <BoxComponent
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <Confirm message={confirmMessage} onConfirm={handleConfirm} />
            </BoxComponent>
          )}
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
