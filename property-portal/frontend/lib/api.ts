import axios from "axios";
import {
  PropertyFeatures,
  EstimateResponse,
  HistoryResponse,
  MarketDataResponse,
  BulkEstimateResponse,
} from "@/lib/schemas";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, "") + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const estimateProperty = async (
  features: PropertyFeatures
): Promise<EstimateResponse> => {
  const { data } = await api.post<EstimateResponse>("/estimate", features);
  return data;
};

export const getHistory = async (): Promise<HistoryResponse> => {
  const { data } = await api.get<HistoryResponse>("/history");
  return data;
};

export const getMarketData = async (): Promise<MarketDataResponse> => {
  const { data } = await api.get<MarketDataResponse>("/market-data");
  return data;
};

export const bulkEstimateProperty = async (
  featuresList: PropertyFeatures[]
): Promise<BulkEstimateResponse> => {
  const { data } = await api.post<BulkEstimateResponse>("/bulk-estimate", featuresList);
  return data;
};

export default api;
