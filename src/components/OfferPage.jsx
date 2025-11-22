import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarApp from "./NavbarApp";
import FooterApp from "./FooterApp";

export default function OffersPage() {
    const [offers, setOffers] = useState([]);
    const [allOffers, setAllOffers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //filter map

    const categoryMap = {
        "men's items": ["mens-shirts", "mens-shoes", "mens-watches"],
        "women's items": [
            "womens-dresses",
            "womens-shoes",
            "womens-bags",
            "womens-jewellery",
            "womens-watches"
        ],
        "kid's items": ["tops"],

        electronics: ["smartphones", "laptops"],
        beauty: ["beauty"],
        fragrances: ["fragrances"],
        skincare: ["skincare"],

        grocery: ["groceries"],
        home: ["home-decoration", "furniture"],

        automotive: ["automotive"],
        motorcycle: ["motorcycle"],
        sunglasses: ["sunglasses"],
        lighting: ["lighting"]
    };

    useEffect(() => {
        async function loadData() {
            try {
                // Load all products from DummyJSON
                const res = await axios.get("https://dummyjson.com/products?limit=150");
                const data = res.data.products;

                // Convert DummyJSON fields → Your UI fields
                const mapped = data.map((p) => {
                    const discount = Math.round(Math.random() * 40) + 10; // random 10–50% off
                    return {
                        id: p.id,
                        proname: p.title,
                        prodetail: p.description,
                        prophoto: p.thumbnail,
                        proprice: Math.round(p.price ), // old price
                        pronewprice: Math.round(p.price * (100 - discount) / 100), // new price
                        category: p.category,
                    };
                });

                // Only products where discount is applied
                const discounted = mapped.filter(
                    (item) => item.proprice > item.pronewprice
                );

                setAllOffers(discounted);
                setOffers(discounted);
            } catch (error) {
                console.log("Error loading products");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Filter offers when product selection changes
    useEffect(() => {
        if (!selectedProduct) {
            setOffers(allOffers);
            return;
        }

        const mappedCategories = categoryMap[selectedProduct];
        if (!mappedCategories || !Array.isArray(mappedCategories)) {
            setOffers(allOffers);
            return;
        }

        const filtered = allOffers.filter((item) =>
            mappedCategories.some(cat => item.category.toLowerCase().includes(cat.toLowerCase()))
        );

        setOffers(filtered);
    }, [selectedProduct, allOffers]);

    if (loading)
        return (
            <p className="text-center py-10 text-gray-600">Loading offers...</p>
        );

    return (
        <>
            <NavbarApp />
            <div className="min-h-screen bg-gradient-to-b from-orange-100 via-yellow-50 to-white">

                {/* HEADER */}
                <section className="relative bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-400 text-white rounded-b-[2.5rem] shadow-lg text-center py-12 px-3 sm:py-16 sm:px-4">

                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 sm:mb-3 animate-bounce leading-tight">
                        🎇 New Year Mega Offers 🎆
                    </h1>

                    <p className="text-base sm:text-xl opacity-90 mb-4 sm:mb-6 px-2">
                        Grab up to <span className="font-bold">50% OFF</span> on your favorite products!
                    </p>

                    {/* Soft Glows */}
                    <div className="absolute top-0 left-6 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-300 blur-3xl opacity-30 rounded-full"></div>
                    <div className="absolute bottom-0 right-6 w-28 h-28 sm:w-40 sm:h-40 bg-pink-400 blur-3xl opacity-30 rounded-full"></div>
                </section>

                <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12">

                    {/* FILTER BUTTONS */}
                    <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3 justify-center">

                        {/* ALL PRODUCTS */}
                        <button
                            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors duration-300 ${selectedProduct === ""
                                ? "bg-orange-500 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-100"
                                }`}
                            onClick={() => setSelectedProduct("")}
                        >
                            All Products
                        </button>

                        {/* Dynamic Categories */}
                        {Object.keys(categoryMap).map((category) => (
                            <button
                                key={category}
                                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-colors duration-300 ${selectedProduct === category
                                    ? "bg-orange-500 text-white shadow-md"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-orange-100"
                                    }`}
                                onClick={() => setSelectedProduct(category)}
                            >
                                {categoryMap[category]}
                            </button>
                        ))}
                    </div>

                    {/* SECTION TITLE */}
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-orange-500 to-yellow-300 bg-clip-text text-transparent mb-2">
                        {selectedProduct ? `Offers on ${selectedProduct}` : "All Current Offers"}
                    </h1>

                    <hr className="mb-4 border-yellow-300" />

                    {/* PRODUCT GRID */}
                    {offers.length === 0 ? (
                        <p className="text-center text-gray-600 text-base sm:text-lg">
                            No products on offer right now — check back later 🎁
                        </p>
                    ) : (
                        <div className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        gap-4 sm:gap-5
      ">
                            {offers.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-xl hover:-translate-y-1 border border-gray-100 hover:border-orange-400 transition-all duration-300 flex flex-col"
                                >
                                    {/* PRODUCT IMAGE */}
                                    <div className="relative w-full h-36 sm:h-48 rounded-xl overflow-hidden mb-2 sm:mb-3">
                                        <img
                                            src={item.prophoto}
                                            alt={item.proname}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs px-2 py-1 rounded-full font-semibold">
                                            🔥 {Math.round(((item.proprice - item.pronewprice) / item.proprice) * 100)}% OFF
                                        </span>
                                    </div>

                                    {/* NAME */}
                                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-2">
                                        {item.proname}
                                    </h3>

                                    {/* SHORT DETAIL */}
                                    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-2">
                                        {item.prodetail}
                                    </p>

                                    {/* PRICE + BUTTON */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                                                ${item.proprice}
                                            </span>
                                            <span className="text-base sm:text-lg font-bold text-green-600">
                                                ${item.pronewprice}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/details/${item.id}`)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-300"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            <FooterApp />
        </>
    );
}
