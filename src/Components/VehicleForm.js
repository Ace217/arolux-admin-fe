import React, { useState, useEffect } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import ImageComponent from "./ImageComponent";
import ButtonComponent from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { createVehicleCategory, updateVehicleCategory } from "../api/constants";
import { toast } from "react-toastify";

export default function VehicleForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || "Add Vehicle Category";
  const categoryId = location.state?.categoryId;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minSeatingCapacity: "",
    maxSeatingCapacity: "",
    iconURL:
      "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
    isActive: true,
  });

  useEffect(() => {
    if (location.state?.categoryData) {
      const {
        name,
        description,
        iconURL,
        minSeatingCapacity,
        maxSeatingCapacity,
        isActive,
      } = location.state.categoryData;
      setFormData({
        name,
        description,
        iconURL,
        minSeatingCapacity: minSeatingCapacity.toString(),
        maxSeatingCapacity: maxSeatingCapacity.toString(),
        isActive,
      });
    }
  }, [location.state]);

  const handleChange = (field, value) => {
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

  const handleSubmit = async () => {
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
      if (categoryId) {
        response = await updateVehicleCategory(categoryId, requestData, token);
      } else {
        response = await createVehicleCategory(requestData, token);
      }

      if (response?.data?.success) {
        toast.success(
          categoryId
            ? "Vehicle category updated successfully!"
            : "Vehicle category created successfully!"
        );
        navigate(-1);
      } else {
        toast.error(
          response?.data?.message ||
            `Failed to ${categoryId ? "update" : "create"} vehicle category`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message ||
          `An error occurred while ${
            categoryId ? "updating" : "creating"
          } the category`
      );
    }
  };

  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      backgroundColor="var(--light)"
    >
      <BoxComponent
        margin="50px"
        padding="30px 15px"
        borderRadius="10px"
        width="80%"
        gap="20px"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor="var(--white)"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
      >
        <TypographyComponent
          fontSize="40px"
          fontFamily="var(--main)"
          color="var(--dark)"
          fontWeight="400"
        >
          {title}
        </TypographyComponent>
        <InputComponent
          label="Name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <InputComponent
          label="Description"
          placeholder="Enter Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <InputComponent
          label="Minimum Seating Capacity"
          type="number"
          placeholder="Enter Minimum Seating Capacity"
          value={formData.minSeatingCapacity}
          onChange={(e) => handleChange("minSeatingCapacity", e.target.value)}
        />
        <InputComponent
          label="Maximum Seating Capacity"
          type="number"
          placeholder="Enter Maximum Seating Capacity"
          value={formData.maxSeatingCapacity}
          onChange={(e) => handleChange("maxSeatingCapacity", e.target.value)}
        />
        <ImageComponent
          label="Vehicle Category Image"
          imageURL={formData.iconURL}
          onImageUpload={handleImageUpload}
        />
        <BoxComponent display="flex" gap="10px">
          <ButtonComponent
            variant="contained"
            backgroundColor="var(--primary)"
            sx={{ color: "var(--light)", padding: "10px 20px" }}
            onClick={handleSubmit}
          >
            {categoryId ? "Update" : "Submit"}
          </ButtonComponent>
          <ButtonComponent
            variant="contained"
            backgroundColor="var(--error)"
            sx={{ color: "var(--light)", padding: "10px 20px" }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </ButtonComponent>
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
