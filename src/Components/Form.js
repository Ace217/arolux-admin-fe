import React, { useState } from "react";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import AdminSelection from "./AdminSelection";
import ButtonComponent from "./Button";

export default function Form({ onCancel, title }) {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form data (e.g., check password match)
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Send API request
      const response = await fetch('http://localhost:8000/api/v1/admin/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add admin");
      }

      alert("Sub-Admin added successfully!");
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <BoxComponent
      boxShadow="1px 1px 1px 1px var(--paragraph)"
      maxHeight="90vh"
      overflow="auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
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
      <BoxComponent width="92%" gap="10px" display="flex" flexDirection="column">
        <InputComponent
          label="Sub-Admin Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <InputComponent
          label="Sub-Admin Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <InputComponent
          label="Sub-Admin Phone Number"
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
      <BoxComponent padding="5px 20px">
        <AdminSelection />
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
  );
}
