import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import Confirm from "../Components/Confirm";
import { useNavigate } from "react-router-dom";
import Table from "../Components/Table";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Find from "../Components/Find";
import ButtonComponent from "../Components/Button";
import Cookies from "js-cookie";
import { getGeoLocationsList } from "../api/constants";
import { toast } from "react-toastify";

export default function Locations() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Function to fetch locations from the API
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const params = {
        searchText: searchText,
        limit: 20,
        offset: 0,
        status: statusFilter,
      };

      const response = await getGeoLocationsList(params, token);

      if (response?.data?.success) {
        const geoLocations = response.data.data.geoLocations || [];

        // Transform API response to match table structure
        const transformedLocations = geoLocations.map((location, index) => ({
          id: location._id,
          name: location.name,
          add_text: "-",
          add_here: "-",
          Status: location.isActive ? "Active" : "Inactive",
          createdAt: location.createdAt,
        }));

        setRows(transformedLocations);
      } else {
        toast.error("Failed to fetch locations");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("An error occurred while fetching locations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations when component mounts or when filters change
  useEffect(() => {
    fetchLocations();
  }, [searchText, statusFilter]); // Re-fetch when search text or status filter changes

  const handleDetailClick = (id) => {
    // Navigate to the location details page with the location ID
    navigate(`/location-details?id=${id}`);
  };

  const handleAddLocation = () => {
    navigate("/location-form", { state: { title: "Add Location" } });
  };

  const handleEditLocation = (location) => {
    navigate("/location-form", {
      state: { title: "Update Location", locationData: location },
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusChange = (value) => {
    let statusValue = "";

    if (value === 2) {
      // Active
      statusValue = "true";
    } else if (value === 3) {
      // Inactive
      statusValue = "false";
    }

    setStatusFilter(statusValue);
  };

  const status = [
    { value: 1, label: "All" },
    { value: 2, label: "Active" },
    { value: 3, label: "Inactive" },
  ];

  const headings = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Location Name" },
    { field: "add_text", headerName: "Add-Text" },
    { field: "add_here", headerName: "Add-Here" },
    {
      field: "Status",
      headerName: "Status",
      renderCell: (params) => (
        <span style={{ color: params.value === "Active" ? "green" : "red" }}>
          {params.value}
        </span>
      ),
    },
  ];

  const icons = {
    edit: <ModeEditOutlineOutlinedIcon />,
    details: <VisibilityIcon />,
  };

  const handleToggleClick = (id, currentStatus) => {
    setSelectedLocationId(id);
    setConfirmMessage(
      currentStatus === "Active"
        ? "Are you sure you want to remove this location?"
        : "Are you sure you want to add this location?"
    );
    setShowConfirm(true);
  };

  const handleConfirm = async (confirm) => {
    if (confirm) {
      try {
        // In a real implementation, you would call an API to update the status
        // For now, we'll just update the local state
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedLocationId
              ? {
                  ...row,
                  Status: row.Status === "Active" ? "Inactive" : "Active",
                }
              : row
          )
        );
        toast.success("Location status updated successfully!");
      } catch (error) {
        console.error("Error updating location status:", error);
        toast.error("Failed to update location status");
      }
    }
    setShowConfirm(false);
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
          <Find
            placeholder="Search a Location by Name"
            label="Status"
            status={status}
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
          />
          {loading ? (
            <BoxComponent display="flex" justifyContent="center" padding="20px">
              <TypographyComponent>Loading locations...</TypographyComponent>
            </BoxComponent>
          ) : (
            <Table
              rows={rows}
              headings={headings}
              icons={icons}
              onEdit={(row) => {
                // Updated to accept the row object directly instead of expecting an ID
                if (row && row.id) {
                  handleEditLocation(row);
                }
              }}
              onDetailClick={(id) => {
                handleDetailClick(id);
              }}
              onStatusChange={(id) => {
                const currentRow = rows.find((row) => row.id === id);
                if (currentRow) {
                  handleToggleClick(id, currentRow.Status);
                }
              }}
            />
          )}
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
