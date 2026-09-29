import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMarketData,
  getHistory,
  estimateProperty,
  bulkEstimateProperty,
} from "@/lib/api";
import { PropertyFeatures } from "@/lib/schemas";

export const useMarketData = () => {
  return useQuery({
    queryKey: ["marketData"],
    queryFn: getMarketData,
  });
};

export const useHistory = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });
};

export const useEstimateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (features: PropertyFeatures) => estimateProperty(features),
    onSuccess: () => {
      // Invalidate market data and history because a new estimate was added
      queryClient.invalidateQueries({ queryKey: ["marketData"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};

export const useBulkEstimateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (featuresList: PropertyFeatures[]) => bulkEstimateProperty(featuresList),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketData"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};
