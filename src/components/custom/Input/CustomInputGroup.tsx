import React from "react";
import { Label } from "@/components/ui/label";

interface CustomInputProps {
  label?: string;
  htmlFor?: string;
  children?: React.ReactNode;
  error?: string;
  required?: boolean;
}

const CustomInputGroup: React.FC<CustomInputProps> = ({
  label,
  htmlFor,
  children,
  error,
  required = false,
}) => {
  return (
    <div className="grid gap-3">
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CustomInputGroup;
