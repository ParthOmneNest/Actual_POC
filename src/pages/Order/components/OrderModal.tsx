import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "../../../shared/components/Modal";
import { Tabs } from "../../../shared/components/Tabs";
import { QuantityInput } from "../../../shared/components/QuantityInput";
import { Dropdown } from "../../../shared/components/Dropdown";
import { Input } from "../../../shared/components/Input";

// 1. Zod Schema for the Form
export const orderSchema = z.object({
  action: z.enum(["BUY", "SELL"]),
  exchange: z.enum(["NSE", "BSE"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().optional(),
  orderType: z.enum(["MARKET", "LIMIT"]),
  productType: z.enum(["INTRADAY", "DELIVERY"]),
}).refine((data) => {
  if (data.orderType === "LIMIT") {
    return data.price !== undefined && data.price > 0;
  }
  return true;
}, {
  message: "Price required for Limit",
  path: ["price"],
});

export type OrderFormData = z.infer<typeof orderSchema>;

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: {
    symbol: string;
    name: string;
    priceNSE: number;
    priceBSE: number;
  } | null;
}

export const OrderModal = ({ isOpen, onClose, stock }: OrderModalProps) => {
  // 2. React Hook Form Initialization
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      action: "BUY",
      exchange: "NSE",
      quantity: 1,
      orderType: "MARKET",
      productType: "DELIVERY",
    },
  });

  const currentAction = watch("action");
  const currentExchange = watch("exchange");
  const currentOrderType = watch("orderType");

  // Sync the form price with the live stock price if Market is selected
  useEffect(() => {
    if (currentOrderType === "MARKET" && stock) {
        setValue("price", currentExchange === "NSE" ? stock.priceNSE : stock.priceBSE);
    }
  }, [currentOrderType, currentExchange, stock, setValue]);

  // Reset form when modal opens with a new stock
  useEffect(() => {
    if (isOpen) {
      reset({ 
          action: "BUY", 
          exchange: "NSE", 
          quantity: 1, 
          orderType: "MARKET", 
          productType: "DELIVERY" 
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: OrderFormData) => {
    console.log("Order Submitted: ", data);
    // Submit logic here
  };

  if (!stock) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col gap-4 border-b border-[#ECEDEE] pb-4 -mt-2">
          
          {/* Row 1: Stock Name & Buy/Sell Toggle */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-[#2A2A2B]">{stock.symbol}</h2>
              <span className="text-xs text-gray-500">{stock.name}</span>
            </div>

            {/* Reusable Tab Component for Buy/Sell Toggle */}
            <div className="w-40">
              <Controller
                control={control}
                name="action"
                render={({ field }) => (
                  <Tabs defaultValue={field.value} onChange={field.onChange}>
                    <Tabs.List className="border-b-0 space-x-1">
                      <Tabs.Tab value="BUY">BUY</Tabs.Tab>
                      <Tabs.Tab value="SELL">SELL</Tabs.Tab>
                    </Tabs.List>
                  </Tabs>
                )}
              />
            </div>
          </div>

          {/* Row 2: Exchange Selection (Radio Buttons) */}
          <div className="flex flex-row items-center gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                value="NSE"
                checked={currentExchange === "NSE"}
                onChange={() => setValue("exchange", "NSE")}
                className="w-4 h-4 text-[#0F62FE] border-gray-300 focus:ring-[#0F62FE]"
              />
              <span className={`text-sm font-semibold transition-colors ${currentExchange === "NSE" ? "text-[#2A2A2B]" : "text-gray-500 group-hover:text-gray-700"}`}>
                NSE <span className="font-normal border rounded px-1 ml-1 bg-gray-50">{stock.priceNSE.toFixed(2)}</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                value="BSE"
                checked={currentExchange === "BSE"}
                onChange={() => setValue("exchange", "BSE")}
                className="w-4 h-4 text-[#0F62FE] border-gray-300 focus:ring-[#0F62FE]"
              />
              <span className={`text-sm font-semibold transition-colors ${currentExchange === "BSE" ? "text-[#2A2A2B]" : "text-gray-500 group-hover:text-gray-700"}`}>
                BSE <span className="font-normal border rounded px-1 ml-1 bg-gray-50">{stock.priceBSE.toFixed(2)}</span>
              </span>
            </label>
          </div>

        </div>
        {/* --- END HEADER SECTION --- */}

        {/* --- MAIN BODY SECTION --- */}
        <div className="flex flex-col gap-5 pt-2">
            
            {/* Row 1: Quantity and Price */}
            <div className="flex flex-row gap-4">
               <Controller
                 control={control}
                 name="quantity"
                 render={({ field }) => (
                     <QuantityInput 
                        label="Qty." 
                        value={field.value} 
                        onChange={field.onChange} 
                        error={errors.quantity?.message} 
                     />
                 )}
               />

               <Controller
                 control={control}
                 name="price"
                 render={({ field }) => (
                     <Input 
                        type="number"
                        label="Price"
                        value={field.value || ''}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            field.onChange(isNaN(val) ? undefined : val);
                        }}
                        disabled={currentOrderType === "MARKET"}
                        error={errors.price?.message}
                        className={currentOrderType === "MARKET" ? "bg-gray-50 text-gray-500" : ""}
                     />
                 )}
               />
            </div>

            {/* Row 2: Order Type and Product Type */}
            <div className="flex flex-row gap-4">
               <Controller
                 control={control}
                 name="orderType"
                 render={({ field }) => (
                     <Dropdown 
                         label="Order Type"
                         value={field.value}
                         onChange={field.onChange}
                         options={[
                             { label: "Market", value: "MARKET" },
                             { label: "Limit", value: "LIMIT" },
                         ]}
                         error={errors.orderType?.message}
                     />
                 )}
               />

               <Controller
                 control={control}
                 name="productType"
                 render={({ field }) => (
                     <Dropdown 
                         label="Product"
                         value={field.value}
                         onChange={field.onChange}
                         options={[
                             { label: "Intraday (MIS)", value: "INTRADAY" },
                             { label: "Delivery (CNC)", value: "DELIVERY" },
                         ]}
                         error={errors.productType?.message}
                     />
                 )}
               />
            </div>

        </div>
        {/* --- END MAIN BODY SECTION --- */}

        {/* Temporary Submit Button for testing */}
        <button
          type="submit"
          className={`w-full py-3 mt-4 text-white font-bold rounded-lg transition-colors ${
             currentAction === 'BUY' ? 'bg-[#0F62FE] hover:bg-[#0353e9]' : 'bg-[#CA3521] hover:bg-[#a62b1b]'
          }`}
        >
          {currentAction} {stock.symbol}
        </button>

      </form>
    </Modal>
  );
};
