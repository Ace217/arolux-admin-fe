import React, { useState, useContext, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import {
  createVehicleCategoryFare,
  updateVehicleCategoryFare,
} from "../api/constants";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import ButtonComponent from "./Button";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormControlLabel, Switch, Divider } from "@mui/material";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const VehicleCategoryFareForm = ({
  open,
  handleClose,
  fare,
  vehicleCategories,
  geoLocations,
}) => {
  const { adminToken } = useContext(AdminContext);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const initialFormState = {
    vehicleCategoryId: "",
    geoLocationId: "",
    baseFare: 0,
    chargesPerMile: 0,
    chargesPerMinute: 0,
    chargesPerHour: 0,
    minimumFare: 0,
    suitedCharges: 0,
    currencyCode: "USD",
    currencySymbol: "$",
    isActive: true,
    extraCharges: [],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (fare) {
      setFormData({
        vehicleCategoryId: fare.vehicleCategoryId?._id || "",
        geoLocationId: fare.geoLocationId?._id || "",
        baseFare: fare.baseFare || 0,
        chargesPerMile: fare.chargesPerMile || 0,
        chargesPerMinute: fare.chargesPerMinute || 0,
        chargesPerHour: fare.chargesPerHour || 0,
        minimumFare: fare.minimumFare || 0,
        suitedCharges: fare.suitedCharges || 0,
        currencyCode: fare.currencyCode || "USD",
        currencySymbol: fare.currencySymbol || "$",
        isActive: fare.isActive ?? true,
        extraCharges: fare.extraCharges || [],
      });
    } else {
      setFormData(initialFormState);
    }
  }, [fare]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear validation error when field is updated
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: "",
      });
    }
  };

  const handleSwitchChange = (field, checked) => {
    setFormData({
      ...formData,
      [field]: checked,
    });
  };

  const handleAddExtraCharge = () => {
    setFormData({
      ...formData,
      extraCharges: [...formData.extraCharges, { name: "", value: 0 }],
    });
  };

  const handleRemoveExtraCharge = (index) => {
    const updatedExtraCharges = [...formData.extraCharges];
    updatedExtraCharges.splice(index, 1);
    setFormData({
      ...formData,
      extraCharges: updatedExtraCharges,
    });
  };

  const handleExtraChargeChange = (index, field, value) => {
    const updatedExtraCharges = [...formData.extraCharges];
    updatedExtraCharges[index] = {
      ...updatedExtraCharges[index],
      [field]: field === "value" ? Number(value) : value,
    };
    setFormData({
      ...formData,
      extraCharges: updatedExtraCharges,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.vehicleCategoryId) {
      errors.vehicleCategoryId = "Vehicle category is required";
    }
    if (!formData.geoLocationId) {
      errors.geoLocationId = "Location is required";
    }
    if (formData.baseFare < 0) {
      errors.baseFare = "Base fare cannot be negative";
    }
    if (formData.chargesPerMile < 0) {
      errors.chargesPerMile = "Per mile charges cannot be negative";
    }
    if (formData.chargesPerMinute < 0) {
      errors.chargesPerMinute = "Per minute charges cannot be negative";
    }
    if (formData.minimumFare < 0) {
      errors.minimumFare = "Minimum fare cannot be negative";
    }

    formData.extraCharges.forEach((charge, index) => {
      if (!charge.name) {
        errors[`extraCharges[${index}].name`] = "Name is required";
      }
      if (charge.value < 0) {
        errors[`extraCharges[${index}].value`] = "Value cannot be negative";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        baseFare: Number(formData.baseFare),
        chargesPerMile: Number(formData.chargesPerMile),
        chargesPerMinute: Number(formData.chargesPerMinute),
        chargesPerHour: Number(formData.chargesPerHour),
        minimumFare: Number(formData.minimumFare),
        suitedCharges: Number(formData.suitedCharges),
      };

      // Get the token from cookies, this matches how the Categories page works
      const token = Cookies.get("token");
      console.log("Submitting form with token:", token);

      let response;
      if (fare) {
        console.log("Updating fare:", fare._id, payload);
        response = await updateVehicleCategoryFare(fare._id, payload, token);
      } else {
        console.log("Creating new fare:", payload);
        response = await createVehicleCategoryFare(payload, token);
      }

      console.log("Form submission response:", response);

      if (response?.data?.success) {
        toast.success(
          fare ? "Fare updated successfully!" : "Fare created successfully!"
        );
        handleClose();
      } else {
        toast.error(
          response?.data?.message || "Failed to save fare information"
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save fare information"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
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
            {fare ? "Edit Fare" : "Add New Fare"}
          </TypographyComponent>
          <CancelIcon onClick={handleClose} style={{ cursor: "pointer" }} />
        </BoxComponent>

        {/* Modal body */}
        {loading ? (
          <BoxComponent display="flex" justifyContent="center" padding="20px">
            <TypographyComponent>Loading...</TypographyComponent>
          </BoxComponent>
        ) : (
          <BoxComponent display="flex" flexDirection="column" gap="20px">
            {/* Vehicle Category Dropdown */}
            <InputComponent
              label="Vehicle Category"
              type="select"
              value={formData.vehicleCategoryId}
              onChange={(e) =>
                handleChange("vehicleCategoryId", e.target.value)
              }
              options={vehicleCategories.map((cat) => ({
                value: cat._id,
                label: cat.name,
              }))}
              error={formErrors.vehicleCategoryId}
            />

            {/* Location Dropdown */}
            <InputComponent
              label="Location"
              type="select"
              value={formData.geoLocationId}
              onChange={(e) => handleChange("geoLocationId", e.target.value)}
              options={geoLocations.map((loc) => ({
                value: loc._id,
                label: loc.name,
              }))}
              error={formErrors.geoLocationId}
            />

            <TypographyComponent
              fontSize="16px"
              fontFamily="var(--main)"
              color="var(--dark)"
              fontWeight="600"
              marginTop="10px"
            >
              Fare Details
            </TypographyComponent>
            <Divider />

            <BoxComponent display="flex" gap="15px" flexWrap="wrap">
              <InputComponent
                label="Base Fare"
                type="number"
                value={formData.baseFare}
                onChange={(e) => handleChange("baseFare", e.target.value)}
                prefix={formData.currencySymbol}
                error={formErrors.baseFare}
                style={{ width: "calc(50% - 10px)" }}
              />

              <InputComponent
                label="Charges Per Mile"
                type="number"
                value={formData.chargesPerMile}
                onChange={(e) => handleChange("chargesPerMile", e.target.value)}
                prefix={formData.currencySymbol}
                error={formErrors.chargesPerMile}
                style={{ width: "calc(50% - 10px)" }}
              />

              <InputComponent
                label="Charges Per Minute"
                type="number"
                value={formData.chargesPerMinute}
                onChange={(e) =>
                  handleChange("chargesPerMinute", e.target.value)
                }
                prefix={formData.currencySymbol}
                error={formErrors.chargesPerMinute}
                style={{ width: "calc(50% - 10px)" }}
              />

              <InputComponent
                label="Charges Per Hour"
                type="number"
                value={formData.chargesPerHour}
                onChange={(e) => handleChange("chargesPerHour", e.target.value)}
                prefix={formData.currencySymbol}
                error={formErrors.chargesPerHour}
                style={{ width: "calc(50% - 10px)" }}
              />

              <InputComponent
                label="Minimum Fare"
                type="number"
                value={formData.minimumFare}
                onChange={(e) => handleChange("minimumFare", e.target.value)}
                prefix={formData.currencySymbol}
                error={formErrors.minimumFare}
                style={{ width: "calc(50% - 10px)" }}
              />

              <InputComponent
                label="Suited Charges"
                type="number"
                value={formData.suitedCharges}
                onChange={(e) => handleChange("suitedCharges", e.target.value)}
                prefix={formData.currencySymbol}
                error={formErrors.suitedCharges}
                style={{ width: "calc(50% - 10px)" }}
              />
            </BoxComponent>

            <BoxComponent display="flex" gap="15px">
              <InputComponent
                label="Currency Code"
                value={formData.currencyCode}
                onChange={(e) => handleChange("currencyCode", e.target.value)}
                style={{ width: "calc(50% - 10px)" }}
              />

              <InputComponent
                label="Currency Symbol"
                value={formData.currencySymbol}
                onChange={(e) => handleChange("currencySymbol", e.target.value)}
                style={{ width: "calc(50% - 10px)" }}
              />
            </BoxComponent>

            <BoxComponent
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginTop="10px"
            >
              <TypographyComponent
                fontSize="16px"
                fontFamily="var(--main)"
                color="var(--dark)"
                fontWeight="600"
              >
                Extra Charges
              </TypographyComponent>
              <ButtonComponent
                variant="outlined"
                backgroundColor="transparent"
                sx={{
                  color: "var(--primary)",
                  borderColor: "var(--primary)",
                  padding: "5px 10px",
                }}
                onClick={handleAddExtraCharge}
                title="Add Charge"
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Charge
              </ButtonComponent>
            </BoxComponent>
            <Divider />

            {formData.extraCharges.map((charge, index) => (
              <BoxComponent
                key={index}
                display="flex"
                gap="10px"
                alignItems="center"
              >
                <InputComponent
                  label="Charge Name"
                  value={charge.name}
                  onChange={(e) =>
                    handleExtraChargeChange(index, "name", e.target.value)
                  }
                  error={formErrors[`extraCharges[${index}].name`]}
                  style={{ flex: 2 }}
                />
                <InputComponent
                  label="Charge Value"
                  type="number"
                  value={charge.value}
                  onChange={(e) =>
                    handleExtraChargeChange(index, "value", e.target.value)
                  }
                  prefix={formData.currencySymbol}
                  error={formErrors[`extraCharges[${index}].value`]}
                  style={{ flex: 2 }}
                />
                <DeleteIcon
                  onClick={() => handleRemoveExtraCharge(index)}
                  style={{
                    color: "var(--error)",
                    cursor: "pointer",
                    alignSelf: "center",
                    marginTop: "10px",
                  }}
                />
              </BoxComponent>
            ))}

            <BoxComponent marginTop="10px">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleSwitchChange("isActive", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <TypographyComponent
                    fontSize="14px"
                    fontFamily="var(--main)"
                    color="var(--dark)"
                  >
                    Active
                  </TypographyComponent>
                }
              />
            </BoxComponent>

            <BoxComponent display="flex" gap="10px" marginTop="15px">
              <ButtonComponent
                variant="contained"
                backgroundColor="var(--primary)"
                sx={{
                  color: "var(--light)",
                  padding: "10px",
                  flex: 1,
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : fare ? "Update" : "Submit"}
              </ButtonComponent>
              <ButtonComponent
                variant="contained"
                backgroundColor="var(--error)"
                sx={{
                  color: "var(--light)",
                  padding: "10px",
                  flex: 1,
                }}
                onClick={handleClose}
              >
                Cancel
              </ButtonComponent>
            </BoxComponent>
          </BoxComponent>
        )}
      </BoxComponent>
    </BoxComponent>
  );
};

export default VehicleCategoryFareForm;
