import React, { useState, useEffect, useCallback } from "react";
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
import InputComponent from "../Components/InputComponent";
import ImageComponent from "../Components/ImageComponent";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Drivers() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchText = useDebounce(searchInput, 500);
  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [totalDriversCount, setTotalDriversCount] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Driver");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+1",
    cnic: "",
    vehicleNumber: "",
    city: "",
    profileImage: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Handle pagination model change
  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

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
    setModalTitle("Add Driver");
    setSelectedDriver(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      countryCode: "+1",
      cnic: "",
      vehicleNumber: "",
      city: "",
      profileImage: "",
    });
    setIsModalOpen(true);
  };

  const handleEditDriver = (data) => {
    setModalTitle("Update Driver");
    setSelectedDriver(data);
    setFormLoading(true);

    // Set form data with driver's details
    const driverProfile = data.driverProfile || {};
    setFormData({
      firstName: driverProfile.firstName || "",
      lastName: driverProfile.lastName || "",
      email: driverProfile.email || "",
      phoneNumber: data.phoneNumber || "",
      countryCode: data.countryCode || "+1",
      cnic: driverProfile.cnic || "",
      vehicleNumber: driverProfile.vehicleNumber || "",
      city: driverProfile.city || "",
      profileImage: driverProfile.profileImageURL || "",
    });

    setFormLoading(false);
    setIsModalOpen(true);
  };

  const handleDetailClick = (data) => {
    navigate(`/details`, { state: { ...data } });
  };

  const fetchDrivers = useCallback(
    async (params = {}) => {
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
          ...(params.isActive !== "" && { status: params.isActive }),
        };

        const response = await getDriversList(apiParams, token);

        if (response?.data?.success) {
          const drivers = response.data.data.drivers.map((driver) => ({
            ...driver,
            id: driver._id,
          }));
          setRows(drivers);
          // Set total drivers count from API response
          setTotalDriversCount(response.data.data.totalDriversCount || 0);
        } else {
          toast.error(response?.data?.message || "Failed to fetch drivers");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Error fetching drivers");
      } finally {
        setLoading(false);
      }
    },
    [paginationModel.pageSize]
  );

  useEffect(() => {
    fetchDrivers({
      searchText: debouncedSearchText,
      isActive,
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    });
  }, [
    debouncedSearchText,
    isActive,
    paginationModel.page,
    paginationModel.pageSize,
    fetchDrivers,
  ]);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleImageUpload = (url) => {
    setFormData({
      ...formData,
      profileImage: url,
    });
  };

  const handleSubmitDriver = async () => {
    // Validate form fields
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }

    setFormLoading(true);
    try {
      const token = Cookies.get("token");
      // Create request data object
      const requestData = {
        ...formData,
      };

      // Here you would call your API to create or update the driver
      // For now we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock success response
      if (selectedDriver) {
        // Update existing driver in the table
        toast.success("Driver updated successfully!");
      } else {
        // Add new driver to the table
        toast.success("Driver created successfully!");
      }

      // Refresh the drivers list
      fetchDrivers({
        searchText: debouncedSearchText,
        isActive,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
      });

      // Close the modal
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${selectedDriver ? "update" : "create"} driver`
      );
    } finally {
      setFormLoading(false);
    }
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
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            rowCount={totalDriversCount}
            pageSizeOptions={[10, 20, 50, 100]}
            passIdOnly={false}
          />
        </BoxComponent>
      </BoxComponent>

      {/* Driver Form Modal */}
      {isModalOpen && (
        <BoxComponent
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor="rgba(0, 0, 0, 0.5)"
          zIndex="1000"
          onClick={handleCloseModal}
        >
          <BoxComponent
            width="60%"
            maxWidth="800px"
            maxHeight="90vh"
            overflow="auto"
            backgroundColor="var(--white)"
            borderRadius="10px"
            padding="20px"
            boxShadow="0 4px 10px rgba(0, 0, 0, 0.2)"
            onClick={(e) => e.stopPropagation()}
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
            {/* Modal Header */}
            <BoxComponent
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="20px"
            >
              <TypographyComponent
                fontSize="24px"
                color="var(--primary)"
                fontWeight="600"
              >
                {modalTitle}
              </TypographyComponent>
              <CancelIcon
                style={{ cursor: "pointer", color: "var(--error)" }}
                onClick={handleCloseModal}
              />
            </BoxComponent>

            {formLoading ? (
              <BoxComponent
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <TypographyComponent>Loading...</TypographyComponent>
              </BoxComponent>
            ) : (
              <BoxComponent>
                {/* Profile Image */}
                <BoxComponent
                  display="flex"
                  justifyContent="center"
                  marginBottom="20px"
                >
                  {formData.profileImage && (
                    <img
                      src={formData.profileImage}
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

                {/* Form Fields */}
                <BoxComponent
                  display="grid"
                  gridTemplateColumns="1fr 1fr"
                  gap="20px"
                >
                  <InputComponent
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleFormChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                  />
                  <InputComponent
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleFormChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                  />
                  <InputComponent
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="Enter email address"
                    type="email"
                  />
                  <BoxComponent display="flex" gap="10px">
                    <InputComponent
                      label="Country Code"
                      value={formData.countryCode}
                      onChange={(e) =>
                        handleFormChange("countryCode", e.target.value)
                      }
                      placeholder="+1"
                      style={{ width: "30%" }}
                    />
                    <InputComponent
                      label="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleFormChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter phone number"
                      style={{ width: "70%" }}
                    />
                  </BoxComponent>
                  <InputComponent
                    label="CNIC"
                    value={formData.cnic}
                    onChange={(e) => handleFormChange("cnic", e.target.value)}
                    placeholder="Enter CNIC"
                  />
                  <InputComponent
                    label="Vehicle Number"
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      handleFormChange("vehicleNumber", e.target.value)
                    }
                    placeholder="Enter vehicle number"
                  />
                  <InputComponent
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    placeholder="Enter city"
                  />
                  <ImageComponent
                    label="Profile Image"
                    imageURL={formData.profileImage}
                    onImageUpload={handleImageUpload}
                    hidePreview={!!formData.profileImage}
                  />
                </BoxComponent>

                {/* Form Actions */}
                <BoxComponent display="flex" gap="10px" marginTop="30px">
                  <ButtonComponent
                    variant="contained"
                    backgroundColor="var(--primary)"
                    sx={{
                      color: "var(--light)",
                      padding: "10px",
                      flex: 1,
                    }}
                    onClick={handleSubmitDriver}
                    disabled={formLoading}
                  >
                    {formLoading
                      ? "Saving..."
                      : selectedDriver
                      ? "Update"
                      : "Submit"}
                  </ButtonComponent>
                  <ButtonComponent
                    variant="contained"
                    backgroundColor="var(--error)"
                    sx={{
                      color: "var(--light)",
                      padding: "10px",
                      flex: 1,
                    }}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </ButtonComponent>
                </BoxComponent>
              </BoxComponent>
            )}
          </BoxComponent>
        </BoxComponent>
      )}
    </BoxComponent>
  );
}
