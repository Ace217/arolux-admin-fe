import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";

export default function Table({
  rows, // The data to be displayed
  headings, // Column headers and definitions
  icons, // Icons for edit, details, etc.
  onStatusChange,
  onDetailClick, // Function to handle status changes
}) {
  // Create columns based on the headings prop
  const columns = headings.map((heading) => ({
    field: heading.field,
    headerName: heading.headerName,
    width: heading.width || 150,
    sortable: heading.sortable || false,
    renderCell: heading.renderCell || undefined,
    headerClassName: "center-header", // Add class for header styling
    cellClassName: "center-cell", // Add class for cell styling
  }));

  // Add edit, details, and key columns with icons
  columns.push({
    field: "Edit",
    headerName: "",
    width: 50,
    renderCell: () => (
      <IconButton aria-label="edit" sx={{ color: "var(--primary)" }}>
        {icons.edit}
      </IconButton>
    ),
    sortable: false,
  });

  columns.push({
    field: "Details",
    headerName: "",
    width: 50,
    renderCell: (params) => (
      <IconButton 
      checked={params.row.Status === "Active"}
      onClick={() => onDetailClick(params.row.categoryName)}
      aria-label="details" sx={{ color: "var(--primary)" }}>
        {icons.details}
      </IconButton>
    ),
    sortable: false,
  });

  columns.push({
    field: "Key",
    headerName: "",
    width: 50,
    renderCell: () => (
      <IconButton aria-label="key" sx={{ color: "var(--primary)" }}>
        {icons.key}
      </IconButton>
    ),
    sortable: false,
  });

  columns.push({
    field: "Actions",
    headerName: "Actions",
    width: 100,
    renderCell: (params) => (
      <Switch
        checked={params.row.Status === "Active"}
        onChange={() => onStatusChange(params.row.id)}
        style={{
          color: "var(--primary)", // Default thumb color when unchecked
        }}
      />
    ),
    sortable: false,
  });

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows} // The rows passed as a prop (filtered or unfiltered)
        columns={columns} // The columns based on headings
        initialState={{ pagination: { paginationModel } }} // Pagination model
        pageSizeOptions={[5, 10]} // Pagination size options
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .center-header": {
            justifyContent: "center", // Center the header text
            display: "flex",
          },
          "& .center-cell": {
            padding: "5px", // Apply padding to cells
          },
        }}
      />
    </Paper>
  );
}
