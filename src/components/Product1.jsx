import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

export default function Product1() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // FETCH ALL 150 PRODUCTS
  useEffect(() => {
    async function loadData() {
      try {
        const res = await axios.get("https://dummyjson.com/products?limit=150");
        const formattedData = res.data.products.map((p) => ({
          id: p.id,
          proname: p.title,
          prodetail: p.description,
          proprice: p.price,
          pronewprice: p.price,
          prophoto: p.thumbnail,
          category: p.category,
        }));

        setData(formattedData);
        setFilteredData(formattedData);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // APPLY SEARCH, SORT, CATEGORY FILTER
  useEffect(() => {
    let products = [...data];

    // SEARCH
    if (search.trim()) {
      products = products.filter(
        (p) =>
          p.proname.toLowerCase().includes(search.toLowerCase()) ||
          p.prodetail.toLowerCase().includes(search.toLowerCase())
      );
    }

    // CATEGORY FILTER
    if (categoryFilter.trim()) {
      products = products.filter((p) => p.category === categoryFilter);
    }

    // SORT
    if (sort === "low-high") {
      products.sort((a, b) => a.proprice - b.proprice);
    } else if (sort === "high-low") {
      products.sort((a, b) => b.proprice - a.proprice);
    }

    setFilteredData(products);
  }, [search, sort, categoryFilter, data]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // GROUP ORIGINAL DATA BY CATEGORY
  const categories = data.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // PRODUCT CARD
  const ProductCard = ({ item }) => (
    <div className="group bg-white rounded-xl p-3 shadow-md hover:shadow-xl 
      hover:-translate-y-1 border border-gray-100 transition-all duration-300 flex flex-col">

      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 bg-gray-50">
        <img
          src={item.prophoto}
          alt={item.proname}
          className="w-full h-full object-cover transform group-hover:scale-105 
          transition-transform duration-500"
        />
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 capitalize">
        {item.proname}
      </h3>

      <p className="text-xs text-gray-500 mb-3 line-clamp-2 capitalize">
        {item.prodetail}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 line-through">
            $
            {item.proprice}
          </span>
          <br />
          <span className="text-lg font-bold text-green-600">
            ${item.pronewprice}
          </span>
        </div>

        <button
          onClick={() => navigate(`/details/${item.id}`)}
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 
          rounded-lg text-sm"
        >
          Details
        </button>
      </div>
    </div>
  );

  // SLIDER
  const Slider = ({ products }) => (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={10}
      breakpoints={{
        0: { slidesPerView: 1.3 },
        480: { slidesPerView: 2 },
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }}
    >
      {products.map((item) => (
        <SwiperSlide key={item.id}>
          <ProductCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  // GRID
  const Grid = ({ products }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {products.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );

  return (
    <>
      {/* 🔍 SEARCH + FILTER + SORT BAR */}
      <div className="p-4 flex flex-col md:flex-row gap-3 items-center">

        <input
          type="text"
          placeholder="Search products..."
          className="border px-3 py-2 rounded-lg w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace("-", " ")}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-lg"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>
      </div>



      {/* CATEGORY SECTIONS */}
      {Object.keys(categories).map((cat) => {
        const products = categories[cat];
        return (
          <div key={cat} className="p-4">
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-b from-blue-500 to-green-500 
                bg-clip-text text-transparent mb-2 capitalize">
              {cat.replace("-", " ")} : {products.length}
            </h1>

            <hr className="mb-4 w-24" />

            {products.length > 5 ? (
              <Slider products={products} />
            ) : (
              <Grid products={products} />
            )}
          </div>
        );
      })}
    </>
  );
}
