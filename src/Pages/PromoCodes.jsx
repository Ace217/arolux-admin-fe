import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import BoxComponent from "../Components/Box";
import Head from "../Components/Head";
import Sidebar from "../Components/Sidebar";
import TypographyComponent from "../Components/Typography";
import ButtonComponent from "../Components/Button";
import Find from "../Components/Find";
import Table from "../Components/Table";
import PromoCodeForm from "../Components/PromoCodeForm";
import {
  getPromoCodesList,
  deletePromoCode,
  togglePromoCodeStatus,
} from "../api/constants";

// Icons for table
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import KeyIcon from "@mui/icons-material/Key";

export default function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalPromoCodes, setTotalPromoCodes] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);

  // Table headings
  const headings = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "code", headerName: "Code", flex: 1 },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>{params.value}</span>
      ),
    },
    {
      field: "value",
      headerName: "Value",
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.row.type === "percentage"
            ? `${params.value}%`
            : `$${params.value}`}
        </span>
      ),
    },
    {
      field: "minimumAmount",
      headerName: "Min. Amount",
      flex: 1,
      renderCell: (params) => <span>${params.value}</span>,
    },
    { field: "validityPeriod", headerName: "Validity Period", flex: 1.5 },
    { field: "Status", headerName: "Status", flex: 1 },
  ];

  // Icons for table actions
  const icons = {
    edit: <EditOutlinedIcon />,
    details: <VisibilityOutlinedIcon />,
    key: <KeyIcon />,
  };

  // Fetch promo codes
  useEffect(() => {
    fetchPromoCodes();
  }, [paginationModel, status, searchQuery]);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");

      const queryParams = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      };

      if (status !== "all") {
        queryParams.status = status;
      }

      if (searchQuery) {
        queryParams.search = searchQuery;
      }

      const response = await getPromoCodesList(queryParams, token);

      if (response?.data?.success) {
        const formattedPromoCodes = response.data.data.map((promo) => ({
          id: promo._id,
          title: promo.title,
          code: promo.code,
          type: promo.type,
          value: promo.value,
          maximumDiscount: promo.maximumDiscount,
          minimumAmount: promo.minimumAmount,
          validityPeriod: `${new Date(
            promo.startDate
          ).toLocaleDateString()} - ${new Date(
            promo.endDate
          ).toLocaleDateString()}`,
          startDate: promo.startDate,
          endDate: promo.endDate,
          Status: promo.isActive ? "Active" : "Inactive",
          isActive: promo.isActive,
          vehicleCategoryIds: promo.vehicleCategoryIds || [],
          geoLocationIds: promo.geoLocationIds || [],
        }));

        setPromoCodes(formattedPromoCodes);
        setTotalPromoCodes(
          response.data.totalCount || formattedPromoCodes.length
        );
      } else {
        toast.error(response?.data?.message || "Failed to fetch promo codes");
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error("Error fetching promo codes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setPaginationModel({ ...paginationModel, page: 0 });
  };

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const handleAddPromoCode = () => {
    setSelectedPromoCode(null);
    setIsFormOpen(true);
  };

  const handleEditPromoCode = (promoCode) => {
    setSelectedPromoCode(promoCode);
    setIsFormOpen(true);
  };

  const handlePromoCodeDetails = (promoCode) => {
    // You could implement a detailed view or just show a toast with info
    toast.info(`Promo code details: ${JSON.stringify(promoCode)}`);
  };

  const handleToggleStatus = async (id) => {
    try {
      const promoCode = promoCodes.find((code) => code.id === id);
      if (!promoCode) return;

      const token = Cookies.get("token");
      const response = await togglePromoCodeStatus(
        id,
        !promoCode.isActive,
        token
      );

      if (response?.data?.success) {
        toast.success(
          `Promo code status changed to ${
            !promoCode.isActive ? "Active" : "Inactive"
          }`
        );
        fetchPromoCodes(); // Refresh the list
      } else {
        toast.error(response?.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Error updating promo code status");
    }
  };

  const handleFormClose = (refresh = false) => {
    setIsFormOpen(false);
    setSelectedPromoCode(null);
    if (refresh) {
      fetchPromoCodes();
    }
  };

  return (
    <BoxComponent backgroundColor="var(--light)">
      <Head />
      <BoxComponent display="flex" justifyContent="space-between">
        <Sidebar />
        <BoxComponent
          display="flex"
          flexDirection="column"
          width="82%"
          padding="20px"
        >
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
              PROMO CODES
            </TypographyComponent>
            <ButtonComponent
              variant="contained"
              backgroundColor="var(--primary)"
              sx={{ color: "var(--light)", padding: "10px 20px" }}
              onClick={handleAddPromoCode}
              title="Add Promo Code"
            >
              + Add Promo Code
            </ButtonComponent>
          </BoxComponent>
          <Find
            placeholder="Search Promo Code by Title or Code"
            label="Status"
            status={status}
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
          />
          <Table
            rows={promoCodes}
            headings={headings}
            icons={icons}
            loading={loading}
            onEdit={handleEditPromoCode}
            onDetailClick={handlePromoCodeDetails}
            onStatusChange={handleToggleStatus}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            rowCount={totalPromoCodes}
            pageSizeOptions={[10, 20, 50, 100]}
            getRowId={(row) => row.id}
          />

          {/* Promo Code Form Modal */}
          <PromoCodeForm
            open={isFormOpen}
            onClose={handleFormClose}
            promoCodeData={selectedPromoCode}
          />
        </BoxComponent>
      </BoxComponent>
    </BoxComponent>
  );
}
