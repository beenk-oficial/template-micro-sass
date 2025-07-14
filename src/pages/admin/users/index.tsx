import AdminLayout from "@/components/layout/AdminLayout";
import { CustomTable } from "@/components/custom/Table/CustomTable";
import { useState, useEffect } from "react";
import { IPagination, SortOrder } from "@/types";
import { useFetch } from "@/hooks/useFetch";
import { Badge } from "@/components/ui/badge";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconUser,
  IconShieldCheck,
  IconUserCircle,
} from "@tabler/icons-react";
import { format } from "path";

export default function Page() {
  const customFetch = useFetch();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

  const [pagination, setPagination] = useState<IPagination>({
    sortField: "full_name",
    sortOrder: SortOrder.ASC,
    currentPage: 1,
    itemsPerPage: 10,
    currentTotalItems: 0,
    totalItems: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      label: "Nome",
      field: "full_name",
      sortable: true,
    },
    {
      label: "Email",
      field: "email",
      sortable: true,
    },
    {
      label: "Tipo",
      field: "type",
      component: ({ row }) => {
        const getTypeIcon = (type: string) => {
          switch (type) {
            case "admin":
              return <IconShieldCheck className="mr-1 text-blue-500" />;
            case "user":
              return <IconUser className="mr-1 text-green-500" />;
            case "guest":
              return <IconUserCircle className="mr-1 text-gray-500" />;
            default:
              return null;
          }
        };

        return (
          <Badge
            variant="outline"
            className="text-muted-foreground px-1.5 flex items-center"
          >
            {getTypeIcon(row.type)}
            {row.type}
          </Badge>
        );
      },
    },
    {
      label: "Status",
      field: "is_active",
      component: ({ row }) => {
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.is_active ? (
              <IconCircleCheckFilled className="fill-green-400" />
            ) : (
              <IconCircleXFilled className="fill-red-400" />
            )}
            {row.is_active ? "Ativo" : "Inativo"}
          </Badge>
        );
      },
    },
    {
      label: "Banido",
      field: "is_banned",
      component: ({ row }) => {
        console.log("Row data:", row);
        return (
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.is_banned ? (
              <IconCircleXFilled className="fill-red-400" />
            ) : (
              <IconCircleCheckFilled className="fill-green-400" />
            )}
            {row.is_banned ? "Sim" : "Não"}
          </Badge>
        );
      },
    },
    {
      label: "Criado em",
      field: "created_at",
      format: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString(navigator.language, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customFetch("/api/admin/users", {
        query: {
          page: pagination.currentPage,
          perPage: pagination.itemsPerPage,
          sortField: pagination.sortField,
          sortOrder: pagination.sortOrder,
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
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    pagination.currentPage,
    pagination.itemsPerPage,
    pagination.sortField,
    pagination.sortOrder,
  ]);

  const handleRequest = (updatedPagination: IPagination) => {
    setPagination(updatedPagination);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <CustomTable
          data={data}
          columns={columns}
          pagination={pagination}
          selected={selected}
          loading={loading}
          onRowSelectionChange={setSelected}
          onRequest={handleRequest}
        />
      </div>
    </AdminLayout>
  );
}
