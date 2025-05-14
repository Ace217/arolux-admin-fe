import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import { useNavigate } from "react-router-dom";
import Table from "../Components/Table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Find from "../Components/Find";
import { getRideBookingsList } from "../api/constants";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useDebounce } from "../hooks/useDebounce";

// Utility function to format timestamps correctly
const formatDateTime = (timestamp) => {
  // Check if timestamp is a valid number
  if (!timestamp || isNaN(Number(timestamp))) {
    return "N/A";
  }

  // Handle different timestamp formats
  let milliseconds;

  // If timestamp is too large, it might be in microseconds or nanoseconds
  if (String(timestamp).length >= 13) {
    // For microseconds (16 digits) or nanoseconds (19 digits), convert to milliseconds
    if (String(timestamp).length > 13) {
      const divisor = Math.pow(10, String(timestamp).length - 13);
      milliseconds = Math.floor(Number(timestamp) / divisor);
    } else {
      // Already in milliseconds (13 digits)
      milliseconds = Number(timestamp);
    }
  } else {
    // Convert from seconds to milliseconds (10 digits or less)
    milliseconds = Number(timestamp) * 1000;
  }

  // Check if the date is reasonable (between 2020 and 2050)
  const year = new Date(milliseconds).getFullYear();
  if (year < 2020 || year > 2050) {
    // If unreasonable, assume timestamp is in seconds, not milliseconds
    if (String(timestamp).length >= 13) {
      milliseconds = Math.floor(Number(timestamp) / 1000);
    }
  }

  // Create a date object and format it
  const date = new Date(milliseconds);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  // Format date
  return date.toLocaleString();
};

export default function Rides() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchText = useDebounce(searchInput, 500);
  const [selectedStatus, setSelectedStatus] = useState("");
  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [totalRides, setTotalRides] = useState(0);

  // Handle pagination model change
  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const handleDetailClick = (data) => {
    console.log("Ride details before navigation:", data);
    navigate(`/ride-details`, {
      state: {
        ...data,
        isRideBooking: true, // Explicit flag to identify as ride booking
      },
    });
  };

  const status = [
    { value: "", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const headings = [
    { field: "randomBookingId", headerName: "Booking ID", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <span
          style={{
            color:
              params.value === "completed"
                ? "green"
                : params.value === "cancelled"
                ? "red"
                : params.value === "accepted"
                ? "blue"
                : "orange",
          }}
        >
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </span>
      ),
    },
    { field: "bookingType", headerName: "Type", width: 100 },
    { field: "pickTitle", headerName: "Pickup Location", width: 200 },
    { field: "dropTitle", headerName: "Drop-off Location", width: 200 },
    {
      field: "totalFare",
      headerName: "Fare",
      width: 100,
      renderCell: (params) =>
        `${params.row.currencySymbol}${params.row.totalFare}`,
    },
    {
      field: "scheduledTime",
      headerName: "Scheduled Time",
      width: 160,
      renderCell: (params) => formatDateTime(params.value),
    },
    { field: "userName", headerName: "Customer", width: 150 },
    {
      field: "vehicleCategoryId",
      headerName: "Vehicle Category",
      width: 130,
      renderCell: (params) => params.row.vehicleCategoryId?.name || "N/A",
    },
  ];

  const icons = {
    details: <VisibilityIcon />,
  };

  const fetchRideBookings = async (params = {}) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiParams = {
        limit: params.pageSize || paginationModel.pageSize,
        offset:
          params.page !== undefined
            ? params.page * (params.pageSize || paginationModel.pageSize)
            : paginationModel.page * paginationModel.pageSize,
        searchText: params.searchText || "",
        ...(params.status && { status: params.status }),
      };

      const response = await getRideBookingsList(apiParams, token);

      if (response?.data?.success) {
        const bookings = response.data.data.rideBookings.map((booking) => ({
          ...booking,
          id: booking._id, // Required for table component
        }));
        setRows(bookings);
        // Use totalRideBookingsCount specifically for accurate pagination
        setTotalRides(response.data.data.totalRideBookingsCount || 0);
      } else {
        toast.error(response?.data?.message || "Failed to fetch ride bookings");
      }
    } catch (error) {
      console.error("Error fetching ride bookings:", error);
      toast.error("Error fetching ride bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchText) => {
    setSearchInput(searchText);
  };

  const handleStatusChange = (statusValue) => {
    setSelectedStatus(statusValue);
  };

  useEffect(() => {
    fetchRideBookings({
      searchText: debouncedSearchText,
      status: selectedStatus,
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    });
  }, [
    debouncedSearchText,
    selectedStatus,
    paginationModel.page,
    paginationModel.pageSize,
  ]);

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
              RIDE BOOKINGS
            </TypographyComponent>
          </BoxComponent>
          <Find
            placeholder="Search a booking by ID"
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
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            rowCount={totalRides}
            pageSizeOptions={[10, 20, 50, 100]}
            passIdOnly={false}
          />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
