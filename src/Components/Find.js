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
          menuItems={status}
          onChange={(value) => onStatusChange && onStatusChange(value)}
        />
      </BoxComponent>
    </BoxComponent>
  );
}
