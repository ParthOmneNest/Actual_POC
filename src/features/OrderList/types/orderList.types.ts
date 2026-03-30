export interface OrderResponse {
    orders: Order[];
    totalOrderCount: number;
}

export interface Order {
    scripId: string;
    transactionType: "Buy" | "Sell";
    exchangeSegment: string;
    exchange: string;
    tradingSymbol: string;
    nestOrderNumber: number;
    gtcGtdTriggerId: string;
    sipSequenceNumber: string;
    sipIndicator: string;
    gtcGtdIndicator: string;
    advOrderIndicator: string;
    price: number;
    triggerPrice: number;
    totalQuantity: number;
    scripName: string;
    orderStatus: string;
    bffOrderStatus: string;
    rejectionReason: string;
    scripToken: string;
    filledQuantity: number;
    pendingQuantity: number;
    productCode: "NRML" | "MIS" | "CNC";
    averagePrice: number;
    decimalPrecision: number;
    exchangeOrderNumber: number | string;
    orderedTime: string;
    orderPriceType: "Limit" | "Market" | "SL" | "SL-M";
    orderAuthStatus: string;
    warningText: string;
    childOrders: Order[];
    lotSize: number;
    remarks: string;
    afterMarketOrderFlag: boolean;
    retentionType: string;
    segmentIndicator: string;
    isReplaceable: boolean;
    companyName: string;
    assetCode: string;
}

export interface OrderListPayload {
    filterOn: string[];
    sortOn: string[];
}
