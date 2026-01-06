"use client";
import {
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  FaMinus,
  FaPlus,
  FaTrash,
} from 'react-icons/fa';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const CartItem = memo(({ item, onQuantityChange, onRemove }) => {
  const productId = item.productId?._id || item.productId || item._id;

  return (
    <div className="flex justify-between items-center border-b pb-4">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">₹{item.price} each</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(productId, item.qty - 1)}
            className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            disabled={item.qty <= 1}
          >
            <FaMinus size={12} />
          </button>
          <span className="w-8 text-center">{item.qty}</span>
          <button
            onClick={() => onQuantityChange(productId, item.qty + 1)}
            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            <FaPlus size={12} />
          </button>
        </div>
        <div className="font-bold w-20 text-right">
          ₹{item.price * item.qty}
        </div>
        <button
          onClick={() => onRemove(productId)}
          className="text-red-600 hover:text-red-800 p-2"
          title="Remove item"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
});

CartItem.displayName = "CartItem";

export default function CartPage() {
  const {
    cart,
    subTotal,
    gst,
    total,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePayment = useCallback(async () => {
    if (!user) {
      alert("Please login to proceed with payment");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-order`, {
        method: "POST",
        credentials: "include",
      });
      const { orderId, amount, currency } = await response.json();

      const options = {
        key: process.env.NEXT_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: "My Shop",
        description: "Purchase from My Shop",
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              alert("Payment successful!");
              clearCart();
            } else {
              alert("Payment verification failed");
            }
          } catch (error) {
            alert("Payment verification error");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  }, [user, clearCart]);

  const handleQuantityChange = useCallback(
    (productId, newQty) => {
      if (newQty < 1) return;
      updateCartItem(productId, newQty);
    },
    [updateCartItem]
  );

  const handleRemoveItem = useCallback(
    (productId) => {
      if (confirm("Are you sure you want to remove this item?")) {
        removeFromCart(productId);
      }
    },
    [removeFromCart]
  );

  const totals = useMemo(
    () => ({
      subTotal: subTotal.toFixed(2),
      gst: gst.toFixed(2),
      total: total.toFixed(2),
    }),
    [subTotal, gst, total]
  );

  if (cart.length === 0)
    return <div className="text-center py-10">Your cart is empty.</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.map((item, index) => {
          const productId = item.productId?._id || item.productId || item._id;
          return (
            <CartItem
              key={productId || index}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          );
        })}
      </div>
      <div className="mt-6 border-t pt-4 space-y-2 text-right">
        <div className="text-gray-600">Subtotal: ₹{totals.subTotal}</div>
        <div className="text-gray-600">GST (18%): ₹{totals.gst}</div>
        <div className="text-2xl font-bold text-gray-900">
          Total: ₹{totals.total}
        </div>
        <button
          onClick={handlePayment}
          disabled={loading || cart.length === 0}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
