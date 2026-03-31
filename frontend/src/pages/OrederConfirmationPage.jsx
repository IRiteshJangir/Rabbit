import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slice/cartSlice";
import { useEffect } from "react";

const OrederConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout, loading } = useSelector((state) => state.checkout);

  console.log("Checkout State in Confirmation Page:", checkout);
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  }, [checkout, dispatch]);
  if (loading) return <div>Processing Order...</div>;

  if (!checkout) {
    return (
      <div className="text-center p-10">
        <p>No order found.</p>
        <button onClick={() => navigate("/my-order")}>View Orders</button>
      </div>
    );
  }
  const calculatedEstimatedDeliver = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Than You for Your Order!
      </h1>

      {checkout && (
        <div className="p-6  rounded-lg border ">
          <div className="flex justify-between mb-20">
            {/* order Id and Date */}
            <div>
              <h2 className="text-xl font-semibold">
                OrderId : {checkout._id}
              </h2>
              <p className="text-gray-500 ">
                Order Date : {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery  */}
            <div>
              <p className="text-emerald-700 text-sm ">
                Estimated Delivery :{" "}
                {calculatedEstimatedDeliver(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* order items */}
          <div className="mb-20">
            {checkout.orderItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="">
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md ">${item.price}</p>
                  <p className="text-sm text-gray-500"> Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* payment and deiver info */}
          <div className="grid grid-cols-2 gap-8 ">
            {/* payment info */}
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">PayPal</p>
            </div>
            {/* Delivery info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrederConfirmationPage;
