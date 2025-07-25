import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import React from "react";
import { IPagination } from "@/types";
import { useTranslations } from "next-intl";

export default function TablePagination({
  pagination,
  onPageChange,
  disabled = false,
}: {
  pagination: IPagination;
  onPageChange: (pageIndex: number, pageSize: number) => void;
  disabled: boolean;
}) {
  const t = useTranslations("general");

  const handlePageChange = (pageIndex: number) => {
    onPageChange(pageIndex, pagination.itemsPerPage);
  };

  const handlePageSizeChange = (pageSize: number) => {
    onPageChange(pagination.currentPage, pageSize);
  };

  return (
    <div className="flex items-center justify-between px-4">
      <div className="hidden items-center gap-2 lg:flex">
        <Label htmlFor="rows-per-page" className="text-sm font-medium">
          {t("rows_per_page")}
        </Label>
        <Select
          value={`${pagination.itemsPerPage}`}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
          disabled={disabled}
        >
          <SelectTrigger size="sm" className="w-20" id="rows-per-page">
            <SelectValue placeholder={pagination.itemsPerPage} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-fit items-center justify-center text-sm font-medium">
        {t("page")} {pagination.currentPage} {t("of")}{" "}
        {pagination.totalPages === 0 ? 1 : pagination.totalPages}
      </div>
      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => handlePageChange(1)}
          disabled={pagination.currentPage === 1 || disabled}
        >
          <span className="sr-only">{t("go_to_first_page")}</span>
          <IconChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1 || disabled}
        >
          <span className="sr-only">{t("go_to_previous_page")}</span>
          <IconChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="size-8"
          size="icon"
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage >= pagination.totalPages || disabled}
        >
          <span className="sr-only">{t("go_to_next_page")}</span>
          <IconChevronRight />
        </Button>
        <Button
          variant="outline"
          className="hidden size-8 lg:flex"
          size="icon"
          onClick={() => handlePageChange(pagination.totalPages - 1)}
          disabled={pagination.currentPage >= pagination.totalPages || disabled}
        >
          <span className="sr-only">{t("go_to_last_page")}</span>
          <IconChevronsRight />
        </Button>
      </div>
    </div>
  );
}
