import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";

export default function Table({
  rows = [], // Ensure rows default to an empty array
  headings = [], // Ensure headings default to an empty array
  icons = {}, // Ensure icons default to an empty object
  onStatusChange = () => {}, // Default to an empty function
  onDetailClick = () => {},
  getRowId = (row) => row.id, // Default getRowId to avoid errors
}) {
  // Create columns based on the headings prop
  const columns = headings
  .filter((heading) => heading.field) // Ensure only valid fields are included
  .map((heading) => ({
    field: heading.field,
    headerName: heading.headerName,
    flex: heading.flex || 1,
    sortable: heading.sortable || false,
    renderCell: heading.renderCell || undefined,
    headerClassName: "center-header",
    cellClassName: "center-cell",
  }));

  // Add edit, details, and key columns with safe checks for icons
  columns.push(
    {
      field: "Edit",
      headerName: "",
      flex: 0.5,
      renderCell: () =>
        icons.edit ? (
          <IconButton aria-label="edit" sx={{ color: "var(--primary)" }}>
            {icons.edit}
          </IconButton>
        ) : null,
      sortable: false,
    },
    {
      field: "Details",
      headerName: "",
      flex: 0.5,
      renderCell: (params) =>
        icons.details ? (
          <IconButton
            onClick={() => onDetailClick(params.row.categoryName)}
            aria-label="details"
            sx={{ color: "var(--primary)" }}
          >
            {icons.details}
          </IconButton>
        ) : null,
      sortable: false,
    },
    {
      field: "Key",
      headerName: "",
      flex: 0.5,
      renderCell: () =>
        icons.key ? (
          <IconButton aria-label="key" sx={{ color: "var(--primary)" }}>
            {icons.key}
          </IconButton>
        ) : null,
      sortable: false,
    },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.Status === "Active"}
          onChange={() => onStatusChange(params.row._id)}
          style={{ color: "var(--primary)" }}
        />
      ),
      sortable: false,
    }
  );

  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5]}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          "& .center-header": {
            justifyContent: "center",
            display: "flex",
          },
          "& .center-cell": { padding: "5px" },
        }}
        disableColumnMenu
        autoHeight
      />
    </Paper>
  );
}
