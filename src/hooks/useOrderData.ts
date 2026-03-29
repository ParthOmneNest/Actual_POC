import { useState, useEffect } from 'react';
import axios from 'axios';
import { useOrderStore, type OrderMasterData } from '../store/useOrderStore';

// In a real app, this URL would be your actual endpoint
const DUMMY_API_URL = 'https://run.mocky.io/v3/fake-endpoint-string';

// We simulate the API response here since we don't have a real endpoint.
// This matches your example: hierarchical nesting of Product -> Exchange -> Segment
const DUMMY_RESPONSE: OrderMasterData = {
  "NRML": {
    "NSE": ["Equity", "F/O", "Currency"],
    "BSE": ["Equity", "F/O"],
    "MCX": ["Commodity"]
  },
  "SPREAD": {
    "NSE": ["F/O", "Currency"],
    "BSE": ["F/O"]
  }
};

export const useOrderData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setMasterData = useOrderStore(state => state.setMasterData);

  const fetchMasterData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Typically, you'd do:
      // const response = await axios.get<OrderMasterData>(DUMMY_API_URL);
      // setMasterData(response.data);
      
      // Simulating a network delay with a Promise:
      await new Promise(resolve => setTimeout(resolve, 800));
      setMasterData(DUMMY_RESPONSE);
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order configurations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
    // Intentionally empty dependency array to only fetch configs once on mount
  }, []);

  return { isLoading, error, refetch: fetchMasterData };
};
