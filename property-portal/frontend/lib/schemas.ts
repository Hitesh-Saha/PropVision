import { z } from "zod";

export const PropertyFeaturesSchema = z.object({
  square_footage: z.number().gt(0, "Square footage must be greater than 0"),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or greater"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or greater"),
  year_built: z
    .number()
    .min(1800, "Year must be at least 1800")
    .max(new Date().getFullYear() + 1, `Year cannot be after ${new Date().getFullYear() + 1}`),
  lot_size: z.number().min(0, "Lot size must be 0 or greater"),
  distance_to_city_center: z.number().min(0, "Distance must be 0 or greater"),
  school_rating: z.number().min(0, "School rating must be at least 0").max(10, "School rating cannot exceed 10"),
});

export type PropertyFeatures = z.infer<typeof PropertyFeaturesSchema>;

export const EstimateResponseSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  price: z.number(),
  features: PropertyFeaturesSchema,
});

export type EstimateResponse = z.infer<typeof EstimateResponseSchema>;

export const HistoryItemSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  price: z.number(),
  features: PropertyFeaturesSchema,
});

export type HistoryItem = z.infer<typeof HistoryItemSchema>;

export const HistoryResponseSchema = z.object({
  items: z.array(HistoryItemSchema),
  count: z.number(),
});

export type HistoryResponse = z.infer<typeof HistoryResponseSchema>;

export const MarketSummarySchema = z.object({
  total_estimates: z.number(),
  avg_price: z.number().nullable(),
  min_price: z.number().nullable(),
  max_price: z.number().nullable(),
});

export type MarketSummary = z.infer<typeof MarketSummarySchema>;

export const MarketByBedroomsSchema = z.object({
  bedrooms: z.number(),
  avg_price: z.number(),
});

export type MarketByBedrooms = z.infer<typeof MarketByBedroomsSchema>;

export const MarketDataResponseSchema = z.object({
  summary: MarketSummarySchema,
  by_bedrooms: z.array(MarketByBedroomsSchema),
  recent_estimates: z.array(HistoryItemSchema),
});

export type MarketDataResponse = z.infer<typeof MarketDataResponseSchema>;

export const BulkEstimateResponseSchema = z.object({
  items: z.array(EstimateResponseSchema),
  count: z.number(),
});

export type BulkEstimateResponse = z.infer<typeof BulkEstimateResponseSchema>;
