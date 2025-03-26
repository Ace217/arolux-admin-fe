import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import ButtonComponent from "./Button";
import { updatePassword } from "../api/constants"; // API function for password update

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

export default function UpdateComponent({ onCancel, token: receivedToken }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!formData.password.trim() || !formData.confirmPassword.trim()) {
      setMessage("Please enter both password fields!");
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

    const token = receivedToken || localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication token is missing. Please log in again.");
      setIsSuccess(false);
      setShowPopup(true);
      return;
    }

    try {
      const requestData = {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const response = await updatePassword(requestData, token);

      if (!response || response.status !== 200) {
        setMessage(response.data?.message || "Password update failed.");
        setIsSuccess(false);
        setShowPopup(true);
        return;
      }

      setMessage("Password updated successfully!");
      setIsSuccess(true);
      setShowPopup(true);

      setFormData({ password: "", confirmPassword: "" });

    } catch (error) {
      console.error("Error:", error);
      setMessage(
        error.response?.data?.error || error.message || "An unexpected error occurred."
      );
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
          Update Password
        </TypographyComponent>

        <BoxComponent width="92%" gap="10px" display="flex" flexDirection="column">
          <InputComponent
            label="New Password"
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
              padding: "10px 20px",
              fontSize: "12px",
              borderRadius: "20px",
            }}
            onClick={handleSubmit}
          >
            Update Password
          </ButtonComponent>
        </BoxComponent>
      </BoxComponent>
    </>
  );
}
