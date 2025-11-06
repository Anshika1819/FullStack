import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity, clearCart } from '../features/cart/cartSlice';

export default function Cart() {
  const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {items.map(item => (
        <div key={item.id}>
          <p>{item.name} - ${item.price}</p>
          <input
            type="number"
            value={item.quantity}
            min="1"
            onChange={e => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
          />
          <button onClick={() => dispatch(removeItem(item.id))}>Remove</button>
        </div>
      ))}
      <hr />
      <p>Total Items: {totalQuantity}</p>
      <p>Total Price: ${totalPrice}</p>
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
    </div>
  );
}
