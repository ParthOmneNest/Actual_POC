import { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (val: string) => void;
    label?: string;
    error?: string;
}

export const Dropdown = ({ options, value, onChange, label, error }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-1 w-full" ref={containerRef}>
            {label && (
                <label className="font-inter font-medium text-sm leading-none tracking-normal text-[#555555]">
                    {label}
                </label>
            )}
            <div className="relative h-12">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full h-full flex items-center justify-between px-4 bg-white border rounded-lg text-left text-sm font-semibold transition-colors ${
                        error ? "border-[#CA3521]" : "border-gray-200 hover:border-gray-300"
                    } ${isOpen ? "border-[#0F62FE]!" : ""}`}
                >
                    <span className="text-[#2A2A2B]">{selectedOption?.label}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                                    value === option.value ? "text-[#0F62FE] font-bold bg-[#F5F8FF]" : "text-[#464646]"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-[#CA3521] font-inter font-medium text-[12px] mt-1">
                    {error}
                </p>
            )}
        </div>
    );
};
