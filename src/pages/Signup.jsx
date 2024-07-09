import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast"
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom"

export default () => {

  const userLoggedIn = useSelector(state => state.mainGame.isUserLoggedIn);
  const navigate = useNavigate();
  const nameInput = useRef(null);
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    if (userLoggedIn) {
      navigate('/')
    } else {
      nameInput.current.focus();
    }
  }, [userLoggedIn])

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${backend_url}/api/auth/signup`, formData);
      console.log(response);
      toast.success(response.data.message);
      localStorage.setItem('userMail', formData.email);
      navigate('/otp-verification');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center w-full custom-height dark:bg-slate-800 bg-gray-50 sm:px-4">

      <div className="w-full space-y-6 text-gray-600 sm:max-w-lg">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">Create an account</h3>
            <p className="dark:text-slate-300">Already have an account? <Link to={'/login'}><span className="font-medium text-indigo-600 dark:hover:text-sky-400 dark:text-sky-500 hover:text-indigo-500">Log In</span></Link></p>
          </div>
        </div>
        <div className="p-6 bg-white shadow dark:bg-slate-800 sm:p-6 sm:rounded-lg">
          <form
            onSubmit={handleSignUp}
            className="space-y-5"
          >
            <div>
              <label className="font-medium dark:text-slate-100">
                Name
              </label>
              <input

                ref={nameInput}
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                required
                className="w-full px-3 py-2 mt-2 font-semibold text-gray-500 bg-transparent border-2 rounded-lg shadow-sm outline-none dark:shadow-2xl dark:text-white dark:border-slate-500 dark:focus:border-indigo-500 focus:border-indigo-600"

              // className="w-full px-3 py-2 mt-2 text-gray-500 bg-transparent border rounded-lg shadow-sm outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="font-medium dark:text-slate-100">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                required
                className="w-full px-3 py-2 mt-2 font-semibold text-gray-500 bg-transparent border-2 rounded-lg shadow-sm outline-none dark:shadow-2xl dark:text-white dark:border-slate-500 dark:focus:border-indigo-500 focus:border-indigo-600"

              // className="w-full px-3 py-2 mt-2 text-gray-500 bg-transparent border rounded-lg shadow-sm outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="font-medium dark:text-slate-100">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                className="w-full px-3 py-2 mt-2 font-semibold text-gray-500 bg-transparent border-2 rounded-lg shadow-sm outline-none dark:shadow-2xl dark:border-slate-500 dark:focus:border-indigo-500 focus:border-indigo-600"

              // className="w-full px-3 py-2 mt-2 text-gray-500 bg-transparent border rounded-lg shadow-sm outline-none focus:border-indigo-600"
              />
            </div>
            <button
              className="w-full px-4 py-2 font-medium text-white duration-150 bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-600"
            >
              Create account
            </button>
          </form>
          <div className="mt-5">
            <button
              // className="w-full dark:border-none dark:text-white dark:shadow-2xl dark:bg-slate-900 dark:hover:bg-indigo-500 dark:active:bg-indigo-600 rounded-lg  flex items-center justify-center gap-x-3 py-2.5 mt-5 border  text-sm font-medium hover:bg-gray-100 duration-150 active:bg-gray-100"
              className="w-full rounded-lg flex items-center justify-center gap-x-3 py-2.5 mt-5 border text-sm font-medium duration-150 
    dark:border-none dark:text-white dark:shadow-2xl dark:bg-slate-700 dark:hover:bg-indigo-700 dark:active:bg-indigo-700 
    bg-white text-black border-gray-300 hover:bg-gray-100 active:bg-gray-200"

            >

              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_17_40)">
                  <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                  <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                  <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                  <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}