import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { mergeCart } from "../redux/slice/cartSlice";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { guestId, user, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // GEt redirect parameterand check if it ischeckout or something

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    // 1. ONLY redirect if a user actually exists
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : redirect); // Use 'redirect' instead of "/"
        });
      } else {
        // 2. Use the 'redirect' variable we grabbed from the URL
        navigate(isCheckoutRedirect ? "/checkout" : redirect);
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch, redirect]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("User register :", { name, email, password });
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex">
      <div className=" w-full md:w-1/2  flex col-col justify-center  p-8  md:p-12">
        <form
          onSubmit={handleSubmit}
          action=""
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm "
        >
          <div className="flex  justify-center mb-6">
            <h2 className="text-xl  font-medium">Rabbit</h2>
          </div>
          <h2 className="text-2xl  font-bold text-center mb-6 ">
            Hey There! &#128075;
          </h2>
          <p className="text-center mb-6 ">
            Enter Your username and password to login
          </p>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your email adress"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white  p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading ? "Loading" : "Sign Up"}
          </button>
          <p className="mt-6 text-center text-sm">
            Don't have an account{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center  items-center">
          <img
            src={register}
            alt="Login image"
            className="h-187.5 w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
