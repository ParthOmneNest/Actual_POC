import { useTickerPolling } from "../hooks/useTickerPolling";
import { useMarketStore } from "../store/useMarketStore";

export const Ticker: React.FC = () => {
    useTickerPolling();

    const tickers = useMarketStore((state) => state.tickers);

    return (
        <div className="fixed flex justify-center items-center p-4 w-full h-full ">
            <div className="relative w-150 h-100 border-2 bg-gray-300">
                <div className="bg-gray-100 w-145 h-90 overflow-y-auto overscroll-contain rounded-2xl m-3">
                    <div className="sticky flex justify-around text-center ">
                        <h3 className="w-1/3 ">Price</h3>
                        <h3 className="w-1/3 ">Amount</h3>
                        <h3 className="w-1/3 ">Total</h3>
                    </div>
                    {tickers.map((ticker, idx) => {
                        const isNegative = ticker.lastDirection;

                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-around px-4 py-2 "
                            >
                                <div className="w-1/3">{ticker.price.toFixed(2)}</div>
                                <div
                                    className={`${isNegative === "down" ? "bg-red-400" : isNegative === "up" ? "bg-green-300" : "bg-gray-400"} flex justify-center w-1/3`}
                                >
                                    {ticker.amount}
                                </div>
                                <div
                                    className={`${isNegative === "down" ? "bg-red-400" : isNegative === "up" ? "bg-green-300" : "bg-gray-400"} flex justify-center w-1/3`}
                                >
                                    {(ticker.price * Math.abs(ticker.amount)).toFixed(2)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <div className="stock-container">
                    <div>
                        <h3>HDFC BANK</h3>
                        <span>NSE</span>
                    </div>
                    <div>
                        <p>1,567.50</p>
                        <p>+0.85%(+13.20)</p>
                    </div>
                </div>
                <div className="stock-container">
                    <div>
                        <h3>HDFC BANK</h3>
                        <span>NSE</span>
                    </div>
                    <div>
                        <p>1,567.50</p>
                        <p>+0.85%(+13.20)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
