import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IColumns, IPagination, SortOrder } from "@/types";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

export default function CustomTableHeader({
  columns,
  pagination,
  selected,
  data,
  onSortChange,
  onRowSelectionChange,
  disabled = false,
}: {
  columns: IColumns[];
  pagination: IPagination;
  selected?: unknown[];
  data: Record<string, any>[];
  onSortChange: (field: string, order: SortOrder) => void;
  onRowSelectionChange?: (selectedRows: unknown[]) => void;
  disabled: boolean;
}) {
  const handleSort = (field: string) => {
    const newOrder =
      pagination.sortField === field && pagination.sortOrder === SortOrder.ASC
        ? SortOrder.DESC
        : SortOrder.ASC;
    onSortChange(field, newOrder);
  };

  const handleSelectAll = (isSelected: boolean) => {
    const updatedSelection = isSelected ? [...data] : [];
    if (onRowSelectionChange) onRowSelectionChange(updatedSelection);
  };

  return (
    <TableHeader className="bg-muted sticky top-0 z-10">
      <TableRow>
        {typeof selected !== "undefined" && (
          <TableHead colSpan={1}>
            <div className="flex items-center justify-center w-6">
              <Checkbox
                checked={selected.length === data.length && data.length > 0}
                onCheckedChange={(value) => handleSelectAll(!!value)}
                aria-label="Select all"
                disabled={disabled}
              />
            </div>
          </TableHead>
        )}

        {columns.map((column) => (
          <TableHead key={column.field} colSpan={column.colSpan}>
            <div className="flex items-center">
              {column.label}
              {column?.sortable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground size-7 hover:bg-transparent"
                  disabled={disabled}
                  onClick={() => handleSort(column.field)}
                >
                  {pagination.sortField === column.field &&
                    pagination.sortOrder === SortOrder.ASC && (
                      <IconChevronUp className="size-4 cursor-pointer" />
                    )}
                  {pagination.sortField === column.field &&
                    pagination.sortOrder === SortOrder.DESC && (
                      <IconChevronDown className="size-4 cursor-pointer" />
                    )}
                </Button>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
