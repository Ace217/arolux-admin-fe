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
import {
  getCustomersList,
  updateCustomerStatus,
  getCustomerDetails,
  updateCustomer,
} from "../api/constants";
import Cookies from "js-cookie";
import { useDebounce } from "../hooks/useDebounce";
import { toast } from "react-toastify";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import InputComponent from "../Components/InputComponent";
import ButtonComponent from "../Components/Button";
import ImageComponent from "../Components/ImageComponent";

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

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerFormLoading, setCustomerFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImageURL: "",
  });

  const handleDetailClick = (data) => {
    navigate("/details", { state: { ...data } });
  };

  const handleEditClick = async (data) => {
    setSelectedCustomerId(data.id);
    setSelectedCustomerData(data);
    setCustomerFormLoading(true);
    setIsModalOpen(true);

    try {
      const token = Cookies.get("token");
      const response = await getCustomerDetails(data.id, token);
      if (response?.data?.success) {
        const details = response.data.data;
        setFormData({
          name: details.name || "",
          email: details.email || "",
          phone: `${details.countryCode || "+1"}${details.phoneNumber || ""}`,
          profileImageURL: details.profileImageURL || "",
        });
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
      toast.error("Error fetching customer details");
    } finally {
      setCustomerFormLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerData(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      profileImageURL: "",
    });
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      profileImageURL: url,
    }));
  };

  const handleSubmitForm = async () => {
    // Validate form fields
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    // Split phone into country code and number
    const phoneMatch = formData.phone.match(/^(\+\d{1,3})([\d\s-]+)$/);
    if (!phoneMatch) {
      toast.error(
        "Please enter a valid phone number with country code (e.g. +1234567890)"
      );
      return;
    }

    try {
      const token = Cookies.get("token");
      const payload = {
        name: formData.name,
        email: formData.email,
        countryCode: phoneMatch[1],
        phoneNumber: phoneMatch[2].replace(/[\s-]/g, ""), // Remove spaces and dashes
        profileImageURL: formData.profileImageURL,
      };

      const response = await updateCustomer(selectedCustomerId, payload, token);

      if (response?.data?.success) {
        toast.success("Customer updated successfully!");
        // Update the row in the table
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedCustomerId
              ? {
                  ...row,
                  name: payload.name,
                  email: payload.email,
                  countryCode: payload.countryCode,
                  phoneNumber: payload.phoneNumber,
                  profileImageURL: payload.profileImageURL,
                }
              : row
          )
        );
        handleCloseModal();
      } else {
        toast.error(response?.data?.message || "Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while updating the customer"
      );
    }
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
                height: "80vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                overflow: "scroll",
              }}
            >
              <Confirm message={confirmMessage} onConfirm={handleConfirm} />
            </BoxComponent>
          )}
          {isModalOpen && (
            <>
              {/* Modal backdrop */}
              <BoxComponent
                position="fixed"
                top="0"
                left="0"
                width="100vw"
                height="100vh"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                display="flex"
                justifyContent="center"
                alignItems="center"
                zIndex="1200"
              >
                {/* Modal content */}
                <BoxComponent
                  backgroundColor="var(--light)"
                  padding="20px"
                  borderRadius="8px"
                  width="600px"
                  maxHeight="80vh"
                  overflow="auto"
                  boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#888",
                      borderRadius: "10px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "#555",
                    },
                    scrollbarWidth: "thin",
                    scrollbarColor: "#888 #f1f1f1",
                  }}
                >
                  {/* Modal header */}
                  <BoxComponent
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom="20px"
                  >
                    <TypographyComponent
                      fontSize="22px"
                      fontFamily="var(--main)"
                      color="var(--dark)"
                      fontWeight="600"
                    >
                      Edit Customer
                    </TypographyComponent>
                    <CancelIcon
                      onClick={handleCloseModal}
                      style={{ cursor: "pointer" }}
                    />
                  </BoxComponent>

                  {/* Modal body */}
                  {customerFormLoading ? (
                    <BoxComponent
                      display="flex"
                      justifyContent="center"
                      padding="20px"
                    >
                      <TypographyComponent>Loading...</TypographyComponent>
                    </BoxComponent>
                  ) : (
                    <BoxComponent
                      display="flex"
                      flexDirection="column"
                      gap="20px"
                    >
                      <BoxComponent
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        marginBottom="20px"
                      >
                        {formData.profileImageURL && (
                          <img
                            src={formData.profileImageURL}
                            alt="Profile"
                            style={{
                              width: "120px",
                              height: "120px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginBottom: "10px",
                            }}
                          />
                        )}
                      </BoxComponent>
                      <InputComponent
                        label="Name"
                        value={formData.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                      />
                      <InputComponent
                        label="Email"
                        value={formData.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                      />
                      <InputComponent
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleFormChange("phone", e.target.value)
                        }
                      />
                      <ImageComponent
                        label="Profile Image"
                        imageUrl={formData.profileImageURL}
                        onImageUpload={handleImageUpload}
                        hidePreview={!!formData.profileImageURL}
                      />
                      <ButtonComponent
                        variant="contained"
                        backgroundColor="var(--primary)"
                        sx={{ color: "var(--light)", padding: "10px" }}
                        onClick={handleSubmitForm}
                      >
                        Save Changes
                      </ButtonComponent>
                    </BoxComponent>
                  )}
                </BoxComponent>
              </BoxComponent>
            </>
          )}
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
