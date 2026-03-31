import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPal from "./PayPal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  createCheckout,
  finalizeCheckout,
} from "../../redux/slice/checkoutSlice";
import axios from "axios";

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [checkoutId, setCheckoutId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    Phone: "",
  });

  // ensure cart is loading before processing
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckOut = async (e) => {
    e.preventDefault();

    if (cart && cart.products.length > 0) {
      const response = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "PaYPaL",
          totalPrice: cart.totalPrice,
        }),
      );
      if (response.payload && response.payload._id) {
        setCheckoutId(response.payload._id); // set checkout id if checkout was successfull
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    console.log("payment successful", details);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      await handleFinalizeCheckout(checkoutId); // finalize checkout if payment successfull
    } catch (error) {
      console.error(error);
    }
  };

  // CheckOut.jsx mein function update karein
  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      // Axios ki jagah ye use karein:
      const result = await dispatch(finalizeCheckout(checkoutId));
      console.log("result of checkout id", checkoutId, "and result", result);
      if (finalizeCheckout.fulfilled.match(result)) {
        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error("Finalize Error:", error);
    }
  };
  if (loading) {
    return <p>Loading....</p>;
  }

  if (error) {
    return <p>Error....</p>;
  }

  if (!cart || !cart.products || !cart.products.length === 0) {
    return <p>Your Cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* left section */}
      <div className="bg-white rounded-lg  p-6 ">
        <h2 className="text-2xl uppercase mb-6 ">Checkout</h2>
        <form onSubmit={handleCreateCheckOut} action="" className="">
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2  border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid  grid-cols-2 gap-4 ">
            <div>
              <label className="block text-gray-700">Firs Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4 ">
            <label htmlFor="" className="block text-gray-700 ">
              Address
            </label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 grid  grid-cols-2 gap-4 ">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="mb-4 ">
            <label htmlFor="" className="block text-gray-700 ">
              Country
            </label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4 ">
            <label htmlFor="" className="block text-gray-700 ">
              PhoneNo
            </label>
            <input
              type="tel"
              value={shippingAddress.PhoneNo}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  PhoneNo: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
              >
                Continue to Payment
              </button>
            ) : (
              <div className="">
                <h3 className="text-lg mb-4">Pay with PayPal</h3>
                {/* paypal component */}
                <PayPal
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert("Payment Failed....Try again")}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* right section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t border-gray-300 py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b border-gray-300 "
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md ">{product.name}</h3>
                  <p className="text-gray-500">Size : {product.size}</p>
                  <p className="text-gray-500 whitespace-nowrap">
                    color : {product.color}
                  </p>
                </div>
              </div>
              <p className="text-xl">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>SubTotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 ">
          <p>Total</p>
          <p>${cart.totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
