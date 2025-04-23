import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify"; // Correct import for toast

export const getHeader = (serverSideToken = null) => {
  const clientApiKey = process.env.REACT_APP_API_URL;
  const userData = localStorage.getItem("token") || serverSideToken;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "md-cli-app#J5keP": `${clientApiKey}`,
    "md-cli-id": "web-usr",
    "Access-Control-Allow-Origin": "*",
    Origin: window.location.origin,
  };

  console.log("userData", userData);
  if (userData) {
    headers["Authorization"] = `${userData}`;
  }

  return headers;
};

// Helper function to set headers for multipart form data
export const multiPartForm = (fileExtension) => {
  return {
    "Cache-control": "no-cache",
    "Content-Type": `image/${fileExtension}`,
    Accept: "*/*",
  };
};

// Function to handle POST requests
export const doPost = async (endPoint, body, customHeaders = {}) => {
  try {
    const result = await axios.post(endPoint, body, {
      headers: { ...getHeader(), ...customHeaders }, // Merge custom headers with default ones
    });
    return result;
  } catch (e) {
    const status = e?.response?.status;
    if (status === 401) {
      handleUnauthorized(); // Refactored into a function to avoid repetition
    }
    if (status === 403) {
      toast.error("Not Authorized");
    }
    return e.response;
  }
};

// Function to handle GET requests
export const doGet = async (endPoint, serverSideToken = null) => {
  console.log("Server side token", serverSideToken);
  try {
    const result = await axios.get(endPoint, {
      headers: getHeader(serverSideToken),
    });
    return result;
  } catch (e) {
    const status = e?.response?.status;
    if (status === 401) {
      handleUnauthorized();
    }
    if (status === 403) {
      toast.error("Not Authorized");
    }
    return e.response;
  }
};

// Function to handle PATCH requests
export const doPatch = async (endPoint, body, customHeaders = {}) => {
  try {
    const result = await axios.patch(endPoint, body, {
      headers: { ...getHeader(), ...customHeaders },
    });
    return result;
  } catch (e) {
    const status = e?.response?.status;
    if (status === 401) {
      handleUnauthorized();
    }
    if (status === 403) {
      toast.error("Not Authorized");
    }
    return e.response;
  }
};

// Function to handle PUT requests
export const doPut = async (endPoint, body, customHeaders) => {
  try {
    const result = await axios.put(endPoint, body, {
      headers: { ...getHeader(), ...customHeaders },
    });
    return result;
  } catch (e) {
    const status = e?.response?.status;
    if (status === 401) {
      handleUnauthorized();
    }
    if (status === 403) {
      toast.error("Not Authorized");
    }
    return e.response;
  }
};

// Function to handle 401 Unauthorized - Clear cookies and reload the page if needed
const handleUnauthorized = () => {
  Cookies.remove("token");
  Cookies.remove("arolux_refresh");
  Cookies.remove("name");
  toast.error("Session expired. Please log in again.");
  // window.location.reload();
};
