// Integrate the login and account methods
import {doPut, doGet, doPost, getHeader} from './api'
import { 
    LOGIN, 
    ACCOUNT,
    ACCOUNTS,
    UPDATE,
    PASSWORD,
} from "./endpoints"; // Import the endpoints

const API_URL = process.env.REACT_APP_API_URL;
const API_VERSION = process.env.REACT_APP_API_VERSION;


export const login = (body) => {
    return doPost(`${API_URL}${API_VERSION}${LOGIN}`, body); // Pass the object as body
  };
  
  export const account = (requestData, token) => {
    return doPost(`${API_URL}${API_VERSION}${ACCOUNT}`, requestData, getHeader(token)); 
};
export const accounts = (token) => {
  return doGet(`${API_URL}${API_VERSION}${ACCOUNTS}`, token);
};
  export const update = ( requestData, token) => {
    return doPut(`${API_URL}${API_VERSION}${UPDATE}`,  requestData, getHeader(token)); 
}; 
  export const updatePassword  = (requestData, token) => {
    return doPut(`${API_URL}${API_VERSION}${PASSWORD}`,requestData, getHeader(token)); 
};

  