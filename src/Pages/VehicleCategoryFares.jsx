import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import {
  getVehicleCategoryFaresList,
  getVehicleCategories,
  getGeoLocationsList,
} from "../api/constants";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { useDebounce } from "../hooks/useDebounce";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import ButtonComponent from "../Components/Button";
import Table from "../Components/Table";
import Find from "../Components/Find";
import VehicleCategoryFareForm from "../Components/VehicleCategoryFareForm";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const VehicleCategoryFares = () => {
  const { adminToken } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);
  const [fares, setFares] = useState([]);
  const [totalFares, setTotalFares] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [geoLocations, setGeoLocations] = useState([]);
  const [isActive, setIsActive] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const fetchFares = async (params = {}) => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const apiParams = {
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        search: debouncedSearch,
        ...(isActive !== "" && { isActive }),
        ...params,
      };

      console.log("Fetching fares with params:", apiParams);
      console.log("Using token:", token);

      const response = await getVehicleCategoryFaresList(apiParams, token);

      console.log("Fares API response:", response);

      if (response?.data?.success) {
        const formattedFares = response.data.data.fares.map((fare) => ({
          ...fare,
          id: fare._id,
          Status: fare.isActive ? "Active" : "Inactive",
        }));
        setFares(formattedFares);
        setTotalFares(response.data.data.totalFares);
      } else {
        console.warn("API didn't return a success status:", response?.data);
        toast.error("Failed to load fares. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching vehicle category fares:", error);
      toast.error("Failed to load fares. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleCategories = async () => {
    try {
      const token = Cookies.get("token");
      console.log("Fetching vehicle categories with token:", token);

      const response = await getVehicleCategories({}, token);

      if (response?.data?.success) {
        setVehicleCategories(response.data.data.categories);
        console.log(
          "Vehicle categories loaded:",
          response.data.data.categories.length
        );
      } else {
        console.warn("Vehicle categories API didn't return a success status");
      }
    } catch (error) {
      console.error("Error fetching vehicle categories:", error);
      toast.error("Failed to load vehicle categories.");
    }
  };

  const fetchGeoLocations = async () => {
    try {
      const token = Cookies.get("token");
      console.log("Fetching geo locations with token:", token);

      const response = await getGeoLocationsList({}, token);

      if (response?.data?.success) {
        setGeoLocations(response.data.data.locations);
        console.log(
          "Geo locations loaded:",
          response.data.data.locations.length
        );
      } else {
        console.warn("Geo locations API didn't return a success status");
      }
    } catch (error) {
      console.error("Error fetching geo locations:", error);
      toast.error("Failed to load locations.");
    }
  };

  useEffect(() => {
    fetchFares();
  }, [page, rowsPerPage, debouncedSearch, isActive]);

  useEffect(() => {
    fetchVehicleCategories();
    fetchGeoLocations();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(0);
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
    setPage(0);
  };

  const handleAddFare = () => {
    setSelectedFare(null);
    setOpenForm(true);
  };

  const handleEditFare = (fare) => {
    setSelectedFare(fare);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    fetchFares();
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const headings = [
    { field: "id", headerName: "ID", width: 220 },
    {
      field: "vehicleCategoryId",
      headerName: "Vehicle Category",
      width: 150,
      renderCell: (params) => params.row.vehicleCategoryId?.name || "N/A",
    },
    {
      field: "geoLocationId",
      headerName: "Location",
      width: 150,
      renderCell: (params) => params.row.geoLocationId?.name || "N/A",
    },
    {
      field: "baseFare",
      headerName: "Base Fare",
      width: 120,
      renderCell: (params) =>
        `${params.row.currencySymbol}${params.row.baseFare}`,
    },
    {
      field: "chargesPerMile",
      headerName: "Per Mile",
      width: 120,
      renderCell: (params) =>
        `${params.row.currencySymbol}${params.row.chargesPerMile}`,
    },
    {
      field: "chargesPerMinute",
      headerName: "Per Minute",
      width: 120,
      renderCell: (params) =>
        `${params.row.currencySymbol}${params.row.chargesPerMinute}`,
    },
    {
      field: "minimumFare",
      headerName: "Minimum Fare",
      width: 120,
      renderCell: (params) =>
        `${params.row.currencySymbol}${params.row.minimumFare}`,
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
              VEHICLE CATEGORY PRICING
            </TypographyComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddFare}
              title="Add Fare"
            >
              + Add Fare
            </ButtonComponent>
          </BoxComponent>
          <Find
            placeholder="Search pricing by vehicle category or location"
            label="Status"
            status={status}
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
          />
          <Table
            rows={fares}
            headings={headings}
            icons={icons}
            loading={loading}
            onEdit={handleEditFare}
            onStatusChange={(id) => {
              // Add status toggle functionality if needed
            }}
          />

          {openForm && (
            <VehicleCategoryFareForm
              open={openForm}
              handleClose={handleCloseForm}
              fare={selectedFare}
              vehicleCategories={vehicleCategories}
              geoLocations={geoLocations}
            />
          )}
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
};

export default VehicleCategoryFares;
