import { portfolioData } from "./data/portfolioData";

export const Portfolio=()=>{
    return(
        <div className="flex justify-center items-center w-full h-full bg-black/80">
            <div className="flex flex-col w-full h-full ">
            
            {/* header */}
            <div className="flex justify-between items-center w-full h-16 bg-black/20">
                {/* logo name */}
                <h2 className="text-white pl-5">OmneNEST</h2>

                {/* lists in header */}
                <div className="flex flex-row gap-4 cursor-pointer">
                    <span className="text-white hover:border-b-2 hover:border-white">Dashboard</span>
                    <span className="text-white hover:border-b-2 hover:border-white">Portfolio</span>
                    <span className="text-white hover:border-b-2 hover:border-white">Orders</span>
                    <span className="text-white hover:border-b-2 hover:border-white">Alerts</span>
                    <span className="text-white hover:border-b-2 hover:border-white">Settings</span>
                </div>

                {/* user profile */}
                <div className="flex flex-row gap-2">
                    <span className="rounded-full bg-blue-500 text-white w-8 h-8 flex items-center justify-center">AM</span>
                    <div className="flex flex-col">
                        <h3 className="text-white">Total Amount</h3>
                        <h2 className="text-white">$100000</h2>
                    </div>
                </div>
            </div>

            {/* holdings list */}
            <div className="m-3 p-3 border-2 border-white">
                <h2 className="text-white">Portfolio Holdings</h2>
                <div className="w-full h-full">
                    <div className="flex items-center bg-gray-500 px-2 py-1 m-2">
                        <h2 className="text-white w-1/2">ASSET</h2>
                        <h2 className="text-white w-1/4">TOTAL</h2>
                        <h2 className="text-white w-1/4 text-right">VALUE</h2>
                    </div>
                    {portfolioData.map((data)=>(
                        <div key={data.symbol} className="flex items-center border-b-2 border-gray-500 px-2 py-1 m-2">
                            <div className="flex gap-2 w-1/2">
                                <h4 className="font-medium text-white">{data.name}</h4>
                                <h4 className="text-gray-400 font-light">{data.symbol}</h4>
                            </div>
                            <h3 className="text-white w-1/4">{data.total}</h3>
                            <h4 className="text-white w-1/4 text-right">{data.value}</h4>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="w-full h-full flex justify-end items-center p-5  gap-2 ">
                <button className="text-white px-4 py-2 m-2 rounded-lg border-2 hover:text-gray-300 cursor-pointer">DASHBOARD VIEW</button>
                <button className="text-white px-4 py-2 m-2 rounded-lg border-2 hover:text-gray-300 cursor-pointer">VIEW ALL ASSETS</button>
                <button className="text-white px-4 py-2 m-2 rounded-lg border-2 hover:text-gray-300 cursor-pointer">SETTINGS</button>
            </div>
        </div>
    </div>
    )
}