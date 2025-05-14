// Integrate the login and account methods
import { doPut, doGet, doPost, doPatch, doDelete, getHeader } from "./api";
import {
  LOGIN,
  ACCOUNT,
  ACCOUNTS,
  UPDATE,
  PASSWORD,
  VEHICLE_CATEGORIES,
  CREATE_VEHICLE_CATEGORY,
  UPDATE_VEHICLE_CATEGORY,
  CUSTOMERS_LIST,
  CUSTOMER_DETAILS,
  UPDATE_CUSTOMER_STATUS,
  UPDATE_CUSTOMER,
  DRIVERS_LIST,
  DRIVER_DETAILS,
  GET_FILE,
  RIDE_BOOKINGS_LIST,
  RIDE_BOOKING_DETAILS,
  CONFIGURATIONS,
  GEO_LOCATIONS_LIST,
  GEO_LOCATION_DETAILS,
  CREATE_GEO_LOCATION,
  UPDATE_GEO_LOCATION,
  VEHICLE_CATEGORY_FARES_LIST,
  VEHICLE_CATEGORY_FARE_DETAILS,
  CREATE_VEHICLE_CATEGORY_FARE,
  UPDATE_VEHICLE_CATEGORY_FARE,
  VEHICLE_CATEGORY_FARES_GEO_LOCATIONS,
  VEHICLE_CATEGORY_FARES_VEHICLE_CATEGORIES,
  PROMO_CODES_LIST,
  PROMO_CODE_DETAILS,
  CREATE_PROMO_CODE,
  UPDATE_PROMO_CODE,
  TOGGLE_PROMO_CODE_STATUS,
  DELETE_PROMO_CODE,
  LOCATIONS,
  PROMO_CODES_GEO_LOCATIONS,
  PROMO_CODES_VEHICLE_CATEGORIES,
} from "./endpoints"; // Import the endpoints

const API_URL = process.env.REACT_APP_API_URL;
const API_VERSION = process.env.REACT_APP_API_VERSION;

export const login = (body) => {
  return doPost(`${API_URL}${API_VERSION}${LOGIN}`, body); // Pass the object as body
};

export const account = (requestData, token) => {
  return doPost(
    `${API_URL}${API_VERSION}${ACCOUNT}`,
    requestData,
    getHeader(token)
  );
};
export const accounts = (token) => {
  return doGet(`${API_URL}${API_VERSION}${ACCOUNTS}`, token);
};
export const update = (requestData, token) => {
  return doPut(
    `${API_URL}${API_VERSION}${UPDATE}`,
    requestData,
    getHeader(token)
  );
};
export const updatePassword = (requestData, token) => {
  return doPut(
    `${API_URL}${API_VERSION}${PASSWORD}`,
    requestData,
    getHeader(token)
  );
};

export const getVehicleCategories = (params, token) => {
  console.log("Vehicle token", token);
  const queryString = new URLSearchParams(params).toString();
  return doGet(
    `${API_URL}${API_VERSION}${VEHICLE_CATEGORIES}?${queryString}`,
    token
  );
};

export const createVehicleCategory = (requestData, token) => {
  return doPost(
    `${API_URL}${API_VERSION}${CREATE_VEHICLE_CATEGORY}`,
    requestData,
    getHeader(token)
  );
};

export const getCustomersList = (params, token) => {
  const queryString = new URLSearchParams(params).toString();
  return doGet(
    `${API_URL}${API_VERSION}${CUSTOMERS_LIST}?${queryString}`,
    token
  );
};

export const getCustomerDetails = (userId, token) => {
  const url = `${API_URL}${API_VERSION}${CUSTOMER_DETAILS.replace(
    ":userId",
    userId
  )}`;
  return doGet(url, token);
};

export const updateCustomerStatus = (userId, status, token) => {
  const url = `${API_URL}${API_VERSION}${UPDATE_CUSTOMER_STATUS.replace(
    ":userId",
    userId
  )}`;
  return doPatch(url, { status }, getHeader(token));
};

export const updateCustomer = (userId, requestData, token) => {
  const url = `${API_URL}${API_VERSION}${UPDATE_CUSTOMER.replace(
    ":userId",
    userId
  )}`;
  return doPut(url, requestData, getHeader(token));
};

export const updateVehicleCategory = (id, requestData, token) => {
  const url = `${API_URL}${API_VERSION}${UPDATE_VEHICLE_CATEGORY}`.replace(
    ":id",
    id
  );
  return doPut(url, requestData, getHeader(token));
};

export const getFile = (fileType, mimeType, token) => {
  return doGet(
    `${API_URL}${API_VERSION}${GET_FILE}?fileType=${fileType}&mimeType=${mimeType}`,
    token
  );
};

export const getDriversList = (params, token) => {
  const queryString = new URLSearchParams(params).toString();
  return doGet(`${API_URL}${API_VERSION}${DRIVERS_LIST}?${queryString}`, token);
};

export const getDriverDetails = (driverId, token) => {
  const url = `${API_URL}${API_VERSION}${DRIVER_DETAILS.replace(
    ":driverId",
    driverId
  )}`;
  return doGet(url, token);
};

export const getRideBookingsList = (params, token) => {
  const queryString = new URLSearchParams(params).toString();
  return doGet(
    `${API_URL}${API_VERSION}${RIDE_BOOKINGS_LIST}?${queryString}`,
    token
  );
};

