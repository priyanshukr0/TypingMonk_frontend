import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { setUserLogin } from "../redux/slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// axios.defaults.withCredentials = true;

export default () => {

  const userLoggedIn = useSelector(state => state.mainGame.isUserLoggedIn);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const emailRef = useRef(null);
  useEffect(() => {
    if (userLoggedIn) {
      navigate('/');
    } else {
      emailRef.current.focus()
    }
  }, [userLoggedIn])

  async function resendOtp(email) {
    try {
      const response = await axios.post(`${backend_url}/api/auth/resend-otp`, { email: email });
      toast.success(response.data.message);

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }
  }

  const inputHandler = (e) => {
    setLoginData(prev => {
      return ({ ...prev, [e.target.name]: e.target.value })
    })
  }
  async function onLogin(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend_url}/api/auth/login`, loginData, { withCredentials: true });
      toast.success(response.data?.message);
      dispatch(setUserLogin(true));
      navigate('/');

    } catch (error) {
      if (error.response.status === 401) {
        localStorage.setItem('userMail', loginData.email);
        await resendOtp(localStorage.getItem('userMail'));
        navigate('/otp-verification');
        return;
      }
      toast.error(error.response.data?.message || 'An error occurred');
      return;
    }
  }
  return (

    <main className="w-full custom-height flex flex-col items-center  bg-gray-50 dark:bg-slate-800 justify-center sm:px-4">
      <div className="sm:max-w-lg  w-full text-gray-600  rounded-lg   ">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 dark:text-gray-100 text-2xl font-bold sm:text-3xl">Log in to your account</h3>
            <p className="dark:text-slate-400">Don't have an account? <Link to={'/signup'}><span className="font-medium text-indigo-600 dark:hover:text-sky-400 dark:text-sky-500 hover:text-indigo-500">Sign up</span></Link> </p>
          </div>
        </div>
        <form
          onSubmit={onLogin}
          className="mt-8 space-y-5 sm:rounded-lg bg-white dark:bg-slate-800 p-6 shadow"
        >
          <div className="">
            <label className="dark:text-slate-100  font-medium">
              Email
            </label>
            <input
              name="email"
              value={loginData.email}
              onChange={inputHandler}
              ref={emailRef}
              type="email"
              required
              className="w-full font-semibold mt-2 px-3 py-2  dark:shadow-2xl dark:text-white text-gray-500 bg-transparent outline-none dark:border-slate-500 border-2 dark:focus:border-indigo-500 focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <div>
            <label className="dark:text-slate-100 font-medium">
              Password
            </label>
            <input
              name="password"
              value={loginData.password}
              onChange={inputHandler}
              type="password"
              required
              className="w-full font-semibold dark:shadow-2xl dark:border-slate-500 dark:focus:border-indigo-500 mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </div>
          <button
            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
          >
            Sign in
          </button>
          <div className="text-center">
            <a href="#" className="hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400">Forgot password?</a>
          </div>
        </form>
      </div>
    </main>
  )
}
