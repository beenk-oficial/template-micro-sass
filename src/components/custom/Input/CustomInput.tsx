import React from "react";
import { Input } from "@/components/ui/input";
import CustomInputGroup from "./CustomInputGroup";

interface CustomInputProps {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value: string;
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  id,
  name,
  type = "text",
  placeholder = "",
  value,
  label,
  htmlFor,
  error = "",
  required = false,
  disabled = false,
  onChange,
}) => {
  return (
    <CustomInputGroup
      label={label}
      htmlFor={htmlFor}
      error={error}
      required={required}
    >
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </CustomInputGroup>
  );
};

export default CustomInput;
