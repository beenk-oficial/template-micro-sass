import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Table } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { IColumns, IPagination, SortOrder } from "@/types";
import CustomTableHeader from "./TableHeader";
import CustomTableBody from "./TableBody";
import TablePagination from "./TablePagination";

export function CustomTable({
  data,
  columns,
  pagination,
  selected,
  onRowSelectionChange,
  onRequest,
  loading = false,
}: {
  data: Record<string, any>[];
  columns: IColumns[];
  pagination: IPagination;
  selected?: unknown[];
  onRowSelectionChange: (selectedRows: unknown[]) => void;
  onRequest: (updatedPagination: IPagination) => void;
  loading: boolean;
}) {
  const sortableId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const handleSortChange = (field: string, order: SortOrder) => {
    onRequest({
      ...pagination,
      sortField: field,
      sortOrder: order,
    });
  };

  const handlePageChange = (pageIndex: number, pageSize: number) => {
    onRequest({
      ...pagination,
      currentPage: pageIndex,
      itemsPerPage: pageSize,
    });
  };

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <CustomTableHeader
                columns={columns}
                pagination={pagination}
                selected={selected}
                data={data}
                onRowSelectionChange={onRowSelectionChange}
                onSortChange={handleSortChange}
                disabled={loading}
              />
              <CustomTableBody
                columns={columns}
                data={data}
                selected={selected}
                loading={loading}
                onRowSelectionChange={onRowSelectionChange}
              />
            </Table>
          </DndContext>
        </div>
        <TablePagination
          pagination={pagination}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      </TabsContent>
    </Tabs>
  );
}
