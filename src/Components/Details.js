import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import DetailComponent from "./DetailComponent";
import ButtonComponent from "./Button";
import { getCustomerDetails, updateCustomerStatus } from "../api/constants";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function Details() {
  const location = useLocation();
  const initialData = location.state || {};
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (initialData.id) {
        setLoading(true);
        try {
          const token = Cookies.get("token");
          const response = await getCustomerDetails(initialData.id, token);
          if (response?.data?.success) {
            const details = response.data.data;
            setData({
              ...details,
              id: details._id,
              createdAt: new Date(details.createdAt).toLocaleString(),
              updatedAt: new Date(details.updatedAt).toLocaleString(),
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

    fetchDetails();
  }, [initialData.id]);

  const handleStatusChange = async () => {
    try {
      const token = Cookies.get("token");
      const newStatus = data.status === "active" ? "blocked" : "active";

      const response = await updateCustomerStatus(data.id, newStatus, token);

      if (response?.data?.success) {
        setData((prev) => ({
          ...prev,
          status: newStatus,
        }));
        toast.success(
          `Customer ${
            newStatus === "active" ? "activated" : "blocked"
          } successfully`
        );
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast.error("Error updating customer status");
    }
  };

  const formatKey = (key) => {
    return key
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const shouldDisplayField = (key, value) => {
    const excludedFields = ["__v", "_id"];
    return (
      !excludedFields.includes(key) &&
      value !== undefined &&
      value !== null &&
      typeof value !== "object"
    );
  };

  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="30px"
      backgroundColor="var(--light)"
      minHeight="100vh"
    >
      <TypographyComponent
        fontSize="36px"
        color="var(--primary)"
        fontFamily="var(--main)"
        fontWeight="700"
        marginBottom="30px"
        textAlign="center"
      >
        Customer Details
      </TypographyComponent>

      {loading ? (
        <TypographyComponent>Loading...</TypographyComponent>
      ) : (
        <BoxComponent
          width="80%"
          maxWidth="1200px"
          backgroundColor="var(--white)"
          borderRadius="10px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
          display="flex"
          flexDirection="column"
          padding="20px"
          gap="20px"
        >
          <BoxComponent
            display="flex"
            justifyContent="flex-end"
            width="100%"
            marginBottom="20px"
          >
            <ButtonComponent
              onClick={handleStatusChange}
              variant="contained"
              backgroundColor={
                data.status === "active" ? "var(--error)" : "var(--success)"
              }
              sx={{
                color: "var(--white)",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              {data.status === "active"
                ? "Block Customer"
                : "Activate Customer"}
            </ButtonComponent>
          </BoxComponent>

          <BoxComponent
            width="100%"
            display="flex"
            flexDirection="column"
            gap="20px"
          >
            {data.profileImageURL && (
              <BoxComponent
                display="flex"
                justifyContent="center"
                marginBottom="20px"
              >
                <img
                  src={data.profileImageURL}
                  alt="Profile"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </BoxComponent>
            )}

            <BoxComponent
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
            >
              {Object.entries(data).map(([key, value]) =>
                shouldDisplayField(key, value) ? (
                  <DetailComponent
                    key={key}
                    title={formatKey(key)}
                    details={value.toString()}
                  />
                ) : null
              )}
            </BoxComponent>
          </BoxComponent>
        </BoxComponent>
      )}
    </BoxComponent>
  );
}
