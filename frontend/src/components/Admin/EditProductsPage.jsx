import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slice/productSlice";
import axios from "axios";
// import { updateProduct } from "../../redux/slice/adminProductSlice";

const EditProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products,
  );
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countingStock: 0,
    sku: "",
    category: "",
    brand: "",
    colors: [],
    sizes: [],
    collections: "",
    materials: "",
    gender: "",
    images: [
      {
        url: "https://picsum.photos/500/500?random=1",
      },
      {
        url: "https://picsum.photos/500/500?random=2",
      },
    ],
  });

  const [upload, setUpload] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUpload(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUpload(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };
  if (loading) {
    return <p>Loading....</p>;
  }

  if (error) {
    return <p>Error...</p>;
  }
  return (
    <div className="max-5xl mx-auto p-6  shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6 ">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label htmlFor="" className="block font-semibold mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md  p-2"
          />
        </div>
        {/* descriptions */}
        <div className="mb-6">
          <label htmlFor="" className="block font-semibold mb-2">
            Descriptions
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>
        {/* Price */}

        <div className="mb-6">
          <label className="block font-semibold mb-2 ">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* count in stock */}

        <div className="mb-6">
          <label className="block font-semibold mb-2 ">Count In Stock</label>
          <input
            type="number"
            name="countingStock"
            value={productData.countingStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* SKU */}

        <div className="mb-6">
          <label className="block font-semibold mb-2 ">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* size */}

        <div className="mb-6">
          <label className="block font-semibold mb-2 ">
            Size (comma-seperated)
          </label>
          <input
            type="text"
            name="size"
            value={productData.sizes.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Colors */}

        <div className="mb-6">
          <label className="block font-semibold mb-2 ">
            Colors (comma-seperated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* images */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {upload && <p>Uploading an Image</p>}
          <div className="flex gap-4 mt-4 ">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductsPage;
