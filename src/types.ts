export interface Product {
  id: string;
  name: string;
  link: string;
  cost: number;
  categoryTax: number; // Percentage (e.g., 11.5)
  taxPercentage: number; // Percentage (e.g., 4)
  packaging: number;
  fixedFee: number; // Fallback when weight = 0
  shippingFee: number; // Fallback when weight = 0
  desiredMargin: number; // Percentage (e.g., 20)
  weight: number; // kg
  height: number; // cm
  width: number; // cm
  length: number; // cm
}

export interface PricingResult {
  sellingPrice: number;
  mlCommission: number;
  fixedFee: number;
  shippingFee: number;
  taxes: number;
  profit: number;
  profitMargin: number;
  isFreeShipping: boolean;
}
