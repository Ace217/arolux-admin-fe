import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import ImageComponent from "./ImageComponent";
import ButtonComponent from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { createVehicleCategory } from "../api/constants";
import { toast } from "react-toastify";

export default function VehicleForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = location.state?.title || "Add Vehicle";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minSeatingCapacity: "",
    maxSeatingCapacity: "",
    iconURL:
      "https://arolux-development.s3.us-east-2.amazonaws.com/vehicle-category-images/1000X1000/LEa8gL-1742942696.png",
  });

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
      const response = await createVehicleCategory(
        {
          ...formData,
          minSeatingCapacity: parseInt(formData.minSeatingCapacity),
          maxSeatingCapacity: parseInt(formData.maxSeatingCapacity),
          isActive: true,
        },
        token
      );

      console.log("response", response);
      if (response?.data?.success) {
        toast.success("Vehicle category created successfully!");
        navigate(-1);
      } else {
        toast.error(
          response?.data?.message || "Failed to create vehicle category"
        );
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while creating the category"
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
          color="var(--dull)"
          fontFamily="var(--main)"
          fontWeight="600"
          marginBottom="20px"
        >
          {title}
        </TypographyComponent>
        <BoxComponent width="90%">
          <InputComponent
            variant="outlined"
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </BoxComponent>
        <BoxComponent width="90%">
          <InputComponent
            variant="outlined"
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </BoxComponent>
        <BoxComponent width="90%" display="flex" gap="20px">
          <InputComponent
            variant="outlined"
            label="Min Seating Capacity"
            type="number"
            value={formData.minSeatingCapacity}
            onChange={(e) => handleChange("minSeatingCapacity", e.target.value)}
          />
          <InputComponent
            variant="outlined"
            label="Max Seating Capacity"
            type="number"
            value={formData.maxSeatingCapacity}
            onChange={(e) => handleChange("maxSeatingCapacity", e.target.value)}
          />
        </BoxComponent>
        <ImageComponent onImageUpload={handleImageUpload} />
        <ButtonComponent
          variant="contained"
          backgroundColor="var(--primary)"
          sx={{
            width: "90%",
            padding: "10px",
          }}
          onClick={handleSubmit}
        >
          Submit
        </ButtonComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
