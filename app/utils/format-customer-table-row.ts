import type { Customer, CustomerTableRow } from "~/composables/types/customer";

export function mapCustomersToTableRows(
  customers: Customer[]
): CustomerTableRow[] {
  return customers.map((c) => {
    const name =
      c.customer_type === "person"
        ? `${c.person_customer?.first_name ?? ""} ${
            c.person_customer?.last_name ?? ""
          }`
        : c.company_customer?.company_name ?? "";

    const email = c.customer_contacts.find(
      (ct) => ct.contact_type === "email"
    )?.contact_value;
    const phone = c.customer_contacts.find(
      (ct) => ct.contact_type === "phone"
    )?.contact_value;

    const tin =
      c.customer_type === "person"
        ? c.person_customer?.tin ?? ""
        : (c.company_customer?.tin ?? "") +
          (c.company_customer?.branch_no ?? "");

    const address = [
      c.customer_address?.address_line1,
      c.customer_address?.address_line2,
      c.customer_address?.postal_code,
    ]
      .filter(Boolean)
      .join(" ");

    const location_data = {
      provinces_id: c.customer_address?.province_id,
      districts_id: c.customer_address?.districts_id,
      subdistricts_id: c.customer_address?.subdistricts_id,
      zip_code: c.customer_address?.postal_code,
    };

    return {
      id: c.id,
      name,
      first_name: c.person_customer?.first_name,
      last_name: c.person_customer?.last_name,
      type: c.customer_type === "person" ? "บุคคลธรรมดา" : "นิติบุคคล",
      email,
      phone,
      address,
      branch_no: c.company_customer?.branch_no,
      tin,
      status: c.status,
      created_at: c.created_at,
      location_data,
    };
  });
}
