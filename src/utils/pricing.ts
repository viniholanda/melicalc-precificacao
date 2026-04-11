import { Product, PricingResult } from '../types';

export const ML_THRESHOLD = 79;

// Weight upper limits (kg) for each row of the shipping table
const WEIGHT_LIMITS = [
  0.3, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 20,
  25, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, Infinity,
];

// Price range boundaries [min, max] for each column
const PRICE_RANGES: [number, number][] = [
  [0, 18.99],
  [19, 48.99],
  [49, 78.99],
  [79, 99.99],
  [100, 119.99],
  [120, 149.99],
  [150, 199.99],
  [200, Infinity],
];

// Shipping cost table: SHIPPING_TABLE[weightIndex][priceRangeIndex]
const SHIPPING_TABLE: number[][] = [
  /* Até 0,3 kg   */ [5.65, 6.55, 7.75, 12.35, 14.35, 16.45, 18.45, 20.95],
  /* 0,3–0,5 kg   */ [5.95, 6.65, 7.85, 13.25, 15.45, 17.65, 19.85, 22.55],
  /* 0,5–1 kg     */ [6.05, 6.75, 7.95, 13.85, 16.15, 18.45, 20.75, 23.65],
  /* 1–1,5 kg     */ [6.15, 6.85, 8.05, 14.15, 16.45, 18.85, 21.15, 24.65],
  /* 1,5–2 kg     */ [6.25, 6.95, 8.15, 14.45, 16.85, 19.25, 21.65, 24.65],
  /* 2–3 kg       */ [6.35, 7.95, 8.55, 15.75, 18.35, 21.05, 23.65, 26.25],
  /* 3–4 kg       */ [6.45, 8.15, 8.95, 17.05, 19.85, 22.65, 25.55, 28.35],
  /* 4–5 kg       */ [6.55, 8.35, 9.75, 18.45, 21.55, 24.65, 27.75, 30.75],
  /* 5–6 kg       */ [6.65, 8.55, 9.95, 25.45, 28.55, 32.65, 35.75, 39.75],
  /* 6–7 kg       */ [6.75, 8.75, 10.15, 27.05, 31.05, 36.05, 40.05, 44.05],
  /* 7–8 kg       */ [6.85, 8.95, 10.35, 28.85, 33.65, 38.45, 43.25, 48.05],
  /* 8–9 kg       */ [6.95, 9.15, 10.55, 29.65, 34.55, 39.55, 44.45, 49.35],
  /* 9–11 kg      */ [7.05, 9.55, 10.95, 41.25, 48.05, 54.95, 61.75, 68.65],
  /* 11–13 kg     */ [7.15, 9.95, 11.35, 42.15, 49.25, 56.25, 63.25, 70.25],
  /* 13–15 kg     */ [7.25, 10.15, 11.55, 45.05, 52.45, 59.95, 67.45, 74.95],
  /* 15–17 kg     */ [7.35, 10.35, 11.75, 48.55, 56.05, 63.55, 70.75, 78.65],
  /* 17–20 kg     */ [7.45, 10.55, 11.95, 54.75, 63.85, 72.95, 82.05, 91.15],
  /* 20–25 kg     */ [7.65, 10.95, 12.15, 64.05, 75.05, 84.75, 95.35, 105.95],
  /* 25–30 kg     */ [7.75, 11.15, 12.35, 65.95, 75.45, 85.55, 96.25, 106.95],
  /* 30–40 kg     */ [7.85, 11.35, 12.55, 67.75, 78.95, 88.95, 99.15, 107.05],
  /* 40–50 kg     */ [7.95, 11.55, 12.75, 70.25, 81.05, 92.05, 102.55, 110.75],
  /* 50–60 kg     */ [8.05, 11.75, 12.95, 74.95, 86.45, 98.15, 109.35, 118.15],
  /* 60–70 kg     */ [8.15, 11.95, 13.15, 80.25, 92.95, 105.05, 117.15, 126.55],
  /* 70–80 kg     */ [8.25, 12.15, 13.35, 83.95, 97.05, 109.85, 122.45, 132.25],
  /* 80–90 kg     */ [8.35, 12.35, 13.55, 93.25, 107.45, 122.05, 136.05, 146.95],
  /* 90–100 kg    */ [8.45, 12.55, 13.75, 106.55, 123.95, 139.55, 155.55, 167.95],
  /* 100–125 kg   */ [8.55, 12.75, 13.95, 119.25, 138.05, 156.05, 173.95, 187.95],
  /* 125–150 kg   */ [8.65, 12.75, 14.15, 126.55, 146.15, 165.65, 184.65, 199.45],
  /* Mais de 150  */ [8.75, 12.95, 14.35, 166.15, 192.45, 217.55, 242.55, 261.95],
];

function getWeightIndex(weightKg: number): number {
  for (let i = 0; i < WEIGHT_LIMITS.length; i++) {
    if (weightKg <= WEIGHT_LIMITS[i]) return i;
  }
  return WEIGHT_LIMITS.length - 1;
}

function getPriceRangeIndex(price: number): number {
  for (let i = 0; i < PRICE_RANGES.length; i++) {
    if (price <= PRICE_RANGES[i][1]) return i;
  }
  return PRICE_RANGES.length - 1;
}

export function getEffectiveWeight(weight: number, height: number, width: number, length: number): number {
  const volumetricWeight = (height * width * length) / 6000;
  if (weight <= 0 && volumetricWeight <= 0) return 0;
  return Math.max(weight, volumetricWeight);
}

