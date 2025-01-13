import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import AdminSelection from "./AdminSelection";
import ButtonComponent from "./Button";

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
        {isSuccess && (
          <ButtonComponent
            variant="contained"
            backgroundColor="var(--primary)"
            sx={{
              marginTop: "10px",
              fontSize: "12px",
              padding: "5px 20px",
              borderRadius: "20px",
            }}
            onClick={onClose}
          >
            Close Form
          </ButtonComponent>
        )}
      </BoxComponent>
    </BoxComponent>
  );
}

export default function Form({ onCancel, title }) {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // State for adminType and permissions from AdminSelection
  const [selectedadminType, setSelectedadminType] = useState('superAdmin');
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

  // State for error and success messages
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle adminType change from AdminSelection
  const handleadminTypeChange = (adminType) => {
    setSelectedadminType(adminType);
  };

  // Handle permission change from AdminSelection
  const handlePermissionsChange = (permission, checked) => {
    setPermissions((prev) => ({ ...prev, [permission]: checked }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Reset previous messages
    setMessage("");
    setShowPopup(false);

    // Validate form data (e.g., check password match)
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    try {
      // Send API request
      const response = await fetch(
        "http://3.137.118.155:8000/api/v1/admin/account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Accept header
            "Access-Control-Allow-Origin": "*", // CORS settings
            "Md-Cli-App#J5kep": "J0vqsW7tHAhLf3US2xx3FTOCfQyDiS86", // Custom header
            "Md-Cli-Id": "web-usr", // Custom client ID header
            "Referrer": "https://arolux-admin-fe.vercel.app", // Referrer header
            "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"', // User agent hints
            "Sec-Ch-Ua-Mobile": "?0", // Indicates desktop or non-mobile
            "Sec-Ch-Ua-Platform": '"Windows"', // Platform used
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", // Full user agent string
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            adminType: selectedadminType, // Send adminType
            permissions: selectedadminType === 'subAdmin' ? Object.keys(permissions).filter(permission => permissions[permission]) : [], // Send permissions only if subAdmin
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to add admin");
        setIsSuccess(false);
        setShowPopup(true);
        return;
      }

      setMessage("Sub-Admin added successfully!");
      setIsSuccess(true);
      setShowPopup(true);

      // Reset form data and close form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      setMessage(error.message);
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
              onCancel(); // Close form on success
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
