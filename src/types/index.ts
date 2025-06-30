export type Company = {
  id: string;
  white_label_id?: string;
  address_id?: string;
  name: string;
  legal_name?: string;
  identifier?: string;
  identifier_type?: string;
  slug: string;
  domain?: string;
  stripe_connect_id?: string;
  commission_rate?: number;
  timezone?: string;
  locale?: string;
  email?: string;
  currency?: string;
  phone?: string;
  bank_name?: string;
  bank_account?: string;
  bank_agency?: string;
  pix_key?: string;
  industry?: string;
  status?: "active" | "inactive" | string;
};

export type User = {
  id: string;
  address_id?: string;
  email: string;
  full_name?: string;
  locale?: string;
  birth_date?: string;
  gender?: string;
  nationality?: string;
  document_type?: string;
  document_number?: string;
  show_onboarding?: boolean;
  is_banned?: boolean;
};

export type CompanyUser = {
  id: string;
  role_id?: string;
  company_id: string;
  user_id: string;
  avatar_url?: string;
  phone?: string;
  type: UserType;
  is_active?: boolean;
};

export enum UserType {
  ADMIN = "admin",
  USER = "user",
  OWNER = "owner",
}
