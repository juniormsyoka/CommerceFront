import React from "react";
import { CartItem } from "../../types/types";
import { Button } from "./Button";

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, quantity: number) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onRemove,
  onUpdate,
}) => (
  <div className="flex justify-between items-center border-b py-3">
    <div className="flex items-center gap-3">
      <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
      <div>
        <h4 className="font-semibold">{item.product.name}</h4>
        <p className="text-sm text-gray-600">${item.product.price}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
  <input
    type="number"
    min="1"
    value={item.quantity}
    onChange={(e) => onUpdate(item.product.id, Number(e.target.value))} 
    className="w-14 border rounded px-2"
  />
  <Button
    variant="danger"
    onClick={() => onRemove(item.product.id)} // now string
  >
    Remove
  </Button>
</div>

  </div>
);
