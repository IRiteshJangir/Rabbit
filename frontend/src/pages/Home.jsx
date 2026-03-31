import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/Products/GenderCollection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeatursSections from "../components/Products/FeatursSections";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { fetchProductByFilters } from "../redux/slice/productSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // fetch product for specifica collection
    dispatch(
      fetchProductByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      }),
    );
    // fetch the best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`,
        );
        // console.log("Best seller response:", response.data);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);
  console.log("Here is the products data:", products);
  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Selllers */}
      <h2 className="text-3xl text-center font-bold  mb-4">Best Seller</h2>
      {bestSellerProduct && bestSellerProduct._id ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">Loading best Seller Products</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeatursSections />
    </div>
  );
};

export default Home;
