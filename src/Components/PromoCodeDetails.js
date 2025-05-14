import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import DetailComponent from "./DetailComponent";
import ButtonComponent from "./Button";
import Cookies from "js-cookie";
import { getPromoCodeDetails } from "../api/constants";
import { toast } from "react-toastify";

const PromoCodeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCodeData, setPromoCodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const promoCodeId = queryParams.get("id");

  useEffect(() => {
    const fetchPromoCodeDetails = async () => {
      if (!promoCodeId) {
        toast.error("Promo Code ID is missing");
        navigate("/promo-codes");
        return;
      }

      setLoading(true);
      try {
        const token = Cookies.get("token");
        const response = await getPromoCodeDetails(promoCodeId, token);

        if (response?.data?.success && response.data.data.promoCode) {
          setPromoCodeData(response.data.data.promoCode);
        } else {
          toast.error("Failed to fetch promo code details");
          navigate("/promocodes");
        }
      } catch (error) {
        console.error("Error fetching promo code details:", error);
        toast.error("An error occurred while fetching promo code details");
        navigate("/promocodes");
      } finally {
        setLoading(false);
      }
    };

    fetchPromoCodeDetails();
  }, [promoCodeId, navigate]);

  const handleBackClick = () => {
    navigate("/promo-codes");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <BoxComponent
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="30px"
      backgroundColor="var(--light)"
      minHeight="100vh"
      width="100%"
    >
      <BoxComponent
        display="flex"
        justifyContent="space-between"
        width="80%"
        maxWidth="1200px"
        marginBottom="20px"
      >
        <TypographyComponent
          fontSize="36px"
          color="var(--primary)"
          fontFamily="var(--main)"
          fontWeight="700"
        >
          Promo Code Details
        </TypographyComponent>
        <ButtonComponent
          onClick={handleBackClick}
          variant="contained"
          backgroundColor="var(--primary)"
          sx={{
            color: "var(--white)",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          Back to Promo Codes
        </ButtonComponent>
      </BoxComponent>

      {loading ? (
        <BoxComponent display="flex" justifyContent="center" padding="50px">
          <TypographyComponent fontSize="20px">
            Loading promo code details...
          </TypographyComponent>
        </BoxComponent>
      ) : promoCodeData ? (
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
          {/* Basic Details */}
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Basic Information
            </TypographyComponent>
            <BoxComponent
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
            >
              <DetailComponent title="Title" details={promoCodeData.title} />
              <DetailComponent title="Code" details={promoCodeData.code} />
              <DetailComponent
                title="Type"
                details={
                  <span style={{ textTransform: "capitalize" }}>
                    {promoCodeData.type}
                  </span>
                }
              />
              <DetailComponent
                title="Value"
                details={
                  promoCodeData.type === "percentage"
                    ? `${promoCodeData.value}%`
                    : `$${promoCodeData.value}`
                }
              />
              <DetailComponent
                title="Minimum Amount"
                details={`$${promoCodeData.minimumAmount}`}
              />
              {promoCodeData.type === "percentage" &&
                promoCodeData.maximumDiscount > 0 && (
                  <DetailComponent
                    title="Maximum Discount"
                    details={`$${promoCodeData.maximumDiscount}`}
                  />
                )}
              <DetailComponent
                title="Status"
                details={promoCodeData.isActive ? "Active" : "Inactive"}
              />
              <DetailComponent
                title="Validity Period"
                details={`${formatDate(promoCodeData.startDate)} - ${formatDate(
                  promoCodeData.endDate
                )}`}
              />
              <DetailComponent title="ID" details={promoCodeData._id} />
            </BoxComponent>
          </BoxComponent>

          {/* Vehicle Categories */}
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Valid Vehicle Categories
            </TypographyComponent>
            <BoxComponent
              display="flex"
              flexDirection="column"
              gap="10px"
              padding="10px"
              borderRadius="5px"
              border="1px solid var(--light-gray)"
            >
              {promoCodeData.vehicleCategoryIds &&
              promoCodeData.vehicleCategoryIds.length > 0 ? (
                promoCodeData.vehicleCategoryIds.map((category) => (
                  <BoxComponent
                    key={category._id}
                    padding="10px"
                    borderRadius="5px"
                    backgroundColor="var(--light)"
                  >
                    <TypographyComponent fontSize="16px">
                      {category.name}
                    </TypographyComponent>
                  </BoxComponent>
                ))
              ) : (
                <TypographyComponent fontSize="16px">
                  No vehicle categories assigned
                </TypographyComponent>
              )}
            </BoxComponent>
          </BoxComponent>

          {/* Geo Locations */}
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Valid Locations
            </TypographyComponent>
            <BoxComponent
              display="flex"
              flexDirection="column"
              gap="10px"
              padding="10px"
              borderRadius="5px"
              border="1px solid var(--light-gray)"
            >
              {promoCodeData.geoLocationIds &&
              promoCodeData.geoLocationIds.length > 0 ? (
                promoCodeData.geoLocationIds.map((location) => (
                  <BoxComponent
                    key={location._id}
                    padding="10px"
                    borderRadius="5px"
                    backgroundColor="var(--light)"
                  >
                    <TypographyComponent fontSize="16px">
                      {location.name}
                    </TypographyComponent>
                  </BoxComponent>
                ))
              ) : (
                <TypographyComponent fontSize="16px">
                  No locations assigned
                </TypographyComponent>
              )}
            </BoxComponent>
          </BoxComponent>
        </BoxComponent>
      ) : (
        <BoxComponent display="flex" justifyContent="center" padding="50px">
          <TypographyComponent fontSize="20px">
            No promo code data found
          </TypographyComponent>
        </BoxComponent>
      )}
    </BoxComponent>
  );
};

export default PromoCodeDetails;
