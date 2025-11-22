import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import Swal from "sweetalert2";
import NavbarApp from "./NavbarApp";
import FooterApp from "./FooterApp";

export default function Checkout() {
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] };


  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity || 1),
    0
  );

  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const name = useRef("");
  const address = useRef("");
  const city = useRef("");
  const zip = useRef("");

  const navigate = useNavigate();

  // PLACE ORDER
  const placeOrder = (e) => {
    e.preventDefault();

    const AddData = {
      name: name.current.value,
      address: address.current.value,
      city: city.current.value,
      zip: zip.current.value,
    };

    const orderData = {
      items: cartItems,
      subtotal,
      shipping,
      total,
      customer: AddData,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem("orders", JSON.stringify(orderData));

    Swal.fire({
      title: "Order Placed!",
      text: "Your order was placed successfully.",
      icon: "success",
    });

    navigate("/");
  };

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="text-center text-xl mt-10 text-red-500">
        Cart is empty
      </div>
    );
  }

  return (
    <>
      <NavbarApp />

      <div className="bg-gray-50 min-h-screen py-10 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">
          
          {/* LEFT */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FaMapMarkerAlt className="text-sky-500" /> Shipping Details
            </h2>

            <form className="space-y-4" onSubmit={placeOrder}>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  ref={name}
                  required
                  placeholder="Enter Your Name"
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Address
                </label>
                <input
                  type="text"
                  ref={address}
                  required
                  placeholder="Enter Your Address"
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    City
                  </label>
                  <input
                    type="text"
                    ref={city}
                    required
                    placeholder="City"
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    ref={zip}
                    required
                    maxLength={6}
                    placeholder="ZIP Code"
                    className="w-full mt-1 border rounded-lg p-2"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2">
                <FaCreditCard className="text-sky-500" /> Payment Info
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Card Number
                </label>
                <input
                  type="text"
                  maxLength="16"
                  required
                  placeholder="xxxx xxxx xxxx xxxx"
                  className="w-full mt-1 border rounded-lg p-2"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Expiry Date
                  </label>
                  <input
                    type="month"
                    required
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    CVV
                  </label>
                  <input
                    type="text"
                    maxLength="4"
                    required
                    placeholder="123"
                    className="w-full mt-1 border rounded-lg p-2"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-500 text-white py-3 rounded-lg mt-6 font-medium hover:bg-sky-600 transition-all"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* RIGHT : ORDER SUMMARY */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 border-b pb-4">
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <span>{item.proname}</span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>

            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <p className="mt-6 text-gray-500 text-sm">
              Your order will be delivered within 3–5 business days.
            </p>
          </div>

        </div>
      </div>

      <FooterApp />
    </>
  );
}