export function getShippingCost(effectiveWeightKg: number, sellingPrice: number): number {
  const wi = getWeightIndex(effectiveWeightKg);
  const pi = getPriceRangeIndex(sellingPrice);
  return SHIPPING_TABLE[wi][pi];
}

export function calculatePricing(product: Product): PricingResult {
  const {
    cost, categoryTax, taxPercentage, packaging,
    fixedFee, shippingFee, desiredMargin,
    weight, height, width, length,
  } = product;

  const catTaxDec = categoryTax / 100;
  const taxDec = taxPercentage / 100;
  const marginDec = desiredMargin / 100;
  const divisor = 1 - (catTaxDec + taxDec + marginDec);

  if (divisor <= 0) {
    const totalCost = cost + packaging + fixedFee;
    return {
      sellingPrice: totalCost,
      mlCommission: 0,
      fixedFee,
      shippingFee: 0,
      taxes: 0,
      profit: 0,
      profitMargin: 0,
      isFreeShipping: false,
    };
  }

  const effectiveWeight = getEffectiveWeight(weight, height, width, length);

  if (effectiveWeight > 0) {
    // Weight-based: iterate through price ranges to find stable solution
    const wi = getWeightIndex(effectiveWeight);

    for (let i = 0; i < PRICE_RANGES.length; i++) {
      const [rangeMin, rangeMax] = PRICE_RANGES[i];
      const shipCost = SHIPPING_TABLE[wi][i];
      const calculatedPrice = (cost + packaging + shipCost) / divisor;

      const isLast = i === PRICE_RANGES.length - 1;
      if (calculatedPrice >= rangeMin && (calculatedPrice <= rangeMax || isLast)) {
        const isFreeShipping = calculatedPrice >= ML_THRESHOLD;
        const mlCommission = calculatedPrice * catTaxDec;
        const taxes = calculatedPrice * taxDec;
        const profit = calculatedPrice - cost - mlCommission - shipCost - taxes - packaging;
        const profitMargin = (profit / calculatedPrice) * 100;

        return {
          sellingPrice: calculatedPrice,
          mlCommission,
          fixedFee: isFreeShipping ? 0 : shipCost,
          shippingFee: isFreeShipping ? shipCost : 0,
          taxes,
          profit,
          profitMargin,
          isFreeShipping,
        };
      }
    }

    // Fallback: use last range
    const shipCost = SHIPPING_TABLE[wi][PRICE_RANGES.length - 1];
    const calculatedPrice = (cost + packaging + shipCost) / divisor;
    const isFreeShipping = calculatedPrice >= ML_THRESHOLD;
    const mlCommission = calculatedPrice * catTaxDec;
    const taxes = calculatedPrice * taxDec;
    const profit = calculatedPrice - cost - mlCommission - shipCost - taxes - packaging;
    const profitMargin = (profit / calculatedPrice) * 100;

    return {
      sellingPrice: calculatedPrice,
      mlCommission,
      fixedFee: isFreeShipping ? 0 : shipCost,
      shippingFee: isFreeShipping ? shipCost : 0,
      taxes, profit, profitMargin, isFreeShipping,
    };
  }

  // Fallback: manual fixedFee / shippingFee (weight = 0)
  const priceBelow79 = (cost + packaging + fixedFee) / divisor;
  const priceAbove79 = (cost + packaging + shippingFee) / divisor;

  let sellingPrice: number;
  let isFreeShipping: boolean;
  let finalFixedFee: number;
  let finalShippingFee: number;

  if (priceBelow79 < ML_THRESHOLD) {
    sellingPrice = priceBelow79;
    isFreeShipping = false;
    finalFixedFee = fixedFee;
    finalShippingFee = 0;
  } else {
    sellingPrice = priceAbove79;
    isFreeShipping = true;
    finalFixedFee = 0;
    finalShippingFee = shippingFee;
  }

  const mlCommission = sellingPrice * catTaxDec;
  const taxes = sellingPrice * taxDec;
  const profit = sellingPrice - cost - mlCommission - finalFixedFee - finalShippingFee - taxes - packaging;
  const profitMargin = (profit / sellingPrice) * 100;

  return {
    sellingPrice, mlCommission,
    fixedFee: finalFixedFee, shippingFee: finalShippingFee,
    taxes, profit, profitMargin, isFreeShipping,
  };
}

export function calculateCurrentMargin(product: Product, currentPrice: number): PricingResult {
  const {
    cost, categoryTax, taxPercentage, packaging,
    fixedFee, shippingFee,
    weight, height, width, length,
  } = product;

  const effectiveWeight = getEffectiveWeight(weight, height, width, length);
  const isFreeShipping = currentPrice >= ML_THRESHOLD;

  let finalShippingCost: number;

  if (effectiveWeight > 0) {
    finalShippingCost = getShippingCost(effectiveWeight, currentPrice);
  } else {
    finalShippingCost = isFreeShipping ? shippingFee : fixedFee;
  }

  const catTaxDec = categoryTax / 100;
  const taxDec = taxPercentage / 100;

  const mlCommission = currentPrice * catTaxDec;
  const taxes = currentPrice * taxDec;
  const profit = currentPrice - cost - mlCommission - finalShippingCost - taxes - packaging;
  const profitMargin = (profit / currentPrice) * 100;

  return {
    sellingPrice: currentPrice,
    mlCommission,
    fixedFee: isFreeShipping ? 0 : finalShippingCost,
    shippingFee: isFreeShipping ? finalShippingCost : 0,
    taxes,
    profit,
    profitMargin,
    isFreeShipping,
  };
}
