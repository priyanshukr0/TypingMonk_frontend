import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { validateLogin } from "./utils/utilityFunctions";
//importing compnenets
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TypingTest from "./pages/TypingTest";
import LeaderBoard from "./pages/LeaderBoard";
import Error from "./pages/Error";
import Navbar from "./components/Navbar";
import UserProfile from "./components/User";
import Otp from "./components/Otp";


function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    validateLogin(dispatch)
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      {<Navbar />}
      <Routes>
        <Route index element={<TypingTest />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verification" element={<Otp />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path='/leaderboard' element={<LeaderBoard />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>


  );
}

export default App;
