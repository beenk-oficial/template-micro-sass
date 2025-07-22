import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface CustomDialogProps {
  open: boolean;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
}

export const CustomDialog = ({
  open,
  children,
  onOpenChange,
}: CustomDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const ConfirmDeleteDialog = ({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) => {
  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <button
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={onConfirm}
        >
          Delete
        </button>
      </DialogFooter>
    </CustomDialog>
  );
};
