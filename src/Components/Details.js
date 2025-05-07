import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import DetailComponent from "./DetailComponent";
import ButtonComponent from "./Button";
import {
  getCustomerDetails,
  updateCustomerStatus,
  getDriverDetails,
  getRideBookingDetails,
} from "../api/constants";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import MapComponent from "./MapComponent";

export default function Details() {
  const location = useLocation();
  const initialData = location.state || {};
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [isDriver] = useState(!!initialData.driverProfile);
  const [isRideBooking] = useState(!!initialData.randomBookingId);

  useEffect(() => {
    const fetchDetails = async () => {
      if ((initialData.id || initialData._id) && (isDriver || isRideBooking)) {
        setLoading(true);
        try {
          const token = Cookies.get("token");
          let response;

          if (isDriver) {
            response = await getDriverDetails(initialData.id, token);
            if (response?.data?.success) {
              const driverDetails = response.data.data.driver[0];
              setData({
                ...driverDetails,
                id: driverDetails._id,
                createdAt: new Date(driverDetails.createdAt).toLocaleString(),
              });
            }
          } else if (isRideBooking) {
            response = await getRideBookingDetails(initialData._id, token);
            if (response?.data?.success) {
              const details = response.data.data.rideBooking;
              setData(details);
            } else {
              toast.error(response?.data?.message || "Failed to fetch ride details");
            }
          } else {
            response = await getCustomerDetails(initialData.id, token);
            if (response?.data?.success) {
              const details = response.data.data;
              setData({
                ...details,
                id: details._id,
                createdAt: new Date(details.createdAt).toLocaleString(),
                updatedAt: new Date(details.updatedAt).toLocaleString(),
              });
            }
          }
        } catch (error) {
          console.error("Error fetching details:", error);
          toast.error("Error fetching details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [initialData.id, initialData._id, isDriver, isRideBooking]);

  const handleStatusChange = async () => {
    try {
      const token = Cookies.get("token");
      const newStatus = data.status === "active" ? "blocked" : "active";
      const response = await updateCustomerStatus(data.id, newStatus, token);

      if (response?.data?.success) {
        setData((prev) => ({ ...prev, status: newStatus }));
        toast.success(
          `Customer ${
            newStatus === "active" ? "activated" : "blocked"
          } successfully`
        );
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const shouldDisplayField = (key, value) => {
    const excludedFields = [
      "__v",
      "_id",
      "id",
      "driverProfile",
      "vehicleDetails",
      "drivingLicense",
      "bankAccount",
    ];
    return (
      !excludedFields.includes(key) &&
      value !== undefined &&
      value !== null &&
      typeof value !== "object"
    );
  };

  const renderDriverSpecificDetails = () => {
    if (!isDriver || !data.driverProfile) return null;

    const { driverProfile, vehicleDetails, drivingLicense, bankAccount } = data;

    return (
      <>
        {/* Profile Details */}
        <BoxComponent width="100%" marginBottom="20px">
          <TypographyComponent
            fontSize="24px"
            color="var(--primary)"
            fontWeight="600"
            marginBottom="15px"
          >
            Profile Details
          </TypographyComponent>
          <BoxComponent display="grid" gridTemplateColumns="1fr 1fr" gap="20px">
            <DetailComponent
              title="First Name"
              details={driverProfile.firstName}
            />
            <DetailComponent
              title="Last Name"
              details={driverProfile.lastName}
            />
            <DetailComponent title="Email" details={driverProfile.email} />
            <DetailComponent title="Gender" details={driverProfile.gender} />
            <DetailComponent
              title="Date of Birth"
              details={new Date(driverProfile.dateOfBirth).toLocaleDateString()}
            />
            <DetailComponent title="Address" details={driverProfile.address} />
            <DetailComponent title="City" details={driverProfile.city} />
            <DetailComponent
              title="Postal Code"
              details={driverProfile.postalCode}
            />
            <DetailComponent
              title="Partner Type"
              details={driverProfile.partnerType}
            />
            <DetailComponent
              title="Tax File Number"
              details={driverProfile.taxFileNumber}
            />
            <DetailComponent title="Status" details={driverProfile.status} />
            <DetailComponent
              title="Online Status"
              details={driverProfile.isOnline ? "Online" : "Offline"}
            />
            <DetailComponent
              title="Admin Approval Status"
              details={driverProfile.adminApprovalStatus}
            />
            <DetailComponent
              title="Admin Approval Time"
              details={new Date(
                driverProfile.adminApprovalTime
              ).toLocaleString()}
            />
          </BoxComponent>
        </BoxComponent>

        {/* Vehicle Details */}
        {vehicleDetails && (
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Vehicle Details
            </TypographyComponent>
            <BoxComponent
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
            >
              <DetailComponent title="Make" details={vehicleDetails.make} />
              <DetailComponent title="Model" details={vehicleDetails.model} />
              <DetailComponent title="Year" details={vehicleDetails.year} />
              <DetailComponent title="Color" details={vehicleDetails.color} />
              <DetailComponent
                title="Plate Number"
                details={vehicleDetails.plateNumber}
              />
            </BoxComponent>
          </BoxComponent>
        )}

        {/* Bank Account Details */}
        {bankAccount && (
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Bank Account Details
            </TypographyComponent>
            <BoxComponent
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
            >
              <DetailComponent
                title="Account Number"
                details={bankAccount.accountNumber}
              />
              <DetailComponent
                title="Swift Code"
                details={bankAccount.swiftCode}
              />
            </BoxComponent>
          </BoxComponent>
        )}

        {/* Documents */}
        {(drivingLicense || vehicleDetails) && (
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Documents
            </TypographyComponent>
            <BoxComponent
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
            >
              {drivingLicense && (
                <>
                  <BoxComponent>
                    <TypographyComponent marginBottom="10px">
                      Driving License Front
                    </TypographyComponent>
                    <img
                      src={drivingLicense.frontSide}
                      alt="License Front"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        borderRadius: "8px",
                      }}
                    />
                  </BoxComponent>
                  <BoxComponent>
                    <TypographyComponent marginBottom="10px">
                      Driving License Back
                    </TypographyComponent>
                    <img
                      src={drivingLicense.backSide}
                      alt="License Back"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        borderRadius: "8px",
                      }}
                    />
                  </BoxComponent>
                </>
              )}
              {vehicleDetails && (
                <>
                  <BoxComponent>
                    <TypographyComponent marginBottom="10px">
                      Vehicle Inspection Front
                    </TypographyComponent>
                    <img
                      src={vehicleDetails.inspectionFrontSide}
                      alt="Inspection Front"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        borderRadius: "8px",
                      }}
                    />
                  </BoxComponent>
                  <BoxComponent>
                    <TypographyComponent marginBottom="10px">
                      Vehicle Inspection Back
                    </TypographyComponent>
                    <img
                      src={vehicleDetails.inspectionBackSide}
                      alt="Inspection Back"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        borderRadius: "8px",
                      }}
                    />
                  </BoxComponent>
                  {vehicleDetails.registrationFrontSide && (
                    <BoxComponent>
                      <TypographyComponent marginBottom="10px">
                        Vehicle Registration
                      </TypographyComponent>
                      <img
                        src={vehicleDetails.registrationFrontSide}
                        alt="Registration"
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          borderRadius: "8px",
                        }}
                      />
                    </BoxComponent>
                  )}
                </>
              )}
            </BoxComponent>
          </BoxComponent>
        )}
      </>
    );
  };

  const renderRideBookingDetails = () => {
    if (!isRideBooking) return null;

    const { pricingBreakdown = {}, distanceDetails = {} } = data || {};

    return (
      <>
        {/* Pricing Breakdown */}
        <BoxComponent width="100%" marginBottom="20px">
          <TypographyComponent
            fontSize="24px"
            color="var(--primary)"
            fontWeight="600"
            marginBottom="15px"
          >
            Pricing Breakdown
          </TypographyComponent>
          <BoxComponent display="grid" gridTemplateColumns="1fr 1fr" gap="20px">
            <DetailComponent
              title="Base Fare"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.baseFare || 0}`}
            />
            <DetailComponent
              title="Distance Charges"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.distanceCharges || 0}`}
            />
            <DetailComponent
              title="Time Charges"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.timeCharges || 0}`}
            />
            <DetailComponent
              title="Minimum Fare"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.minimumFare || 0}`}
            />
            <DetailComponent
              title="Toll Charges"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.tollCharges || 0}`}
            />
            <DetailComponent
              title="Suited Charges"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.suitedCharges || 0}`}
            />
            <DetailComponent
              title="Surcharges"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.estimatedSurcharges || 0}`}
            />
            <DetailComponent
              title="Promo Discount"
              details={`${data?.currencySymbol || '$'}${pricingBreakdown?.promoDiscount || 0}`}
            />
            <DetailComponent
              title="Total Fare"
              details={`${data?.currencySymbol || '$'}${data?.totalFare || 0}`}
            />
          </BoxComponent>
        </BoxComponent>

        {/* Distance Details */}
        <BoxComponent width="100%" marginBottom="20px">
          <TypographyComponent
            fontSize="24px"
            color="var(--primary)"
            fontWeight="600"
            marginBottom="15px"
          >
            Ride Details
          </TypographyComponent>
          <BoxComponent display="grid" gridTemplateColumns="1fr 1fr" gap="20px">
            <DetailComponent
              title="Distance"
              details={`${((distanceDetails?.distance || 0) / 1000).toFixed(2)} km`}
            />
            <DetailComponent
              title="Duration"
              details={`${Math.round((distanceDetails?.duration || 0) / 60)} mins`}
            />
            <DetailComponent
              title="Booking Type"
              details={data?.bookingType ? data.bookingType.charAt(0).toUpperCase() + data.bookingType.slice(1) : 'N/A'}
            />
            <DetailComponent
              title="Scheduled Time"
              details={data?.scheduledTime ? formatDateTime(data.scheduledTime) : 'N/A'}
            />
            <DetailComponent
              title="Vehicle Category"
              details={data?.vehicleCategoryId?.name || 'N/A'}
            />
            <DetailComponent
              title="Customer"
              details={data?.userName || 'N/A'}
            />
            <DetailComponent
              title="Pickup Location"
              details={data?.pickTitle || 'N/A'}
            />
            <DetailComponent
              title="Drop-off Location"
              details={data?.dropTitle || 'N/A'}
            />
          </BoxComponent>
        </BoxComponent>

        {/* Map */}
        {data?.pickupLatitude && data?.pickupLongitude && data?.dropOffLatitude && data?.dropOffLongitude && (
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Route Map
            </TypographyComponent>
            <BoxComponent height="400px">
              <MapComponent
                center={[data.pickupLatitude, data.pickupLongitude]}
                zoom={13}
                isDrawingAllowed={false}
                markers={[
                  {
                    position: [data.pickupLatitude, data.pickupLongitude],
                    title: "Pickup",
                    type: "pickup"
                  },
                  {
                    position: [data.dropOffLatitude, data.dropOffLongitude],
                    title: "Drop-off",
                    type: "dropoff"
                  }
                ]}
                polyline={distanceDetails?.polyline}
              />
            </BoxComponent>
          </BoxComponent>
        )}

        {/* Payment Details */}
        {data?.cardDetails && (
          <BoxComponent width="100%" marginBottom="20px">
            <TypographyComponent
              fontSize="24px"
              color="var(--primary)"
              fontWeight="600"
              marginBottom="15px"
            >
              Payment Details
            </TypographyComponent>
            <BoxComponent display="grid" gridTemplateColumns="1fr 1fr" gap="20px">
              <DetailComponent
                title="Card Holder"
                details={data.cardDetails?.name || 'N/A'}
              />
              <DetailComponent
                title="Card Number"
                details={data.cardDetails?.cardNumber || 'N/A'}
              />
              <DetailComponent
                title="Expiry"
                details={data.cardDetails?.expiryMonth && data.cardDetails?.expiryYear ? 
                  `${data.cardDetails.expiryMonth}/${data.cardDetails.expiryYear}` : 'N/A'}
              />
            </BoxComponent>
          </BoxComponent>
        )}
      </>
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
        {isDriver ? "Driver Details" : isRideBooking ? "Ride Booking Details" : "Customer Details"}
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
          {!isDriver && !isRideBooking && (
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
          )}

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

            {/* Basic Details */}
            <BoxComponent
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="20px"
              marginBottom="20px"
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

            {/* Driver Specific Details */}
            {renderDriverSpecificDetails()}

            {/* Ride Booking Details */}
            {renderRideBookingDetails()}
          </BoxComponent>
        </BoxComponent>
      )}
    </BoxComponent>
  );
}
