// productStore

export type Product = {
  name: string;
  description: string;
  price: number;
};

export const productData = {
  selectedProduct: null as Product | null,
};

export let selectedProducts: {
  name: string;
  description: string;
  price: number;
}[] = [];
