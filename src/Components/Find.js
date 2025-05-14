import React from "react";
import BoxComponent from "./Box";
import Searchbox from "./Searchbox";
import Dropdown from "./Dropdown";

export default function Find({
  placeholder,
  label,
  status,
  onSearch,
  onStatusChange,
}) {
  // Create the menu items array for the dropdown
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <BoxComponent
      display="flex"
      justifyContent="space-between"
      width="50%"
      margin="20px 0px"
    >
      <Searchbox
        placeholder={placeholder}
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <BoxComponent marginLeft="10px">
        <Dropdown
          label={label}
          menuItems={statusOptions}
          value={status}
          onChange={(value) => onStatusChange && onStatusChange(value)}
        />
      </BoxComponent>
    </BoxComponent>
  );
}
