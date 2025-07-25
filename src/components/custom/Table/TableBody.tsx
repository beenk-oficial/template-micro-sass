import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IColumns } from "@/types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const renderTableCell = (column: IColumns, row: Record<string, any>) => {
  if (column.component) {
    return React.createElement(column.component, { row });
  }
  if (column.format) {
    return column.format(row[column.field], row);
  }
  return row[column.field] || "-";
};

const renderSkeletonRow = (
  columns: IColumns[],
  selected?: boolean,
  actions?: {
    update: (updatedData: Record<string, any>[]) => void;
    delete: (row: Record<string, any>) => void;
  }
) => {
  return (
    <TableRow>
      {selected && (
        <TableCell>
          <Skeleton className="h-4 w-4 rounded-md ml-1" />
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell key={column.field}>
          <Skeleton className="h-4 w-full rounded-md" />
        </TableCell>
      ))}
      {actions && (
        <TableCell>
          <Skeleton className="h-4 w-full rounded-md pr-3" />
        </TableCell>
      )}
    </TableRow>
  );
};

const handleRowSelection = (
  row: unknown,
  isSelected: boolean,
  selected: unknown[],
  onRowSelectionChange?: (selectedRows: unknown[]) => void
) => {
  const updatedSelected = isSelected
    ? [...selected, row]
    : selected.filter((item) => item !== row);
  onRowSelectionChange?.(updatedSelected);
};

const renderActionCell = (row: Record<string, any>, actions: any, t: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8 mx-auto"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">{t("open_menu")}</span>{" "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {actions.update && (
          <DropdownMenuItem
            onClick={() => actions.update(row)}
            className="cursor-pointer flex items-center gap-2"
          >
            <IconEdit size={16} />
            {t("edit")}
          </DropdownMenuItem>
        )}
        {actions.delete && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => actions.delete(row)}
            className="cursor-pointer flex items-center gap-2"
          >
            <IconTrash size={16} />
            {t("delete")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function CustomTableBody({
  data,
  columns,
  selected,
  loading = false,
  actions,
  onRowSelectionChange,
}: {
  data: Record<string, any>[];
  columns: IColumns[];
  selected?: unknown[];
  loading: boolean;
  actions?: {
    update: (updatedData: Record<string, any>[]) => void;
    delete: (row: Record<string, any>) => void;
  };
  onRowSelectionChange?: (selectedRows: unknown[]) => void;
}) {
  const t = useTranslations("general");

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: data.length || 10 }).map((_, index) =>
        renderSkeletonRow(columns, !!selected, actions)
      );
    }

    if (data.length) {
      return (
        <SortableContext
          items={data.map((item) => item.id || item.name)}
          strategy={verticalListSortingStrategy}
        >
          {data.map((row) => (
            <TableRow
              key={row.id || row.name}
              className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            >
              {selected && (
                <TableCell>
                  <Checkbox
                    className="ml-1"
                    checked={selected.includes(row)}
                    onCheckedChange={(value: boolean) =>
                      handleRowSelection(
                        row,
                        value,
                        selected,
                        onRowSelectionChange
                      )
                    }
                    aria-label="Select row"
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {renderTableCell(column, row)}
                </TableCell>
              ))}
              {actions && (
                <TableCell>{renderActionCell(row, actions, t)}</TableCell>
              )}
            </TableRow>
          ))}
        </SortableContext>
      );
    }

    const colSpan = columns.length + (selected ? 1 : 0) + (actions ? 1 : 0);

    return (
      <TableRow>
        <TableCell colSpan={colSpan} className="h-24 text-center">
          {t("no_results")}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableBody className="**:data-[slot=table-cell]:first:w-8">
      {renderContent()}
    </TableBody>
  );
}
