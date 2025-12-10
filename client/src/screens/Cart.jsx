import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/cartContext'

const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold mb-4 text-white">Your Cart is Empty</h2>
        <p className="text-gray-300 mb-8">Add some products to your cart!</p>
        <Link 
          to="/products" 
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors text-white"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Shopping Cart</h2>
        <button
          onClick={clearCart}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-white"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="flex items-center space-x-6">
              <img 
                src={item.images ? item.images[0] : 'https://via.placeholder.com/80'} 
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-blue-300">${item.price}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="bg-gray-600 hover:bg-gray-700 w-8 h-8 rounded-full text-white"
                >
                  -
                </button>
                <span className="text-lg w-8 text-center text-white">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="bg-gray-600 hover:bg-gray-700 w-8 h-8 rounded-full text-white"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="text-xl font-semibold text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-400 hover:text-red-300 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <div className="flex justify-between items-center text-2xl font-bold text-white">
          <span>Total:</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
        
        <div className="flex space-x-4 mt-6">
          <Link 
            to="/products" 
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-center py-3 rounded-lg transition-colors text-white"
          >
            Continue Shopping
          </Link>
         <Link to="/checkout" className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg transition-colors text-white text-center">
  Proceed to Checkout
</Link>
        </div>
      </div>
    </div>
  )
}

export default Cart