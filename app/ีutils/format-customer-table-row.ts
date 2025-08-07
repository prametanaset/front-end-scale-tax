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
        : c.company_customer?.tin ?? "";

    const address = [
      c.customer_address?.address_line1,
      c.customer_address?.address_line2,
      c.customer_address?.postal_code,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      id: c.id,
      name,
      type: c.customer_type === "person" ? "บุคคล" : "นิติบุคคล",
      email,
      phone,
      address,
      tin,
      status: c.status,
      created_at: c.created_at,
    };
  });
}
