import React from "react";
import MenuOption from "./MenuOption";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import EmojiTransportationOutlinedIcon from '@mui/icons-material/EmojiTransportationOutlined';
import CommuteOutlinedIcon from '@mui/icons-material/CommuteOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import BoxComponent from "./Box";
import TypographyComponent from "./Typography";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };
  const handleRides = () => {
    navigate("/rides");
  };
  const handleDrivers = () => {
    navigate("/drivers");
  };
  const handleCustomers = () => {
    navigate("/customers");
  };
  const handleCategory = () => {
    navigate("/vehicle-categories");
  };
  const handleConfig = () => {
    navigate("/configurations");
  };
  const handleLocation = () => {
    navigate("/locations");
  };
  const handleAdmin = () => {
    navigate("/admin");
  };

  // Check the current path
  const isActive = (path) => location.pathname === path;

  return (
    <BoxComponent
      width="15%"
      height="90vh"
      // padding='10px'
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      backgroundColor="var(--dark)"
    >
      <BoxComponent
      display='flex'
      flexDirection="column"
      gap='3px'
      >
        <MenuOption
          onClick={handleDashboard}
          icon={DashboardOutlinedIcon}
          label="Dashboard"
          active={isActive("/dashboard")} // Pass the active state
        />
        <MenuOption
          onClick={handleRides}
          icon={EmojiTransportationOutlinedIcon}
          label="Rides"
          active={isActive("/rides")} // Pass the active state
        />
        <MenuOption
          onClick={handleDrivers}
          icon={GroupOutlinedIcon}
          label="Drivers"
          active={isActive("/drivers")} // Pass the active state
        />
        <MenuOption
          onClick={handleCustomers}
          icon={Diversity1OutlinedIcon}
          label="Customers"
          active={isActive("/customers")} // Pass the active state
        />
        <MenuOption
          onClick={handleCategory}
          icon={CommuteOutlinedIcon }
          label="Vehicles"
          active={isActive("/vehicle-categories")} // Pass the active state
        />
        <MenuOption
          onClick={handleConfig}
          icon={SettingsSuggestOutlinedIcon}
          label="Configurations"
          active={isActive("/configurations")} // Pass the active state
        />
        <MenuOption
          onClick={handleLocation}
          icon={PinDropOutlinedIcon}
          label="Locations"
          active={isActive("/locations")} // Pass the active state
        />
        <MenuOption
          onClick={handleAdmin}
          icon={AdminPanelSettingsOutlinedIcon}
          label="Admin Roles"
          active={isActive("/admin")} // Pass the active state
        />
      </BoxComponent>
      <BoxComponent
        display="flex"
        alignItems="center"
        justifyContent="left"
        height="6vh"
        padding="5px 10px"
        sx={{ "&:hover": {
            cursor: "pointer",
            color: 'var(--white)',
            backgroundColor:"var(--primary)" 
          }}}
        onClick={handleLogout}
      >
        <LogoutIcon sx={{color:"var(--white)"}}/>
        <TypographyComponent marginLeft="15px" color="var(--white)">
          Logout
        </TypographyComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
