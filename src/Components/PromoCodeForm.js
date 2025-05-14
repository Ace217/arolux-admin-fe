import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import InputComponent from "./InputComponent";
import ButtonComponent from "./Button";
import Dropdown from "./Dropdown";
import CancelIcon from "@mui/icons-material/Cancel";
import Modal from "@mui/material/Modal";
import {
  createPromoCode,
  updatePromoCode,
  getPromoCodesGeoLocations,
  getPromoCodesVehicleCategories,
} from "../api/constants";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function PromoCodeForm({ open, onClose, promoCodeData }) {
  const [loading, setLoading] = useState(false);
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    type: "fixed",
    value: "",
    maximumDiscount: "",
    minimumAmount: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isActive: true,
    vehicleCategoryIds: [],
    geoLocationIds: [],
  });

  // Fetch vehicle categories and locations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        console.log(
          "Token for API calls:",
          token ? "Token exists" : "No token found"
        );

        // Fetch vehicle categories using the promo codes specific endpoint
        console.log("Calling getPromoCodesVehicleCategories API...");
        const vehicleCategoriesResponse = await getPromoCodesVehicleCategories(
          token
        );
        console.log("Vehicle categories response:", vehicleCategoriesResponse);

        if (vehicleCategoriesResponse?.data?.success) {
          console.log(
            "Vehicle categories data structure:",
            vehicleCategoriesResponse.data
          );

          // Handle the vehicle categories data structure
          let categoriesData = [];
          if (
            vehicleCategoriesResponse.data.data &&
            Array.isArray(vehicleCategoriesResponse.data.data.vehicleCategories)
          ) {
            categoriesData =
              vehicleCategoriesResponse.data.data.vehicleCategories;
          } else if (Array.isArray(vehicleCategoriesResponse.data.data)) {
            categoriesData = vehicleCategoriesResponse.data.data;
          } else if (
            vehicleCategoriesResponse.data.data &&
            typeof vehicleCategoriesResponse.data.data === "object"
          ) {
            categoriesData = Object.values(vehicleCategoriesResponse.data.data);
          }

          console.log("Processed vehicle categories:", categoriesData);
          setVehicleCategories(
            categoriesData.map((cat) => ({
              id: cat._id,
              name: cat.name,
            }))
          );
        } else {
          console.error(
            "Vehicle categories API failed:",
            vehicleCategoriesResponse?.data?.message || "Unknown error"
          );
        }

        // Fetch geolocations using the promo codes specific endpoint
        console.log("Calling getPromoCodesGeoLocations API...");
        const geoLocationsResponse = await getPromoCodesGeoLocations(token);
        console.log("GeoLocations API response:", geoLocationsResponse);

        if (geoLocationsResponse?.data?.success) {
          console.log(
            "GeoLocations data structure:",
            geoLocationsResponse.data
          );

          // Handle different possible data structures
          let locationsData = [];
          if (
            geoLocationsResponse.data.data &&
            Array.isArray(geoLocationsResponse.data.data.geoLocations)
          ) {
            locationsData = geoLocationsResponse.data.data.geoLocations;
          } else if (Array.isArray(geoLocationsResponse.data.data)) {
            locationsData = geoLocationsResponse.data.data;
          } else if (
            geoLocationsResponse.data.data &&
            typeof geoLocationsResponse.data.data === "object"
          ) {
            locationsData = Object.values(geoLocationsResponse.data.data);
          }

          console.log("Processed geo locations:", locationsData);
          setLocations(
            locationsData.map((loc) => ({
              id: loc._id,
              name: loc.name,
            }))
          );
        } else {
          console.error(
            "GeoLocations API failed:",
            geoLocationsResponse?.data?.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error details:", error.response?.data || error.message);
        toast.error("Error fetching required data");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Set form data if editing an existing promo code
  useEffect(() => {
    if (promoCodeData) {
      setFormData({
        title: promoCodeData.title || "",
        code: promoCodeData.code || "",
        type: promoCodeData.type || "fixed",
        value: promoCodeData.value || "",
        maximumDiscount: promoCodeData.maximumDiscount || "",
        minimumAmount: promoCodeData.minimumAmount || "",
        startDate: promoCodeData.startDate
          ? new Date(promoCodeData.startDate)
          : new Date(),
        endDate: promoCodeData.endDate
          ? new Date(promoCodeData.endDate)
          : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive:
          promoCodeData.isActive !== undefined ? promoCodeData.isActive : true,
        vehicleCategoryIds: promoCodeData.vehicleCategoryIds || [],
        geoLocationIds: promoCodeData.geoLocationIds || [],
      });
    } else {
      // Reset form if adding a new promo code
      setFormData({
        title: "",
        code: "",
        type: "fixed",
        value: "",
        maximumDiscount: "",
        minimumAmount: "",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive: true,
        vehicleCategoryIds: [],
        geoLocationIds: [],
      });
    }
  }, [promoCodeData, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form fields
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.code.trim()) {
      toast.error("Promo code is required");
      return;
    }
    if (!formData.value || isNaN(formData.value)) {
      toast.error("Value must be a valid number");
      return;
    }
    if (
      formData.type === "percentage" &&
      (formData.value < 0 || formData.value > 100)
    ) {
      toast.error("Percentage value must be between 0 and 100");
      return;
    }
    if (formData.type === "percentage" && formData.maximumDiscount && isNaN(formData.maximumDiscount)) {
      toast.error("Maximum discount must be a valid number");
      return;
    }
    if (formData.minimumAmount && isNaN(formData.minimumAmount)) {
      toast.error("Minimum amount must be a valid number");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      toast.error("Start and end dates are required");
      return;
    }
    if (formData.endDate <= formData.startDate) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get("token");
      
      // Map 'percentage' type to 'percent' for the API payload
      const typeForAPI = formData.type === "percentage" ? "percent" : formData.type;
      
      // Create API payload with exact structure required
      const payload = {
        title: formData.title,
        code: formData.code,
        type: typeForAPI,
        value: Number(formData.value),
        // For fixed type, maximumDiscount should be 0
        maximumDiscount: typeForAPI === "fixed" ? 0 : (formData.maximumDiscount ? Number(formData.maximumDiscount) : null),
        minimumAmount: formData.minimumAmount ? Number(formData.minimumAmount) : null,
        startDate: formData.startDate.toISOString().split("T")[0],
        endDate: formData.endDate.toISOString().split("T")[0],
        isActive: formData.isActive,
        // Ensure all IDs are strings
        vehicleCategoryIds: (formData.vehicleCategoryIds || []).map(id => String(id)),
        geoLocationIds: (formData.geoLocationIds || []).map(id => String(id))
      };

      // Log the payload for debugging
      console.log("Sending promo code payload:", payload);

      let response;
      if (promoCodeData?.id) {
        // Update existing promo code
        response = await updatePromoCode(promoCodeData.id, payload, token);
      } else {
        // Create new promo code
        response = await createPromoCode(payload, token);
      }

      if (response?.data?.success) {
        toast.success(
          promoCodeData?.id
            ? "Promo code updated successfully!"
            : "Promo code created successfully!"
        );
        onClose(true); // Close the form and trigger a refresh
      } else {
        toast.error(response?.data?.message || "Failed to save promo code");
      }
    } catch (error) {
      console.error("Error saving promo code:", error);
      console.error("Error details:", error.response?.data || error.message);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while saving the promo code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="promo-code-form-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BoxComponent
        width="60%"
        maxHeight="90vh"
        overflow="auto"
        margin="auto"
        padding="30px 15px"
        borderRadius="10px"
        gap="20px"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        backgroundColor="var(--white)"
        boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
      >
        {loading ? (
          <TypographyComponent>Loading...</TypographyComponent>
        ) : (
          <>
            <BoxComponent width="100%" display="flex" flexDirection="column">
              <BoxComponent
                display="flex"
                justifyContent="flex-end"
                width="100%"
                sx={{ cursor: "pointer" }}
              >
                <CancelIcon onClick={() => onClose(false)} fontSize="large" />
              </BoxComponent>

              <TypographyComponent
                fontSize="28px"
                color="var(--dull)"
                fontFamily="var(--main)"
                fontWeight="600"
                marginBottom="20px"
                textAlign="center"
                width="100%"
              >
                {promoCodeData?.id ? "Edit Promo Code" : "Add New Promo Code"}
              </TypographyComponent>
            </BoxComponent>

            <BoxComponent width="90%">
              <InputComponent
                variant="outlined"
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </BoxComponent>

            <BoxComponent width="90%">
              <InputComponent
                variant="outlined"
                label="Promo Code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
              />
            </BoxComponent>

            <BoxComponent width="90%">
              <Dropdown
                label="Type"
                value={formData.type}
                onChange={(value) => handleChange("type", value)}
                menuItems={[
                  { label: "Fixed Amount", value: "fixed" },
                  { label: "Percentage", value: "percentage" },
                ]}
              />
            </BoxComponent>

            <BoxComponent width="90%">
              <InputComponent
                variant="outlined"
                label={formData.type === "fixed" ? "Value ($)" : "Value (%)"}
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
              />
            </BoxComponent>

            {formData.type === "percentage" && (
              <BoxComponent width="90%">
                <InputComponent
                  variant="outlined"
                  label="Maximum Discount ($)"
                  value={formData.maximumDiscount}
                  onChange={(e) =>
                    handleChange("maximumDiscount", e.target.value)
                  }
                />
              </BoxComponent>
            )}

            <BoxComponent width="90%">
              <InputComponent
                variant="outlined"
                label="Minimum Order Amount ($)"
                value={formData.minimumAmount}
                onChange={(e) => handleChange("minimumAmount", e.target.value)}
              />
            </BoxComponent>

            <BoxComponent
              width="90%"
              display="flex"
              justifyContent="space-between"
              gap="20px"
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newValue) => handleChange("startDate", newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(newValue) => handleChange("endDate", newValue)}
                  minDate={formData.startDate}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </BoxComponent>

            <BoxComponent width="90%">
              <Autocomplete
                multiple
                id="vehicle-categories-select"
                options={vehicleCategories}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => {
                  // Handle both object and string ID comparisons
                  if (typeof value === 'object' && value !== null) {
                    return option.id === value.id;
                  }
                  return option.id === value;
                }}
                value={vehicleCategories.filter((cat) => {
                  // Handle the case where vehicleCategoryIds contains the actual ID strings
                  return formData.vehicleCategoryIds.includes(cat.id);
                })}
                onChange={(_, newValue) => {
                  // Store only the ID strings, not the full objects
                  handleChange(
                    "vehicleCategoryIds",
                    newValue.map((item) => item.id)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Vehicle Categories"
                    placeholder="Select vehicle categories"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </BoxComponent>

            <BoxComponent width="90%">
              <Autocomplete
                multiple
                id="locations-select"
                options={locations}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => {
                  // Handle both object and string ID comparisons
                  if (typeof value === 'object' && value !== null) {
                    return option.id === value.id;
                  }
                  return option.id === value;
                }}
                value={locations.filter((loc) => {
                  // Handle the case where geoLocationIds contains the actual ID strings
                  return formData.geoLocationIds.includes(loc.id);
                })}
                onChange={(_, newValue) => {
                  // Store only the ID strings, not the full objects
                  handleChange(
                    "geoLocationIds",
                    newValue.map((item) => item.id)
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Locations"
                    placeholder="Select locations"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            </BoxComponent>

            <BoxComponent
              width="90%"
              display="flex"
              justifyContent="flex-start"
              padding="10px 0"
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    color="primary"
                  />
                }
                label="Active"
              />
            </BoxComponent>

            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{
                width: "90%",
                padding: "10px",
                marginTop: "10px",
              }}
              onClick={handleSubmit}
            >
              {promoCodeData?.id ? "Update Promo Code" : "Add Promo Code"}
            </ButtonComponent>
          </>
        )}
      </BoxComponent>
    </Modal>
  );
}
