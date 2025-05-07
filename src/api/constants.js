// Integrate the login and account methods
import { doPut, doGet, doPost, doPatch, getHeader } from "./api";
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