export const getRideBookingDetails = (bookingId, token) => {
  const url = `${API_URL}${API_VERSION}${RIDE_BOOKING_DETAILS.replace(
    ":bookingId",
    bookingId
  )}`;
  return doGet(url, token);
};

export const getConfigurations = (token) => {
  return doGet(`${API_URL}${API_VERSION}${CONFIGURATIONS}`, token);
};

export const updateConfigurations = (requestData, token) => {
  return doPut(
    `${API_URL}${API_VERSION}${CONFIGURATIONS}`,
    requestData,
    getHeader(token)
  );
};

export const getGeoLocationsList = (params, token) => {
  const queryString = new URLSearchParams(params).toString();
  return doGet(
    `${API_URL}${API_VERSION}${GEO_LOCATIONS_LIST}?${queryString}`,
    token
  );
};

export const getGeoLocationDetails = (locationId, token) => {
  const url = `${API_URL}${API_VERSION}${GEO_LOCATION_DETAILS.replace(
    ":locationId",
    locationId
  )}`;
  return doGet(url, token);
};

export const createGeoLocation = (requestData, token) => {
  return doPost(
    `${API_URL}${API_VERSION}${CREATE_GEO_LOCATION}`,
    requestData,
    getHeader(token)
  );
};

export const updateGeoLocation = (locationId, requestData, token) => {
  const url = `${API_URL}${API_VERSION}${UPDATE_GEO_LOCATION.replace(
    ":locationId",
    locationId
  )}`;
  return doPut(url, requestData, getHeader(token));
};

export const getVehicleCategoryFaresList = (params, token) => {
  const queryString = new URLSearchParams(params).toString();
  return doGet(
    `${API_URL}${API_VERSION}${VEHICLE_CATEGORY_FARES_LIST}?${queryString}`,
    token
  );
};

export const getVehicleCategoryFareDetails = (fareId, token) => {
  const url = `${API_URL}${API_VERSION}${VEHICLE_CATEGORY_FARE_DETAILS.replace(
    ":fareId",
    fareId
  )}`;
  return doGet(url, token);
};

export const createVehicleCategoryFare = (requestData, token) => {
  return doPost(
    `${API_URL}${API_VERSION}${CREATE_VEHICLE_CATEGORY_FARE}`,
    requestData,
    getHeader(token)
  );
};

export const updateVehicleCategoryFare = (fareId, requestData, token) => {
  const url = `${API_URL}${API_VERSION}${UPDATE_VEHICLE_CATEGORY_FARE.replace(
    ":fareId",
    fareId
  )}`;
  return doPut(url, requestData, getHeader(token));
};

export const getVehicleCategoryFaresGeoLocations = (token) => {
  return doGet(
    `${API_URL}${API_VERSION}${VEHICLE_CATEGORY_FARES_GEO_LOCATIONS}`,
    token
  );
};

export const getVehicleCategoryFaresVehicleCategories = (token) => {
  return doGet(
    `${API_URL}${API_VERSION}${VEHICLE_CATEGORY_FARES_VEHICLE_CATEGORIES}`,
    token
  );
};

export const getPromoCodesList = (params, token) => {
  const queryString = params ? new URLSearchParams(params).toString() : "";
  const url = queryString
    ? `${API_URL}${API_VERSION}${PROMO_CODES_LIST}?${queryString}`
    : `${API_URL}${API_VERSION}${PROMO_CODES_LIST}`;
  return doGet(url, token);
};

export const getPromoCodeDetails = (promoCodeId, token) => {
  const url = `${API_URL}${API_VERSION}${PROMO_CODE_DETAILS.replace(
    ":promoCodeId",
    promoCodeId
  )}`;
  return doGet(url, token);
};

export const createPromoCode = (requestData, token) => {
  return doPost(
    `${API_URL}${API_VERSION}${CREATE_PROMO_CODE}`,
    requestData,
    getHeader(token)
  );
};

export const updatePromoCode = (promoCodeId, requestData, token) => {
  const url = `${API_URL}${API_VERSION}${UPDATE_PROMO_CODE.replace(
    ":promoCodeId",
    promoCodeId
  )}`;
  return doPut(url, requestData, getHeader(token));
};

export const togglePromoCodeStatus = (promoCodeId, isActive, token) => {
  const url = `${API_URL}${API_VERSION}${TOGGLE_PROMO_CODE_STATUS.replace(
    ":promoCodeId",
    promoCodeId
  )}`;
  return doPatch(url, { isActive }, getHeader(token));
};

export const deletePromoCode = (promoCodeId, token) => {
  const url = `${API_URL}${API_VERSION}${DELETE_PROMO_CODE.replace(
    ":promoCodeId",
    promoCodeId
  )}`;
  return doDelete(url, getHeader(token));
};

export const getLocations = (params, token) => {
  const queryString = params ? new URLSearchParams(params).toString() : "";
  const url = queryString
    ? `${API_URL}${API_VERSION}${LOCATIONS}?${queryString}`
    : `${API_URL}${API_VERSION}${LOCATIONS}`;
  return doGet(url, token);
};

export const getPromoCodesGeoLocations = (token) => {
  return doGet(`${API_URL}${API_VERSION}${PROMO_CODES_GEO_LOCATIONS}`, token);
};

export const getPromoCodesVehicleCategories = (token) => {
  return doGet(
    `${API_URL}${API_VERSION}${PROMO_CODES_VEHICLE_CATEGORIES}`,
    token
  );
};
