import React from "react";
import { Button } from "./Button";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalItems,
  totalPrice,
  onCheckout,
}) => (
  <div className="p-4 border-t mt-4">
    <p className="font-semibold">Items: {totalItems}</p>
    <p className="font-semibold">Total: ${totalPrice.toFixed(2)}</p>
    <Button className="w-full mt-3" onClick={onCheckout}>
      Checkout
    </Button>
  </div>
);
