import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import Confirm from "../Components/Confirm";
import { useNavigate } from "react-router-dom";
import Table from "../Components/Table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Find from "../Components/Find";
import { getCustomersList, updateCustomerStatus } from "../api/constants";
import Cookies from "js-cookie";
import { useDebounce } from "../hooks/useDebounce";
import { toast } from "react-toastify";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

export default function Customers() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchText = useDebounce(searchInput, 500);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);

  const handleDetailClick = (data) => {
    navigate("/details", { state: { ...data } });
  };

  const handleEditClick = (data) => {
    setSelectedCustomerData(data);
    navigate("/customer-form", {
      state: { title: "Edit Customer", customerData: data },
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
      field: "profileImageURL",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          src={params.value || "Images/logo.png"}
          alt="Profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ),
    },
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      renderCell: (params) =>
        `${params.row.countryCode}${params.row.phoneNumber}`,
    },
    { field: "email", headerName: "E-mail", width: 220 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "active" ? "green" : "red",
            cursor: "pointer",
          }}
          onClick={() => handleToggleClick(params.row.id, params.value)}
        >
          {params.value === "active" ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 70,
      renderCell: (params) => (
        <ModeEditOutlineOutlinedIcon
          onClick={() => handleEditClick(params.row)}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      field: "view",
      headerName: "View",
      width: 70,
      renderCell: (params) => (
        <VisibilityIcon
          onClick={() => handleDetailClick(params.row)}
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];

  const handleToggleClick = (id, currentStatus) => {
    setSelectedCustomerId(id);
    setConfirmMessage(
      currentStatus === "active"
        ? "Are you sure you want to block this customer?"
        : "Are you sure you want to unblock this customer?"
    );
    setShowConfirm(true);
  };

  const handleConfirm = async (confirm) => {
    if (confirm) {
      try {
        const currentRow = rows.find((row) => row.id === selectedCustomerId);
        if (!currentRow) return;

        const token = Cookies.get("token");
        const newStatus = currentRow.status === "active" ? "blocked" : "active";

        const response = await updateCustomerStatus(
          selectedCustomerId,
          newStatus,
          token
        );

        if (response?.data?.success) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === selectedCustomerId
                ? { ...row, status: newStatus }
                : row
            )
          );
          toast.success(
            `Customer ${
              newStatus === "active" ? "activated" : "blocked"
            } successfully`
          );
        } else {
          toast.error(response?.data?.message || "Failed to update status");
        }
      } catch (error) {
        console.error("Error updating customer status:", error);
        toast.error("Error updating customer status");
      }
    }
    setShowConfirm(false);
  };

  const fetchCustomers = async (params = {}) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const apiParams = {
        limit: 20,
        offset: 0,
        searchText: params.searchText || "",
        ...(params.isActive !== "" && { status: params.isActive }),
      };

      const response = await getCustomersList(apiParams, token);

      if (response?.data?.success) {
        // Transform the data to include an 'id' field for DataGrid
        const customers = response.data.data.users.map((user) => ({
          ...user,
          id: user._id, // Add id field required by DataGrid
          phone: user.phoneNumber, // For consistency in rendering
        }));
        setRows(customers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers({
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
        activeStatus = "blocked";
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
              CUSTOMER MANAGEMENT
            </TypographyComponent>
          </BoxComponent>
          <Find
            placeholder="Search a Customer by Name"
            label="Status"
            status={status}
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
          />
          <Table
            rows={rows}
            headings={headings}
            loading={loading}
            getRowId={(row) => row.id}
            onStatusChange={(id) => {
              const currentRow = rows.find((row) => row.id === id);
              if (currentRow) {
                handleToggleClick(id, currentRow.status);
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
