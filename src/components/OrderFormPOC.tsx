import React from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { useOrderData } from '../hooks/useOrderData';

export const OrderFormPOC = () => {
  // 1. Kick off data fetch (updates store behind the scenes)
  const { isLoading, error } = useOrderData();
  
  // 2. Consume global config and local form state
  const { masterData, formState, setField } = useOrderStore();

  if (isLoading) return <div className="text-white p-4">Loading order configurations...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!masterData) return null;

  // 3. Derived states to conditionally render dropdown options
  const availableProductTypes = Object.keys(masterData);
  
  const availableExchanges = formState.productType 
    ? Object.keys(masterData[formState.productType] || {}) 
    : [];
    
  const availableSegments = (formState.productType && formState.exchange) 
    ? (masterData[formState.productType][formState.exchange] || []) 
    : [];

  const handleSubmit = (type: 'BUY' | 'SELL') => {
    alert(`${type} Order Placed: \n${JSON.stringify(formState, null, 2)}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-black/80 text-white w-full max-w-2xl border-2 border-white rounded-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold">Place Order</h2>

      {/* Row 1: Product Type (Controls Everything Else) */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-300 font-medium text-sm">Product Type</label>
        <select 
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded focus:border-blue-500 outline-none"
          value={formState.productType}
          onChange={(e) => setField('productType', e.target.value)}
        >
          <option value="">-- Select Product --</option>
          {availableProductTypes.map(pt => <option key={pt} value={pt}>{pt}</option>)}
        </select>
      </div>

      {/* Row 2: Exchange and Segment (Derived) */}
      <div className="flex gap-4 w-full">
        <div className="flex flex-col w-1/2 gap-2">
          <label className="text-gray-300 font-medium text-sm">Exchange</label>
          <select 
            className="bg-gray-800 border border-gray-600 text-white p-2 rounded disabled:opacity-50"
            value={formState.exchange}
            onChange={(e) => setField('exchange', e.target.value)}
            disabled={!formState.productType}
          >
            <option value="">-- Select Exchange --</option>
            {availableExchanges.map(ex => <option key={ex} value={ex}>{ex}</option>)}
          </select>
        </div>
        <div className="flex flex-col w-1/2 gap-2">
          <label className="text-gray-300 font-medium text-sm">Segment</label>
          <select 
            className="bg-gray-800 border border-gray-600 text-white p-2 rounded disabled:opacity-50"
            value={formState.segment}
            onChange={(e) => setField('segment', e.target.value)}
            disabled={!formState.exchange}
          >
            <option value="">-- Select Segment --</option>
            {availableSegments.map(seg => <option key={seg} value={seg}>{seg}</option>)}
          </select>
        </div>
      </div>

      {/* Row 3: Trade Type & Order Type */}
      <div className="flex gap-4 w-full">
        <div className="flex flex-col w-1/2 gap-2">
          <label className="text-gray-300 font-medium text-sm">Trade Type</label>
          <select 
            className="bg-gray-800 border border-gray-600 text-white p-2 rounded"
            value={formState.tradeType}
            onChange={(e) => setField('tradeType', e.target.value)}
          >
            <option value="Delivery">Delivery</option>
            <option value="Intraday">Intraday</option>
          </select>
        </div>
        <div className="flex flex-col w-1/2 gap-2">
          <label className="text-gray-300 font-medium text-sm">Order Type</label>
          <select 
            className="bg-gray-800 border border-gray-600 text-white p-2 rounded"
            value={formState.orderType}
            onChange={(e) => setField('orderType', e.target.value)}
          >
            <option value="Limit">Limit</option>
            <option value="Market">Market</option>
          </select>
        </div>
      </div>

      {/* Row 4: Quantity & Price */}
      <div className="flex gap-4 w-full">
         <div className="flex flex-col w-1/2 gap-2">
          <label className="text-gray-300 font-medium text-sm">Quantity</label>
          <input 
            type="number"
            className="bg-gray-800 border border-gray-600 text-white p-2 rounded focus:border-blue-500 outline-none"
            placeholder="0"
            value={formState.quantity}
            onChange={(e) => setField('quantity', e.target.value)}
          />
        </div>
        <div className="flex flex-col w-1/2 gap-2">
          <label className="text-gray-300 font-medium text-sm">Price</label>
          <input 
            type="number"
            className="bg-gray-800 border border-gray-600 text-white p-2 rounded focus:border-blue-500 outline-none disabled:opacity-50"
            placeholder="0.00"
            value={formState.price}
            onChange={(e) => setField('price', e.target.value)}
            disabled={formState.orderType === 'Market'} // Price input disabled for Market orders
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 mt-2 border-t border-gray-700">
        <button 
          className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded font-bold cursor-pointer" 
          onClick={() => handleSubmit('BUY')}
        >
          BUY
        </button>
        <button 
          className="flex-1 bg-red-600 hover:bg-red-700 transition-colors py-3 rounded font-bold cursor-pointer" 
          onClick={() => handleSubmit('SELL')}
        >
          SELL
        </button>
      </div>
    </div>
  );
};
