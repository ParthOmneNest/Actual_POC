import type { ChangeEvent } from 'react';

interface QuantityInputProps {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    label?: string;
    error?: string;
}

export const QuantityInput = ({
    value,
    onChange,
    min = 1,
    max = 99999,
    label,
    error
}: QuantityInputProps) => {
    const handleDecrement = () => {
        if (value > min) onChange(value - 1);
    };

    const handleIncrement = () => {
        if (value < max) onChange(value + 1);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= min && val <= max) {
            onChange(val);
        } else if (e.target.value === '') {
            onChange(min);
        }
    };

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                    {label}
                </label>
            )}
            <div className={`flex flex-row items-center border rounded-lg overflow-hidden h-12 transition-colors ${
                error ? "border-[#CA3521]" : "border-gray-200 focus-within:border-[#0F62FE]"
            }`}>
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-4 h-full w-12 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors font-bold cursor-pointer text-lg flex items-center justify-center shrink-0"
                >
                    -
                </button>
                <input
                    type="number"
                    value={value}
                    onChange={handleChange}
                    className="flex-1 w-full text-center font-semibold outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none min-w-0"
                    style={{ MozAppearance: 'textfield' }} // removes arrows in firefox
                />
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="px-4 h-full w-12 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors font-bold cursor-pointer text-lg flex items-center justify-center shrink-0 border-l border-transparent"
                >
                    +
                </button>
            </div>
            {error && (
                <p className="text-[#CA3521] font-inter font-medium text-[12px] mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};
