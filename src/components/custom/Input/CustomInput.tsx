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
  additionalElement?: React.ReactNode;
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
  additionalElement,
}) => {
  return (
    <CustomInputGroup
      label={label}
      htmlFor={htmlFor ?? name}
      error={error}
      required={required}
      additionalElement={additionalElement}
    >
      <Input
        id={id ?? name}
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
