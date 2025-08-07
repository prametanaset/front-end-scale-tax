export interface Customer {
  id: number;
  store_id: string;
  customer_type: "person" | "company";
  status: "active" | "inactive";
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  person_customer?: PersonCustomer;
  company_customer?: CompanyCustomer;
  customer_address?: CustomerAddress;
  customer_contacts: CustomerContact[];
}

export interface PersonCustomer {
  id: number;
  customer_id: number;
  first_name: string;
  last_name: string;
  tin: string;
}

export interface CompanyCustomer {
  id: number;
  customer_id: number;
  company_name: string;
  tin: string;
  branch_no: string;
}

export interface CustomerAddress {
  id: number;
  customer_id: number;
  address_line1: string;
  address_line2: string;
  province_id: number;
  districts_id: number;
  subdistricts_id: number;
  postal_code: string;
}

export interface CustomerContact {
  id: number;
  customer_id: number;
  contact_type: "email" | "phone"; // ปรับตามประเภทจริง
  contact_value: string;
  created_at: string;
}

export interface CustomerTableRow {
  id: number;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  address: string;
  tin: string;
  status: string;
  created_at: string;
}
