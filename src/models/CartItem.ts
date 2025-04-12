import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  product_id: string;
  count: number;
  cart_id?: string;
};
