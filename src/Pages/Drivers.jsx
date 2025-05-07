import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import ButtonComponent from "../Components/Button";
import { useNavigate } from "react-router-dom";
import Table from "../Components/Table";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Find from "../Components/Find";
import { getDriversList } from "../api/constants";
import { useDebounce } from "../hooks/useDebounce";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function Drivers() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchText = useDebounce(searchInput, 500);

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const headings = [
    { field: "id", headerName: "ID", width: 220 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params) =>
        `${params.row.driverProfile.firstName} ${params.row.driverProfile.lastName}`,
    },
    {
      field: "email",
      headerName: "E-mail",
      width: 200,
      valueGetter: (params) => params.row.driverProfile.email,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) =>
        `${params.row.countryCode}${params.row.phoneNumber}`,
    },
    {
      field: "partnerType",
      headerName: "Partner Type",
      width: 150,
      valueGetter: (params) => params.row.driverProfile.partnerTypeId.name,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  const icons = {
    edit: <ModeEditOutlineOutlinedIcon />,
    details: <VisibilityIcon />,
  };

  const handleAddDriver = () => {
    navigate("/driver-form", { state: { title: "Add Driver" } });
  };

  const handleEditDriver = (data) => {
    navigate("/driver-form", {
      state: {
        title: "Update Driver",
        driverData: data,
      },
    });
  };

  const handleDetailClick = (data) => {
    navigate(`/details`, { state: { ...data } });
  };

  const fetchDrivers = async (params = {}) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiParams = {
        limit: 20,
        offset: 0,
        searchText: params.searchText || "",
        ...(params.isActive !== "" && { status: params.isActive }),
      };

      const response = await getDriversList(apiParams, token);

      if (response?.data?.success) {
        const drivers = response.data.data.drivers.map((driver) => ({
          ...driver,
          id: driver._id,
        }));
        setRows(drivers);
      } else {
        toast.error(response?.data?.message || "Failed to fetch drivers");
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Error fetching drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers({
      searchText: debouncedSearchText,
      isActive,
    });
  }, [debouncedSearchText, isActive]);

  const handleSearch = (value) => {
    setSearchInput(value);
  };

  const handleStatusChange = (value) => {
    let activeStatus;
    switch (value) {
      case 1: // All
        activeStatus = "";
        break;
      case 2: // Active
        activeStatus = "active";
        break;
      case 3: // Inactive
        activeStatus = "inactive";
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
          <Find
            placeholder="Search a Driver by Name"
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
            getRowId={(row) => row.id}
            onDetailClick={handleDetailClick}
            onEdit={handleEditDriver}
          />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
