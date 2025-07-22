import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, UserType } from "@/types";
import CustomForm from "@/components/custom/Input/CustomForm";
import CustomInput from "@/components/custom/Input/CustomInput";
import { useTranslations } from "next-intl";

export default function Form({
  data,
  open,
  onOpenChange,
  onSubmit,
}: {
  data?: User;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (formData: Partial<User>) => void;
}) {
  const t = useTranslations("general") || ((key: string) => key);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({
    full_name: "",
    email: "",
    locale: "",
    birth_date: "",
    gender: "",
    nationality: "",
    document_type: "",
    document_number: "",
    show_onboarding: false,
    avatar_url: "",
    is_banned: false,
    type: UserType.USER,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        full_name: data.full_name || "",
        email: data.email || "",
        locale: data.locale || "",
        birth_date: data.birth_date || "",
        gender: data.gender || "",
        nationality: data.nationality || "",
        document_type: data.document_type || "",
        document_number: data.document_number || "",
        show_onboarding: data.show_onboarding || false,
        avatar_url: data.avatar_url || "",
        is_banned: data.is_banned || false,
        type: data.type || UserType.USER,
      });
    }
  }, [data]);

  const handleChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <CustomForm
      open={open}
      onOpenChange={onOpenChange}
      title={data ? "Edit User" : "Create User"}
      description={
        data
          ? "Update user details"
          : "Fill in the details to create a new user"
      }
      onSubmit={handleSubmit}
    >
      <>
        <CustomInput
          name="full_name"
          label={t("full_name")}
          value={formData.full_name}
          onChange={(value) => handleChange("full_name", value)}
          disabled={loading}
          required
        />

        <CustomInput
          name="email"
          label={t("email")}
          value={formData.email}
          onChange={(value) => handleChange("email", value)}
          disabled={loading}
          required
        />

        <div className="flex flex-col gap-3">
          <Label htmlFor="birth_date">Birth Date</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => handleChange("birth_date", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Label htmlFor="is_banned">Banned</Label>
          <input
            id="is_banned"
            type="checkbox"
            checked={formData.is_banned}
            onChange={(e) => handleChange("is_banned", e.target.checked)}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserType.USER}>User</SelectItem>
              <SelectItem value={UserType.GUEST}>Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    </CustomForm>
  );
}
