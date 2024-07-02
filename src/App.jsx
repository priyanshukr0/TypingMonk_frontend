import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { setUserLogin } from "./redux/slices/gameSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
const backend_url = import.meta.env.VITE_BACKEND_URL;
//importing compnenets
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TestFile from "./pages/TestFile";
import User from "./components/User";
import Otp from "./components/Otp";
import LeaderBoard from "./pages/LeaderBoard";


function App() {

  const location = useLocation();
  const showNavbar = location.pathname !== '/leaderboard';

  const dispatch = useDispatch();
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch(`${backend_url}/api/auth/validate-user`, { method: 'GET', credentials: 'include' });
        if (!response.ok) {
          // Manually throw an error to be caught in the catch block
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to validate user');
        }
        const data = await response.json();
        if (data.success) {
          dispatch(setUserLogin(true));
        } else {
          dispatch(setUserLogin(false));
        }
      } catch (error) {
        dispatch(setUserLogin(false));
        return;
      }
    }
    checkLogin();
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      {<Navbar />}
      <Routes>
        <Route index element={<TestFile />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<Otp />} />
        <Route path="/user" element={<User />} />
        <Route path='/leaderboard' element={<LeaderBoard />} />
      </Routes>
    </>


  );
}

export default App;
