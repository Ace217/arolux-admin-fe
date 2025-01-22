import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import AdminSelection from "./AdminSelection";
import ButtonComponent from "./Button";
import { account } from "../api/constants"; // Importing account function from api

// Popup component for error and success messages
function Popup({ message, onClose, isSuccess }) {
  return (
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
      onClick={onClose}
    >
      <BoxComponent
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TypographyComponent
          color={isSuccess ? "green" : "red"}
          fontSize="16px"
          fontFamily="var(--main)"
        >
          {message}
        </TypographyComponent>
      </BoxComponent>
    </BoxComponent>
  );
}

export default function Form({ onCancel, title, token }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedadminType, setSelectedadminType] = useState("superAdmin");
  const [permissions, setPermissions] = useState({
    dashboard: false,
    rides: false,
    vehicles: false,
    locations: false,
    drivers: false,
    customers: false,
    configurations: false,
    admins: false,
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleadminTypeChange = (adminType) => {
    setSelectedadminType(adminType);
  };

  const handlePermissionsChange = (permission, checked) => {
    setPermissions((prev) => ({ ...prev, [permission]: checked }));
  };

  const handleSubmit = async () => {
    setMessage("");
    setShowPopup(false);
  
    // Validate form fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setMessage("Please fill all the required fields!");
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }
  
    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        adminType: selectedadminType,
        permissions:
          selectedadminType === "subAdmin"
            ? Object.keys(permissions).filter(
                (permission) => permissions[permission]
              )
            : [],
      };
  
      const token = localStorage.getItem('token'); // Get JWT token from localStorage or sessionStorage
  
      const response = await account(requestData, token);
  
      // Check if there is an error in the response
      if (response.error) {
        setMessage(response.error || "Failed to add admin");
        setIsSuccess(false);
        setShowPopup(true);
        return;
      }
  
      setMessage("New Admin added successfully!");
      setIsSuccess(true);
      setShowPopup(true);
  
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage("An error occurred while adding the admin.");
      setIsSuccess(false);
      setShowPopup(true);
    }
  };
  

  return (
    <>
      {showPopup && (
        <Popup
          message={message}
          isSuccess={isSuccess}
          onClose={() => {
            setShowPopup(false);
            if (isSuccess) {
              onCancel();
            }
          }}
        />
      )}

      <BoxComponent
        boxShadow="1px 1px 1px 1px var(--paragraph)"
        maxHeight="90vh"
        overflow="auto"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        gap="10px"
      >
        <TypographyComponent
          marginTop="20px"
          fontSize="25px"
          fontWeight="600"
          fontFamily="var(--main)"
          color="var(--dull)"
        >
          {title}
        </TypographyComponent>
        <BoxComponent
          width="92%"
          gap="10px"
          display="flex"
          flexDirection="column"
        >
          <InputComponent
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <InputComponent
            label="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <InputComponent
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <InputComponent
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <InputComponent
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
          />
        </BoxComponent>
        <BoxComponent
          width="92%"
          gap="10px"
          display="flex"
          flexDirection="column"
        >
          <AdminSelection
            selectedadminType={selectedadminType}
            selectedPermissions={permissions}
            onadminTypeChange={handleadminTypeChange}
            onPermissionsChange={handlePermissionsChange}
          />
        </BoxComponent>
        <BoxComponent
          display="flex"
          justifyContent="space-between"
          width="90%"
          marginBottom="20px"
        >
          <ButtonComponent
            sx={{
              color: "var(--primary)",
              padding: "10px 70px",
              fontSize: "12px",
              textTransform: "none",
              fontWeight: "600",
              borderRadius: "20px",
            }}
            onClick={onCancel}
          >
            Cancel
          </ButtonComponent>
          <ButtonComponent
            variant="contained"
            backgroundColor="var(--primary)"
            sx={{
              padding: "10px 70px",
              fontSize: "12px",
              borderRadius: "20px",
            }}
            onClick={handleSubmit}
          >
            {title === "Add Sub-Admin" ? "Add Sub-Admin" : "Update Sub-Admin"}
          </ButtonComponent>
        </BoxComponent>
      </BoxComponent>
    </>
  );
}
