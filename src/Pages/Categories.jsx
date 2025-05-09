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
import { getVehicleCategories, createVehicleCategory, updateVehicleCategory } from "../api/constants";
import Cookies from "js-cookie";
import { useDebounce } from "../hooks/useDebounce";
import CancelIcon from "@mui/icons-material/Cancel";
import InputComponent from "../Components/InputComponent";
import ImageComponent from "../Components/ImageComponent";
import { toast } from "react-toastify";

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
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Category");
  const [categoryFormLoading, setCategoryFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minSeatingCapacity: "",
    maxSeatingCapacity: "",
    iconURL: "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
    isActive: true,
  });

  const handleCategoryClick = (categoryName) => {
    navigate(`/vehicles?category=${categoryName}`);
  };

  const handleAddCategory = () => {
    setModalTitle("Add Category");
    setSelectedCategoryId(null);
    setFormData({
      name: "",
      description: "",
      minSeatingCapacity: "",
      maxSeatingCapacity: "",
      iconURL: "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setModalTitle("Update Category");
    setSelectedCategoryId(category._id);
    setCategoryFormLoading(true);
    setIsModalOpen(true);
    
    try {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        iconURL: category.iconURL || "",
        minSeatingCapacity: category.minSeatingCapacity?.toString() || "",
        maxSeatingCapacity: category.maxSeatingCapacity?.toString() || "",
        isActive: category.isActive || false,
      });
    } catch (error) {
      console.error("Error setting category data:", error);
      toast.error("Error loading category data");
    } finally {
      setCategoryFormLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryId(null);
    setFormData({
      name: "",
      description: "",
      minSeatingCapacity: "",
      maxSeatingCapacity: "",
      iconURL: "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
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
      toast.error("Category icon is required");
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
        response = await updateVehicleCategory(selectedCategoryId, requestData, token);
      } else {
        response = await createVehicleCategory(requestData, token);
      }

      if (response?.data?.success) {
        toast.success(
          selectedCategoryId
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
        
        // Refresh the categories list
        fetchCategories({
          searchText: debouncedSearchText,
          isActive,
        });
        
        handleCloseModal();
      } else {
        toast.error(
          response?.data?.message ||
            `Failed to ${selectedCategoryId ? "update" : "create"} category`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message ||
          `An error occurred while ${
            selectedCategoryId ? "updating" : "creating"
          } the category`
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
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#555',
                    },
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#888 #f1f1f1',
                  }}
                >
                  {/* Modal header */}
                  <BoxComponent display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
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
                  {categoryFormLoading ? (
                    <BoxComponent display="flex" justifyContent="center" padding="20px">
                      <TypographyComponent>Loading...</TypographyComponent>
                    </BoxComponent>
                  ) : (
                    <BoxComponent display="flex" flexDirection="column" gap="20px">
                      <BoxComponent
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        marginBottom="20px"
                      >
                        {formData.iconURL && (
                          <img
                            src={formData.iconURL}
                            alt="Category Icon"
                            style={{
                              width: "120px",
                              height: "120px",
                              objectFit: "contain",
                              marginBottom: "10px",
                              borderRadius: "8px"
                            }}
                          />
                        )}
                      </BoxComponent>
                      <InputComponent
                        label="Name"
                        value={formData.name}
                        onChange={(e) => handleFormChange("name", e.target.value)}
                      />
                      <InputComponent
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleFormChange("description", e.target.value)}
                      />
                      <InputComponent
                        label="Minimum Seating Capacity"
                        type="number"
                        value={formData.minSeatingCapacity}
                        onChange={(e) => handleFormChange("minSeatingCapacity", e.target.value)}
                      />
                      <InputComponent
                        label="Maximum Seating Capacity"
                        type="number"
                        value={formData.maxSeatingCapacity}
                        onChange={(e) => handleFormChange("maxSeatingCapacity", e.target.value)}
                      />
                      <ImageComponent
                        label="Category Icon"
                        imageUrl={formData.iconURL}
                        onImageUpload={handleImageUpload}
                        hidePreview={!!formData.iconURL}
                      />
                      <BoxComponent display="flex" gap="10px">
                        <ButtonComponent 
                          variant="contained"
                          backgroundColor="var(--primary)"
                          sx={{ color: "var(--light)", padding: "10px", flex: 1 }}
                          onClick={handleSubmitForm}
                        >
                          {selectedCategoryId ? "Update" : "Submit"}
                        </ButtonComponent>
                        <ButtonComponent
                          variant="contained"
                          backgroundColor="var(--error)"
                          sx={{ color: "var(--light)", padding: "10px", flex: 1 }}
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
