import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import ButtonComponent from "../Components/Button";
import Confirm from "../Components/Confirm";
import { useNavigate } from "react-router-dom";
import Table from "../Components/Table";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Find from "../Components/Find";
import { getVehicleCategories } from "../api/constants";
import Cookies from "js-cookie";
import { useDebounce } from "../hooks/useDebounce";

export default function Categories() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchText = useDebounce(searchInput, 500);

  const handleCategoryClick = (categoryName) => {
    navigate(`/vehicles?category=${categoryName}`);
  };

  const handleAddCategory = () => {
    navigate("/vehicle-form", { state: { title: "Add Category" } });
  };

  const handleEditCategory = (category) => {
    navigate("/vehicle-form", {
      state: { title: "Update Category", categoryId: category.id },
    });
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const headings = [
    { field: "id", headerName: "ID", width: 220 },
    {
      field: "iconURL",
      headerName: "Icon",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Category Icon"
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 120 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "seatingCapacity",
      headerName: "Seating Capacity",
      width: 150,
      renderCell: (params) =>
        `${params.row.minSeatingCapacity} - ${params.row.maxSeatingCapacity}`,
    },
    {
      field: "Status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: params.row.isActive ? "green" : "red" }}>
          {params.row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const icons = {
    edit: <ModeEditOutlineOutlinedIcon />,
    details: <VisibilityIcon />,
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedCategoryId(id);
    setConfirmMessage(
      currentStatus === "Active"
        ? "Are you sure you want to remove this category?"
        : "Are you sure you want to add this category?"
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

  const fetchCategories = async (params = {}) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      // Only include isActive in params if it's not an empty string (All option)
      const apiParams = {
        limit: 10,
        offset: 0,
        searchText: params.searchText || "",
        ...(params.isActive !== "" && { isActive: params.isActive }),
      };

      const response = await getVehicleCategories(apiParams, token);

      if (response?.data?.data?.categories) {
        console.log("Vehicle Categories Response:", response.data);
        const formattedRows = response.data.data.categories.map((category) => ({
          ...category,
          id: category._id,
          Status: category.isActive ? "Active" : "Inactive",
          image: category.iconURL,
        }));
        setRows(formattedRows);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories({
      searchText: debouncedSearchText,
      isActive,
    });
  }, [debouncedSearchText, isActive]);

  const handleSearch = (value) => {
    setSearchInput(value);
  };

  const handleStatusChange = (value) => {
    // Convert dropdown value to the correct format for the API
    let activeStatus;
    switch (value) {
      case 1: // All
        activeStatus = "";
        break;
      case 2: // Active
        activeStatus = true;
        break;
      case 3: // Inactive
        activeStatus = false;
        break;
      default:
        activeStatus = "";
    }
    setIsActive(activeStatus);
  };

  return (
    <BoxComponent backgroundColor="var(--light)">
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent
          display="flex"
          flexDirection="column"
          width="82%"
          padding="20px"
        >
          <BoxComponent
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <TypographyComponent
              fontSize="18px"
              fontFamily="var(--main)"
              color="var(--dark)"
              fontWeight="400"
            >
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
          <Find
            placeholder="Search a Category by Name"
            label="Status"
            status={status}
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
          />
          <Table
            rows={rows}
            headings={headings}
            icons={icons}
            loading={loading}
            onEdit={handleEditCategory}
            onDetailClick={(categoryName) => {
              const currentRow = rows.find((row) => row.name === categoryName);
              if (currentRow) {
                handleCategoryClick(categoryName);
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
