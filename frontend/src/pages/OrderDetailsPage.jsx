import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById } from "../redux/slice/oderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  console.log("ordeId :", id);
  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (loading) {
    return <p>Loading....</p>;
  }
  if (error) {
    return <p>Error....</p>;
  }

  return (
    <div className=" max-w-7xl mx-auto p-4 sm:p-6 ">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (
        <p>No ORder Details Found</p>
      ) : (
        <div className="p-4 sm:p-6  rounded-lg border ">
          {/* order info */}
          <div className="flex flex-col  sm:flex-row justify-between mb-8 ">
            <div className="">
              <h3 className="text-lg md:text-xl font-semibold ">
                OrderID: {orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 ">
              <span
                className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid ? "Approved" : "Peding"}
              </span>
              <span
                className={`${orderDetails.isDeliver ? "bg-green-100 text-green-700" : "bg-red-100 text-yellow-700"} px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isDeliver ? "Delivered" : "Delivery Peding"}
              </span>
            </div>
          </div>
          {/* customer payment shipping info */}
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8  mb-8">
            <div className="">
              <h4 className="text-lg font-semibold mb-2 ">Payment Info</h4>
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Status: {orderDetails.isPaid ? "Paid" : "unpaid"}</p>
            </div>

            <div className="">
              <h4 className="text-lg font-semibold mb-2 ">Shipping Info</h4>
              <p>Shipping Method: {orderDetails.shippingMethod}</p>
              <p>
                Address:{" "}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
              </p>
            </div>
          </div>
          {/* product list */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <table className="min-w-full text-gray-600 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Unit Price</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody className="">
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b border-gray-300">
                    <td className="py-2 px-4 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12  object-cover rouned-lg mr-4"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 ">${item.price}</td>
                    <td className="py-2 px-4 ">{item.quantity}</td>
                    <td className="py-2 px-4 ">${item.qty * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* back to order page  */}
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            Back to my order
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
