import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TypographyComponent from "./Typography";

export default function Table({
  rows = [],
  headings = [],
  icons = {},
  onStatusChange = () => {},
  onDetailClick = () => {},
  onEdit = () => {},
  getRowId = (row) => row.id,
  loading = false,
  // Pagination props
  paginationModel = { page: 0, pageSize: 10 },
  onPaginationModelChange = () => {},
  rowCount = 0,
  pageSizeOptions = [5, 10, 20, 50],
  // Height prop with default value
  height = 400,
  // New prop to determine what to pass to onDetailClick
  passIdOnly = false,
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
      width: heading.width,
    }));

  // Add edit, details, and key columns with safe checks for icons
  columns.push(
    {
      field: "Edit",
      headerName: "",
      flex: 0.5,
      renderCell: (params) =>
        icons.edit ? (
          <IconButton
            onClick={() => params.row.id && onEdit(params.row)}
            aria-label="edit"
            sx={{ color: "var(--primary)" }}
          >
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
            onClick={() =>
              onDetailClick(passIdOnly ? params.row.id : params.row)
            }
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
      renderCell: (params) =>
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
          checked={
            params.row.Status === "Active" || params.row.isActive === true
          }
          onChange={() => onStatusChange(params.row.id)}
          style={{ color: "var(--primary)" }}
        />
      ),
      sortable: false,
    }
  );

  if (loading) {
    return (
      <Paper
        sx={{
          height: height,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TypographyComponent color="var(--primary)" fontSize="16px">
          Loading...
        </TypographyComponent>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        height: height,
        width: "100%",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={pageSizeOptions}
        rowCount={rowCount}
        paginationMode="server"
        sx={{
          border: 0,
          height: "100%",
          "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
          "& .center-header": {
            justifyContent: "center",
            display: "flex",
          },
          "& .center-cell": { padding: "5px" },
        }}
        disableColumnMenu
        autoHeight={false}
      />
    </Paper>
  );
}
