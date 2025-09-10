import React from "react";

interface AlertProps {
  type?: "success" | "error" | "info";
  message: string;
  action?: React.ReactNode; 
}

export const Alert: React.FC<AlertProps> = ({ type = "info", message }) => {
  const styles = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`p-3 rounded-md text-sm ${styles[type]}`}>
      {message}
    </div>
  );
};
