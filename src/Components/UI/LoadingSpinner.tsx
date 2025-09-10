import React from "react";

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-40">
    <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);
