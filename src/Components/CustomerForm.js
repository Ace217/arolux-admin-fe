import React, { useState, useEffect } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import ImageComponent from "./ImageComponent";
import ButtonComponent from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import CancelIcon from "@mui/icons-material/Cancel";
import { updateCustomer, getCustomerDetails } from "../api/constants";

export default function CustomerForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, customerData } = location.state || {};
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImageURL: "",
  });

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (customerData?.id) {
        setLoading(true);
        try {
          const token = Cookies.get("token");
          const response = await getCustomerDetails(customerData.id, token);
          if (response?.data?.success) {
            const details = response.data.data;
            setFormData({
              name: details.name || "",
              email: details.email || "",
              phone: `${details.countryCode || "+1"}${
                details.phoneNumber || ""
              }`,
              profileImageURL: details.profileImageURL || "",
            });
          }
        } catch (error) {
          console.error("Error fetching customer details:", error);
          toast.error("Error fetching customer details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomerDetails();
  }, [customerData?.id]);

  const handleChange = (field, value) => {
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

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
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

      const response = await updateCustomer(customerData.id, payload, token);

      if (response?.data?.success) {
        toast.success("Customer updated successfully!");
        navigate(-1);
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

  return (
    <BoxComponent
      display="flex"
      justifyContent="space-around"
      alignItems="center"
      backgroundColor="var(--light)"
    >
      {loading ? (
        <TypographyComponent>Loading...</TypographyComponent>
      ) : (
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
          <BoxComponent width="100%" display="flex" flexDirection="column">
            <BoxComponent
              display="flex"
              justifyContent="flex-end"
              width="100%"
              sx={{ cursor: "pointer" }}
            >
              <CancelIcon onClick={handleCancel} fontSize="large" />
            </BoxComponent>

            <TypographyComponent
              fontSize="40px"
              color="var(--dull)"
              fontFamily="var(--main)"
              fontWeight="600"
              marginBottom="20px"
              textAlign="center"
              width="100%"
            >
              {title || "Edit Customer"}
            </TypographyComponent>
          </BoxComponent>

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
              label="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </BoxComponent>

          <BoxComponent width="90%">
            <InputComponent
              variant="outlined"
              label="Phone Number (with country code)"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1234567890"
            />
          </BoxComponent>

          <ImageComponent
            onImageUpload={handleImageUpload}
            currentImage={formData.profileImageURL}
          />

          <ButtonComponent
            variant="contained"
            backgroundColor="var(--primary)"
            sx={{
              width: "90%",
              padding: "10px",
            }}
            onClick={handleSubmit}
          >
            Update Customer
          </ButtonComponent>
        </BoxComponent>
      )}
    </BoxComponent>
  );
}
