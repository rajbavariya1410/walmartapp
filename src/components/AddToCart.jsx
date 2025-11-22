import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Swal from "sweetalert2";
import NavbarApp from "./NavbarApp";
import FooterApp from "./FooterApp";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Item will be removed from cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id);
        Swal.fire("Removed!", "Item deleted from cart.", "success");
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will empty your entire cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Clear",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire("Cleared!", "Your cart is now empty.", "success");
      }
    });
  };

  const handleCheckout = () => {

    if (cartItems.length === 0) {
      Swal.fire("Empty!", "Your cart is empty!", "info");
      return;
    }

    navigate("/checkout", { state: { cartItems } });
  };


  const subtotal = cartItems.reduce(
    (t, i) => t + Number(i.price) * Number(i.quantity || 1),
    0
  );

  const shipping = cartItems.length > 0 ? 5 : 0;

  const total = subtotal + shipping;

  return (
    <>
      <NavbarApp />

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <section className="md:col-span-2 bg-white rounded shadow p-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-10 text-lg">
                Your cart is empty
              </p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-4 items-center border-b pb-3"
                  >
                    <div className="w-24 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={item.prophoto} alt="" className="w-full" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {item.proname}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.prodetail}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-800">
                            ${item.price}
                          </div>
                          <div className="text-sm text-gray-500">each</div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 border rounded text-gray-600 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <FaMinus />
                          </button>

                          <div className="px-3">{item.quantity}</div>

                          <button
                            className="p-2 border rounded text-gray-600 hover:bg-gray-100"
                            onClick={() => updateQuantity(item.id, +1)}
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <button
                          className="text-red-600 hover:text-red-800 flex items-center gap-2"
                          onClick={() => deleteItem(item.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>

            <div className="mt-3 pt-3 border-t flex justify-between">
              <div>Total</div>
              <div className="text-xl font-semibold">${total}</div>
            </div>

            <button
              className="w-full mt-4 bg-green-600 text-white py-2 rounded"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <button
              className="w-full mt-2 bg-red-100 text-red-700 py-2 rounded"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
          </aside>

        </div>
      </main>

      <FooterApp />
    </>
  );
}
