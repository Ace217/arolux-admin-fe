import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import { getConfigurations, updateConfigurations } from "../api/constants";
import Cookies from "js-cookie";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import InputComponent from "../Components/InputComponent";
import ButtonComponent from "../Components/Button";
import { toast } from "react-toastify";

export default function Configurations() {
  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await getConfigurations(token);

      if (response.data && response.data.success) {
        const configs = response.data.data.configurations;
        setConfigData(configs);
        setEditedValues(configs);
      } else {
        toast.error("Failed to fetch configurations");
      }
    } catch (error) {
      console.error("Error fetching configurations:", error);
      toast.error("Error fetching configurations");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedValues({
      ...editedValues,
      [field]: value,
    });
  };

  const handleSave = async () => {
    try {
      setUpdating(true);

      // Prepare the request body according to the API specification
      const requestBody = {
        bookingOfferDriverMaxRadiusInMeters: parseInt(
          editedValues.bookingOfferDriverMaxRadiusInMeters
        ),
        supportEmail: editedValues.supportEmail,
      };

      const token = Cookies.get("token");
      const response = await updateConfigurations(requestBody, token);

      if (response.data && response.data.success) {
        toast.success("Configurations updated successfully");
        setIsEditing(false);
        // Refresh the configuration data to show the updated values
        await fetchConfigurations();
      } else {
        toast.error(
          response.data?.message || "Failed to update configurations"
        );
      }
    } catch (error) {
      console.error("Error updating configurations:", error);
      toast.error("Error updating configurations");
    } finally {
      setUpdating(false);
    }
  };

  const renderConfigItem = (label, key, type = "text") => {
    return (
      <BoxComponent
        display="flex"
        flexDirection="column"
        marginBottom="20px"
        width="100%"
        backgroundColor="white"
        padding="20px"
        borderRadius="8px"
        boxShadow="0 2px 5px rgba(0,0,0,0.1)"
      >
        <TypographyComponent
          fontSize="16px"
          fontFamily="var(--main)"
          color="var(--dark)"
          fontWeight="500"
          marginBottom="10px"
        >
          {label}
        </TypographyComponent>
        {isEditing ? (
          <InputComponent
            type={type}
            name={key}
            value={editedValues[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
            }}
          />
        ) : (
          <TypographyComponent
            fontSize="16px"
            fontFamily="var(--main)"
            color="var(--dark)"
            fontWeight="400"
          >
            {configData && configData[key]}
          </TypographyComponent>
        )}
      </BoxComponent>
    );
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
            alignItems="center"
            marginBottom="20px"
          >
            <TypographyComponent
              fontSize="24px"
              fontFamily="var(--main)"
              color="var(--dark)"
              fontWeight="600"
            >
              CONFIGURATIONS
            </TypographyComponent>
            <ButtonComponent
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={updating}
              style={{
                backgroundColor: isEditing ? "var(--green)" : "var(--blue)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                opacity: updating ? "0.7" : "1",
                cursor: updating ? "not-allowed" : "pointer",
              }}
            >
              {updating ? (
                "Saving..."
              ) : isEditing ? (
                "Save Changes"
              ) : (
                <>
                  <ModeEditOutlineOutlinedIcon style={{ fontSize: 18 }} />
                  Edit Configurations
                </>
              )}
            </ButtonComponent>
          </BoxComponent>

          {loading ? (
            <BoxComponent display="flex" justifyContent="center" padding="30px">
              <TypographyComponent>
                Loading configurations...
              </TypographyComponent>
            </BoxComponent>
          ) : configData ? (
            <BoxComponent display="flex" flexDirection="column" width="100%">
              {renderConfigItem("Support Email", "supportEmail", "email")}
              {renderConfigItem(
                "Booking Offer Driver Max Radius (meters)",
                "bookingOfferDriverMaxRadiusInMeters",
                "number"
              )}
            </BoxComponent>
          ) : (
            <BoxComponent display="flex" justifyContent="center" padding="30px">
              <TypographyComponent>
                No configuration data available
              </TypographyComponent>
            </BoxComponent>
          )}
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
