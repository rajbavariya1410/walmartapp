import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

import NavbarApp from "./NavbarApp";
import FooterApp from "./FooterApp";
import { useCart } from "./CartContext"; // ⬅ added

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart(); // ⬅ using context cart
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load product from DummyJSON
  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const p = await res.json();

        const formatted = {
          id: p.id,
          proname: p.title,
          prodetail: p.description,
          price: p.price,
          oldPrice: p.price,
          discountPercentage: p.discountPercentage ?? 20,
          prophoto: p.thumbnail,
        };

        setProduct(formatted);
      } catch (err) {
        console.log("Error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  // Add to cart using React Context (no localStorage)
  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product); // ⬅ add product to global cart

    Swal.fire({
      title: "Added!",
      text: "Item added to cart successfully",
      icon: "success",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Product not found or failed to load.
      </p>
    );
  }

  return (
    <>
      <NavbarApp />

      <div className="container mx-auto mt-6 p-4">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200">

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={product.prophoto}
              alt={product.proname}
              className="rounded-xl w-full max-w-xs sm:max-w-md object-cover shadow-md hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6 flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-bold capitalize mb-2 sm:mb-3 text-gray-800">
              {product.proname}
            </h2>

            <p className="text-gray-600 leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base">
              {product.prodetail}
            </p>

            {/* Prices */}
            <div className="mb-4 sm:mb-5">
              <p className="text-gray-500 line-through text-sm sm:text-lg">
                Old Price: ${product.oldPrice}
              </p>
              <p className="text-green-600 font-bold text-lg sm:text-2xl">
                New Price: ${product.price}
              </p>
              <p className="text-orange-500 font-semibold text-sm sm:text-lg mt-1">
                Discount: {product.discountPercentage}% OFF
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto flex-wrap">
              <button
                onClick={() => navigate("/walmartapp")}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow-md transition-all w-full sm:w-auto"
              >
                Continue Shopping
              </button>

              <button
                onClick={handleAddToCart}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow-md transition-all w-full sm:w-auto"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <FooterApp />
    </>
  );
}
