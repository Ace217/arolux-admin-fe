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

export default function Rides() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchText = useDebounce(searchInput, 500);

  const handleDetailClick = (data) => {
    navigate(`/details`, { state: { ...data } });
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
      renderCell: (params) => new Date(params.value * 1000).toLocaleString(),
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
        limit: 20,
        offset: 0,
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
    fetchRideBookings({ status: statusValue, searchText: searchInput });
  };

  useEffect(() => {
    fetchRideBookings({ searchText: debouncedSearchText });
  }, [debouncedSearchText]);

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
          />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
