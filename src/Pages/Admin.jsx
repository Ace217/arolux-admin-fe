import React, { useState, useEffect } from "react";
import BoxComponent from "../Components/Box";
import Sidebar from "../Components/Sidebar";
import Head from "../Components/Head";
import TypographyComponent from "../Components/Typography";
import ButtonComponent from "../Components/Button";
import Table from "../Components/Table";
import Form from "../Components/Form";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Find from "../Components/Find";
import Update from "../Components/Update";
import { useNavigate } from "react-router-dom";
import { accounts } from "../api/constants";

export default function Admin({ token: receivedToken }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Admin");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null); // Store selected admin data

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = receivedToken || localStorage.getItem("token");

        if (!token) {
          console.error(
            "Authentication token is missing. Please log in again."
          );
          return;
        }

        console.log("Token being used:", token); // Debugging

        const response = await accounts(token);

        console.log("Fetched Data:", response?.data); // Debugging

        if (response && Array.isArray(response.data.data.adminAccounts)) {
          setRows(response.data.data.adminAccounts);
        } else {
          console.error("Unexpected API response format:", response);
        }
      } catch (error) {
        console.error(
          "Error fetching admin data:",
          error?.response?.data || error.message
        );
      }
    };

    fetchAdmins();
  }, [receivedToken]);

  const getRowId = (row) => row._id;

  const handleDetailClick = (data) => {
    navigate("/details", { state: { ...data } }); // Ensure full row data is passed
  };

  const handleOpenModal = (mode, adminData = null) => {
    setIsModalOpen(true);
    setModalTitle(mode === "edit" ? "Update Admin" : "Add Admin");

    if (mode === "edit" && adminData) {
      setSelectedAdmin(adminData); // Store admin data for editing
    } else {
      setSelectedAdmin(null); // Reset for Add Admin
    }
  };
  const handleStatusChange = (_id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row._id === _id
          ? { ...row, Status: row.Status === "Active" ? "In-Active" : "Active" }
          : row
      )
    );
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const headings = [
    { field: "name", headerName: "Name" },
    { field: "adminType", headerName: "Admin Type" },
    { field: "email", headerName: "Email" },
    { field: "phoneNumber", headerName: "Phone No", type: "number" },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 150,
      renderCell: (params) => (
        <TypographyComponent>
          {params.value ? params.value.name : "N/A"}
        </TypographyComponent>
      ),
    },
    { field: "lastLoginTime", headerName: "Last Login" },
    {
      field: "isActive",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <TypographyComponent
          sx={{ color: params.value === true ? "green" : "red" }}
        >
          {params.value === true ? "Active" : "In-Active"}
        </TypographyComponent>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => (
        <ModeEditOutlineOutlinedIcon
          onClick={() => handleOpenModal("edit", params.row)} // Pass selected row data
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      field: "view",
      headerName: "View",
      renderCell: (params) => (
        <VisibilityIcon
          onClick={() => handleDetailClick(params.row)}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      field: "update",
      headerName: "Update",
      renderCell: (params) => (
        <VpnKeyOutlinedIcon
          onClick={() => handleOpenUpdateModal(params.row._id)}
          style={{ cursor: "pointer" }}
        />
      ),
    },
  ];
  console.log("Headings Passed to Table:", headings);
  return (
    <BoxComponent backgroundColor="var(--light)">
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent width="82%" padding="20px">
          <BoxComponent
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <TypographyComponent
              fontSize="18px"
              fontFamily="var(--main)"
              color="var(--dark)"
              fontWeight="400"
            >
              ADMIN ACCESS
            </TypographyComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px" }}
              onClick={() => handleOpenModal("add")}
            >
              + Add Admin
            </ButtonComponent>
          </BoxComponent>

          <Find
            placeholder="Search a user by name, e-mail or phone number"
            label="Status"
            status={[
              { value: 1, label: "All" },
              { value: 2, label: "Active" },
              { value: 3, label: "Inactive" },
            ]}
          />

          <Table
            getRowId={getRowId}
            rows={rows}
            headings={headings}
            // icons={icons}
            onDetailClick={(row) => handleDetailClick(row)}
            onStatusChange={handleStatusChange}
            passIdOnly={false}
          />
        </BoxComponent>
      </BoxComponent>

      {isModalOpen && (
        <>
          <BoxComponent
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bgcolor="rgba(0, 0, 0, 0.5)"
            zIndex="1200"
            onClick={handleCancelClick}
          />
          <BoxComponent
            position="fixed"
            width="40%"
            top="5%"
            left="30%"
            transform="translate(-50%, -50%)"
            bgcolor="var(--light)"
            borderRadius="8px"
            padding="20px"
            zIndex="1200"
          >
            <Form
              onCancel={handleCancelClick}
              title={modalTitle}
              adminData={selectedAdmin}
            />
          </BoxComponent>
        </>
      )}

      {isUpdateModalOpen && (
        <>
          <BoxComponent
            position="fixed"
            top="0"
            left="0"
            width="100%"
            height="100%"
            bgcolor="rgba(0, 0, 0, 0.7)"
            zIndex="1200"
            onClick={handleCloseUpdateModal}
          />
          <BoxComponent
            position="fixed"
            width="30%"
            top="30%"
            left="35%"
            padding="5px"
            transform="translate(-50%, -50%)"
            bgcolor="var(--light)"
            borderRadius="10px"
            zIndex="1201"
          >
            <Update onCancel={handleCloseUpdateModal} />
          </BoxComponent>
        </>
      )}
    </BoxComponent>
  );
}
