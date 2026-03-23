import { useState, useEffect } from 'react';
import { Tabs } from '../shared/components/Tabs';
import { SearchBar } from '../shared/components/SearchBar';
import { VirtualList } from '../shared/components/VirtualList';
import { OrderModal } from './Order/components/OrderModal';
import { dummyWatchlists } from '../utils/dummyData';
import type { Stock } from '../utils/dummyData';

export const WatchlistPanel = () => {
    const [activeWatchlistId, setActiveWatchlistId] = useState(dummyWatchlists[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [windowHeight, setWindowHeight] = useState(window.innerHeight - 150); 
    
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight - 150);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const activeWatchlist = dummyWatchlists.find(w => w.id === activeWatchlistId) || dummyWatchlists[0];

    const filteredStocks = activeWatchlist.stocks.filter(stock => {
        const query = searchQuery.trim().toLowerCase();
        // Do not filter until the user has typed at least 3 characters
        if (query.length > 0 && query.length < 3) {
            return true; 
        }
        return stock.name.toLowerCase().includes(query) || 
               stock.symbol.toLowerCase().includes(query);
    });

    const renderStockItem = (stock: Stock) => {
        const isPositive = stock.change >= 0;
        return (
            <div 
                onClick={() => setSelectedStock(stock)}
                className="flex justify-between items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors h-[60px] cursor-pointer"
            >
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#2A2A2B]">{stock.symbol}</span>
                    <span className="text-xs text-gray-500">{stock.name}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`font-semibold text-sm ${isPositive ? 'text-[#198055]' : 'text-[#CA3521]'}`}>
                        {stock.price.toFixed(2)}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${isPositive ? 'text-[#198055]' : 'text-[#CA3521]'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full md:w-80 h-full flex flex-col bg-white border-r border-[#ECEDEE] shadow-sm">
            
            {/* 1. Header & Tabs */}
            <div className="pt-2 shrink-0">
                <Tabs defaultValue={activeWatchlistId} onChange={setActiveWatchlistId}>
                    <Tabs.List className="px-2">
                        {dummyWatchlists.map(wl => (
                            <Tabs.Tab key={wl.id} value={wl.id}>
                                {wl.name}
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs>
            </div>

            {/* 2. Reusable Search Bar */}
            <div className="p-3 border-b border-[#ECEDEE] shrink-0">
                <SearchBar 
                    value={searchQuery} 
                    onChange={setSearchQuery} 
                    placeholder="Search stocks & options" 
                />
            </div>

            {/* 3. Virtualized / Normal Stock List */}
            <div className="flex-1 overflow-hidden bg-white">
                {filteredStocks.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No stocks found.</div>
                ) : (
                    <VirtualList
                        data={filteredStocks}
                        renderItem={renderStockItem}
                        itemHeight={60} 
                        windowHeight={windowHeight} 
                        overscan={5}
                    />
                )}
            </div>

            <OrderModal 
                isOpen={!!selectedStock} 
                onClose={() => setSelectedStock(null)} 
                stock={selectedStock} 
            />
            
        </div>
    );
};
