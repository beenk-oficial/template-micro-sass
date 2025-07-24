import AdminLayout from "@/components/layout/AdminLayout";
import { CustomTable } from "@/components/custom/Table/CustomTable";
import { useState, useEffect } from "react";
import { IPagination, SortOrder, Payment, PaymentStatus } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import { Badge } from "@/components/ui/badge";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconAlertTriangleFilled,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { formatToLocaleDate } from "@/utils";

export default function Page() {
  const t = useTranslations("general");
  const customFetch = useFetch();
  const [data, setData] = useState<Payment[]>([]);

  const [pagination, setPagination] = useState<IPagination>({
    sortField: "created_at",
    sortOrder: SortOrder.ASC,
    currentPage: 1,
    itemsPerPage: 10,
    currentTotalItems: 0,
    totalItems: 0,
    totalPages: 0,
    search: "",
  });
  const [loading, setLoading] = useState(false);

  function renderStatus(row: Payment, t: any) {
    let colorClass = "";
    let label = row.status;
    let Icon = null;
    switch (row.status) {
      case PaymentStatus.PAID:
        colorClass = "bg-green-200 text-green-800";
        label = t("paid");
        Icon = IconCircleCheckFilled;
        break;
      case PaymentStatus.PENDING:
        colorClass = "bg-yellow-200 text-yellow-800";
        label = t("pending");
        Icon = IconAlertTriangleFilled;
        break;
      case PaymentStatus.FAILED:
        colorClass = "bg-red-200 text-red-800";
        label = t("failed");
        Icon = IconCircleXFilled;
        break;
      default:
        colorClass = "bg-muted text-muted-foreground";
        label = row.status;
        Icon = null;
    }
    return (
      <Badge variant="outline" className={`px-1.5 flex items-center gap-1 ${colorClass}`}>
        {Icon && <Icon size={16} />}
        {label}
      </Badge>
    );
  }

  const columns = [
    {
      label: t("customer_id"),
      field: "customer_id",
      sortable: true,
    },
    {
      label: t("amount_total"),
      field: "amount_total",
      sortable: true,
      format: (v: number) => v?.toLocaleString(undefined, { style: "currency", currency: "USD" }),
    },
    {
      label: t("platform_fee"),
      field: "platform_fee",
      sortable: true,
      format: (v: number) => v?.toLocaleString(undefined, { style: "currency", currency: "USD" }),
    },
    {
      label: t("amount_received"),
      field: "amount_received",
      sortable: true,
      format: (v: number) => v?.toLocaleString(undefined, { style: "currency", currency: "USD" }),
    },
    {
      label: t("status"),
      field: "status",
      component: ({ row }: { row: Payment }) => renderStatus(row, t),
    },
    {
      label: t("stripe_payment_id"),
      field: "stripe_payment_id",
      sortable: true,
    },
    {
      label: t("created_at"),
      field: "created_at",
      sortable: true,
      format: formatToLocaleDate,
    },
  ];

  const fetchData = async (updatedPagination: IPagination | null = null) => {
    setLoading(true);
    try {
      const response = await customFetch("/api/admin/payments", {
        query: {
          page: updatedPagination?.currentPage ?? pagination.currentPage,
          perPage: updatedPagination?.itemsPerPage ?? pagination.itemsPerPage,
          sortField: updatedPagination?.sortField ?? pagination.sortField,
          sortOrder: updatedPagination?.sortOrder ?? pagination.sortOrder,
          search: updatedPagination?.search ?? pagination.search,
        },
      });
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
        setPagination((prev) => ({
          ...prev,
          currentTotalItems: result.pagination.currentTotalItems,
          totalItems: result.pagination.totalItems,
          totalPages: result.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequest = (updatedPagination: IPagination) => {
    setPagination(updatedPagination);
    fetchData(updatedPagination);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CustomTable
          data={data}
          columns={columns}
          pagination={pagination}
          loading={loading}
          onRequest={handleRequest}
        />
      </div>
    </AdminLayout>
  );
}