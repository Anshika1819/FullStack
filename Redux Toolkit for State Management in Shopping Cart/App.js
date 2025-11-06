import React from 'react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';

export default function App() {
  return (
    <div>
      <h1>Redux Toolkit Shopping Cart</h1>
      <ProductList />
      <Cart />
    </div>
  );
}
