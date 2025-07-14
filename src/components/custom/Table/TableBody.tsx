import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IColumns } from "@/types";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const renderTableCell = (column: IColumns, row: Record<string, any>) => {
  if (column.component) {
    return React.createElement(column.component, { row });
  }
  if (column.format) {
    return column.format(row[column.field], row);
  }
  return row[column.field] || "-";
};

const renderSkeletonRow = (columns: IColumns[], selected?: boolean) => {
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
    </TableRow>
  );
};

const renderDataRow = (
  row: Record<string, any>,
  columns: IColumns[],
  selected: unknown[] | undefined,
  onRowSelectionChange: (selectedRows: unknown[]) => void
) => {
  return (
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
              handleRowSelection(row, value, selected, onRowSelectionChange)
            }
            aria-label="Select row"
          />
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell key={column.field}>{renderTableCell(column, row)}</TableCell>
      ))}
    </TableRow>
  );
};

const handleRowSelection = (
  row: unknown,
  isSelected: boolean,
  selected: unknown[],
  onRowSelectionChange: (selectedRows: unknown[]) => void
) => {
  const updatedSelected = isSelected
    ? [...selected, row]
    : selected.filter((item) => item !== row);
  onRowSelectionChange(updatedSelected);
};

export default function CustomTableBody({
  data,
  columns,
  selected,
  onRowSelectionChange,
  loading = false,
}: {
  data: Record<string, any>[];
  columns: IColumns[];
  selected?: unknown[];
  onRowSelectionChange: (selectedRows: unknown[]) => void;
  loading: boolean;
}) {
  const renderContent = () => {
    if (loading) {
      return Array.from({ length: data.length || 10 }).map((_, index) =>
        renderSkeletonRow(columns, !!selected)
      );
    }

    if (data.length) {
      return (
        <SortableContext
          items={data.map((item) => item.id || item.name)}
          strategy={verticalListSortingStrategy}
        >
          {data.map((row) =>
            renderDataRow(row, columns, selected, onRowSelectionChange)
          )}
        </SortableContext>
      );
    }

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No results.
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
