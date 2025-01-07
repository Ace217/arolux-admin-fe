import React from "react";
import { useNavigate } from "react-router-dom";

import BoxComponent from "./Box";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Head() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from localStorage/sessionStorage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token'); // if you're using sessionStorage

    // Redirect to login page
    navigate('/'); // Requires useNavigate from react-router-dom
};
  return (
    <BoxComponent
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding="15px"
      backgroundColor="var(--primary)"
    >
      <BoxComponent width="170px" height="5vh">
        <img
          style={{
            width: "100%",
            height: "100%",
          }}
          src="Images/logo2.png"
          alt=""
        />
      </BoxComponent>
      <BoxComponent
        border="1px solid var(--light)"
        borderRadius="7px"
        width="50px"
        height="25px"
        padding="2px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          "&:hover": { backgroundColor: "var(--dark)", cursor: "pointer" },
        }}
        onClick={handleLogout} // Add onClick handler
      >
        <LogoutIcon fontSize="medium" sx={{ color: "var(--light)" }} />
      </BoxComponent>
    </BoxComponent>
  );
}
