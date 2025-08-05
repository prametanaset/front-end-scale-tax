export interface Product {
  id: number;
  store_id: string;
  sku: string;
  name: string;
  price: number;
  vat_type: string;
  vat_rate: number;
  created_at: string;
  updated_at: string;
  product_image: {
    id: number;
    product_id: number;
    url: string;
  };
}
