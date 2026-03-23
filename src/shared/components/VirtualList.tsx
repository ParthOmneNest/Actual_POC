import React, { useState, useRef } from 'react';

interface VirtualListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  windowHeight: number;
  overscan?: number;
}

export function VirtualList<T>({
  data,
  renderItem,
  itemHeight,
  windowHeight,
  overscan = 5,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = data.length * itemHeight;

  // Handle Scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // SMART VIRTUALIZATION DECISION:
  // If the items can easily fit within the viewing window safely,
  // there is no need to dynamically swap out DOM nodes. Just render normally!
  if (totalHeight <= windowHeight) {
    return (
      <div className="w-full hide-scrollbar overflow-y-auto" style={{ maxHeight: windowHeight }}>
        {data.map((item, index) => renderItem(item, index))}
      </div>
    );
  }

  // VIRTUALIZED RENDERING:
  // Calculate which items should actually be visible in the DOM
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    data.length - 1,
    Math.ceil((scrollTop + windowHeight) / itemHeight) + overscan
  );

  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      item: data[i],
    });
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full hide-scrollbar relative overflow-y-auto"
      style={{ height: windowHeight }}
    >
      {/* Invisible container to force the browser scrollbar to show the correct massive height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: itemHeight,
              transform: `translateY(${index * itemHeight}px)`,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
