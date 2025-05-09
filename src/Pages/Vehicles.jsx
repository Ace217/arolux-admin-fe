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
import axios from "axios"; // Import axios
import InputComponent from "../Components/InputComponent";
import ImageComponent from "../Components/ImageComponent";
import CancelIcon from "@mui/icons-material/Cancel";
import Cookies from "js-cookie";
import { createVehicleCategory, updateVehicleCategory } from "../api/constants";
import { toast } from "react-toastify";

export default function Vehicles() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Vehicle");
  const [vehicleFormLoading, setVehicleFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minSeatingCapacity: "",
    maxSeatingCapacity: "",
    iconURL:
      "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
    isActive: true,
  });

  const handleDetailClick = (id) => {
    navigate(`/details?id=${id}`);
  };

  const handleVehicle = (id) => {
    navigate(`/vehicles`);
  };

  const handleAddVehicle = () => {
    setModalTitle("Add Vehicle");
    setSelectedCategoryId(null);
    setFormData({
      name: "",
      description: "",
      minSeatingCapacity: "",
      maxSeatingCapacity: "",
      iconURL:
        "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setModalTitle("Update Vehicle");
    setSelectedCategoryId(vehicle.id);
    setVehicleFormLoading(true);
    setIsModalOpen(true);

    // In a real implementation, you would fetch the vehicle details here
    // For now, we'll simulate with the existing data
    setTimeout(() => {
      setFormData({
        name: vehicle.category || "",
        description: "Vehicle description",
        minSeatingCapacity: "2",
        maxSeatingCapacity: "4",
        iconURL: vehicle.coverImage || "",
        isActive: vehicle.Status === "Active",
      });
      setVehicleFormLoading(false);
    }, 500);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
    setFormData({
      name: "",
      description: "",
      minSeatingCapacity: "",
      maxSeatingCapacity: "",
      iconURL:
        "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
      isActive: true,
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
      iconURL: url,
    }));
  };

  const handleSubmitForm = async () => {
    // Validate form fields
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.minSeatingCapacity) {
      toast.error("Minimum seating capacity is required");
      return;
    }
    if (!formData.maxSeatingCapacity) {
      toast.error("Maximum seating capacity is required");
      return;
    }
    if (
      parseInt(formData.minSeatingCapacity) >
      parseInt(formData.maxSeatingCapacity)
    ) {
      toast.error(
        "Minimum seating capacity cannot be greater than maximum seating capacity"
      );
      return;
    }
    if (!formData.iconURL) {
      toast.error("Vehicle category image is required");
      return;
    }

    try {
      const token = Cookies.get("token");
      const requestData = {
        ...formData,
        minSeatingCapacity: parseInt(formData.minSeatingCapacity),
        maxSeatingCapacity: parseInt(formData.maxSeatingCapacity),
      };

      let response;
      if (selectedCategoryId) {
        // This would be the real API call in a production environment
        // response = await updateVehicleCategory(selectedCategoryId, requestData, token);

        // For demo, we'll just simulate success
        response = { data: { success: true } };

        // Update the row in the table
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedCategoryId
              ? {
                  ...row,
                  category: formData.name,
                  coverImage: formData.iconURL,
                  Status: formData.isActive ? "Active" : "Inactive",
                }
              : row
          )
        );
      } else {
        // This would be the real API call in a production environment
        // response = await createVehicleCategory(requestData, token);

        // For demo, we'll just simulate success
        response = { data: { success: true } };

        // Add the new vehicle to the table
        const newId = Math.max(...rows.map((row) => row.id)) + 1;
        setRows([
          ...rows,
          {
            id: newId,
            category: formData.name,
            coverImage: formData.iconURL,
            Status: formData.isActive ? "Active" : "Inactive",
          },
        ]);
      }

      if (response?.data?.success) {
        toast.success(
          selectedCategoryId
            ? "Vehicle updated successfully!"
            : "Vehicle created successfully!"
        );
        handleCloseModal();
      } else {
        toast.error(
          response?.data?.message ||
            `Failed to ${selectedCategoryId ? "update" : "create"} vehicle`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message ||
          `An error occurred while ${
            selectedCategoryId ? "updating" : "creating"
          } the vehicle`
      );
    }
  };

  const [rows, setRows] = useState([
    {
      id: 1,
      coverImage: "Images/logo.png",
      category: "Ride",
      Status: "Active",
    },
    {
      id: 2,
      coverImage: "Images/logo.png",
      category: "Ride AC",
      Status: "Active",
    },
    {
      id: 3,
      coverImage: "Images/logo.png",
      category: "Courier",
      Status: "Active",
    },
    {
      id: 4,
      coverImage: "Images/logo.png",
      category: "Bike",
      Status: "Active",
    },
    {
      id: 5,
      coverImage: "Images/logo.png",
      category: "Ride Mini",
      Status: "Active",
    },
    {
      id: 6,
      coverImage: "Images/logo.png",
      category: "Trip Booking",
      Status: "Active",
    },
    {
      id: 7,
      coverImage: "Images/logo.png",
      category: "Bike",
      Status: "Active",
    },
    {
      id: 8,
      coverImage: "Images/logo.png",
      category: "Bike",
      Status: "Active",
    },
    {
      id: 9,
      coverImage: "Images/logo.png",
      category: "Ride",
      Status: "Active",
    },
    {
      id: 10,
      coverImage: "Images/logo.png",
      category: "Ride AC",
      Status: "Active",
    },
    {
      id: 11,
      coverImage: "Images/logo.png",
      category: "Ride",
      Status: "Active",
    },
    {
      id: 12,
      coverImage: "Images/logo.png",
      category: "Trip Booking",
      Status: "Active",
    },
    {
      id: 13,
      coverImage: "Images/logo.png",
      category: "Ride AC",
      Status: "Active",
    },
    {
      id: 14,
      coverImage: "Images/logo.png",
      category: "Courier",
      Status: "Active",
    },
    {
      id: 15,
      coverImage: "Images/logo.png",
      category: "Ride",
      Status: "Active",
    },
  ]);

  const headings = [
    { field: "id", headerName: "Vehicle ID" },
    {
      field: "coverImage",
      headerName: "Cover Image",
      renderCell: (params) => (
        <img
          src={params.row.coverImage}
          alt="Cover"
          style={{ width: "80px", height: "40px" }}
        />
      ),
    },
    { field: "category", headerName: "Category" },
    { field: "Add text here", headerName: "Add text here" },
    { field: "Add text here", headerName: "Add text here" },
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
      setFilteredVehicles(
        rows.filter((vehicle) => vehicle.category === category)
      );
    } else {
      setFilteredVehicles(rows); // Show all vehicles if no category filter is applied
    }
  }, [location.search, rows]); // Re-run effect when location.search or rows changes

  useEffect(() => {
    console.log("Coming here");
    // Fetch vehicle categories when the component mounts
    const fetchVehicleCategories = async () => {
      try {
        const response = await axios.get(
          "admin/vehicle-categories/list?limit=10&offset=0&searchText=&isActive="
        );
        console.log("Vehicle Categories Response:", response.data);
      } catch (error) {
        console.error("Error fetching vehicle categories:", error);
      }
    };

    fetchVehicleCategories();
  }, []); // Empty dependency array ensures this runs only once

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
              VEHICLES
            </TypographyComponent>
            <BoxComponent
              display="flex"
              justifyContent="space-between"
              gap="5px"
            >
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
          <Find
            placeholder="Search a Vehicle by ID"
            label="Status"
            status={status}
          />
          <Table
            rows={filteredVehicles} // Display filtered vehicles here
            headings={headings}
            icons={icons}
            onEdit={handleEditVehicle}
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
                      {modalTitle}
                    </TypographyComponent>
                    <CancelIcon
                      onClick={handleCloseModal}
                      style={{ cursor: "pointer" }}
                    />
                  </BoxComponent>

                  {/* Modal body */}
                  {vehicleFormLoading ? (
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
                        {formData.iconURL && (
                          <img
                            src={formData.iconURL}
                            alt="Vehicle"
                            style={{
                              width: "120px",
                              height: "80px",
                              objectFit: "cover",
                              marginBottom: "10px",
                              borderRadius: "8px",
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
                        label="Description"
                        value={formData.description}
                        onChange={(e) =>
                          handleFormChange("description", e.target.value)
                        }
                      />
                      <InputComponent
                        label="Minimum Seating Capacity"
                        type="number"
                        value={formData.minSeatingCapacity}
                        onChange={(e) =>
                          handleFormChange("minSeatingCapacity", e.target.value)
                        }
                      />
                      <InputComponent
                        label="Maximum Seating Capacity"
                        type="number"
                        value={formData.maxSeatingCapacity}
                        onChange={(e) =>
                          handleFormChange("maxSeatingCapacity", e.target.value)
                        }
                      />
                      <ImageComponent
                        label="Vehicle Category Image"
                        imageUrl={formData.iconURL}
                        onImageUpload={handleImageUpload}
                        hidePreview={!!formData.iconURL}
                      />
                      <BoxComponent display="flex" gap="10px">
                        <ButtonComponent
                          variant="contained"
                          backgroundColor="var(--primary)"
                          sx={{
                            color: "var(--light)",
                            padding: "10px",
                            flex: 1,
                          }}
                          onClick={handleSubmitForm}
                        >
                          {selectedCategoryId ? "Update" : "Submit"}
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
            </>
          )}
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
