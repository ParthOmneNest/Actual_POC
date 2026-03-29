import { create } from 'zustand';

// The shape of the nested JSON from the API
export interface OrderMasterData {
  [productType: string]: {
    [exchange: string]: string[]; // array of segments (e.g., ["Equity", "F/O"])
  }
}

// User-selected form values
export interface OrderFormState {
  productType: string;
  exchange: string;
  segment: string;
  quantity: string;
  price: string;
  tradeType: string; // Delivery, Intraday
  orderType: string; // Limit, Market
}

interface OrderStore {
  // Config Data
  masterData: OrderMasterData | null;
  setMasterData: (data: OrderMasterData) => void;

  // Selected Data
  formState: OrderFormState;
  
  // Actions
  setField: (field: keyof OrderFormState, value: string) => void;
  resetForm: () => void;
}

const initialState: OrderFormState = {
  productType: '',
  exchange: '',
  segment: '',
  quantity: '',
  price: '',
  tradeType: 'Delivery',
  orderType: 'Limit',
};

export const useOrderStore = create<OrderStore>((set) => ({
  masterData: null,
  setMasterData: (data) => set({ masterData: data }),
  
  formState: initialState,
  
  setField: (field, value) => set((state) => {
    const newState = { ...state.formState, [field]: value };
    
    // Auto-reset dependent child fields when a parent field changes
    if (field === 'productType') {
      newState.exchange = ''; // Reset exchange and segment when product changes
      newState.segment = '';
    }
    if (field === 'exchange') {
      newState.segment = ''; // Reset segment when exchange changes
    }

    return { formState: newState };
  }),
  
  resetForm: () => set({ formState: initialState })
}));
