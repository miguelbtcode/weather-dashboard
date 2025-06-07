import React from "react";

const SmartLayoutGrid = ({ isExpanded, children }) => {
  if (!isExpanded) {
    // Compact layout
    return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">{children.main}</div>
        <div className="space-y-6">{children.sidebar}</div>
      </div>
    );
  }

  // Expanded layout
  return (
    <div className="space-y-8">
      {/* Main content */}
      <div className="grid grid-cols-1 2xl:grid-cols-5 gap-8">
        <div className="2xl:col-span-3 space-y-8">{children.main}</div>
        <div className="2xl:col-span-2 space-y-6">{children.sidebar}</div>
      </div>

      {/* Extended content only in expanded view */}
      {children.extended}
    </div>
  );
};

export default SmartLayoutGrid;
