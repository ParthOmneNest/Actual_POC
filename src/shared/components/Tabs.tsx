import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface TabsContextProps {
  active: string;
  setActive: (val: string) => void;
}

const TabsContext = createContext<TabsContextProps>({
  active: '',
  setActive: () => {},
});

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  onChange?: (val: string) => void;
}

export const Tabs = ({ children, defaultValue, onChange }: TabsProps) => {
  const [active, setActiveState] = useState(defaultValue);

  const setActive = (val: string) => {
    setActiveState(val);
    if (onChange) onChange(val);
  };

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="w-full flex-col">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string; // allow overrides
}

Tabs.List = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`flex flex-row border-b border-[#ECEDEE] w-full overflow-x-auto whitespace-nowrap scrollbar-hide ${className}`}>
      {children}
    </div>
  );
};

interface TabsTabProps {
  value: string;
  children: ReactNode;
}

Tabs.Tab = ({ value, children }: TabsTabProps) => {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;

  return (
    <button
      type="button"
      onClick={() => setActive(value)}
      className={`px-4 pb-3 text-sm font-semibold transition-all ${
        isActive
          ? 'border-b-2 text-[#0F62FE] border-[#0F62FE]'
          : 'border-b-2 text-[#555555] border-transparent hover:text-[#0F62FE]'
      }`}
    >
      {children}
    </button>
  );
};

interface TabsPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

Tabs.Panel = ({ value, children, className = '' }: TabsPanelProps) => {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={`w-full h-full ${className}`}>{children}</div>;
};
