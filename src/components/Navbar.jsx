import { Link } from "react-router-dom";
import blackLogo from "../assets/Logo/typingmonk-high-resolution-logo-black-transparent.png";
import whiteLogo from "../assets/Logo/typingmonk-high-resolution-logo-white-transparent.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogin } from "../redux/slices/gameSlice";
import toast from "react-hot-toast";
import axios from "axios";
import DarkModeToggle from "react-dark-mode-toggle";
import { IoMdLogOut } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegWindowClose } from "react-icons/fa";


const NavigationItem = ({ title, path }) => (
  <li className="font-semibold list-none transition-colors text-slate-800 dark:text-white dark:hover:text-sky-500 hover:text-indigo-600">
    <Link to={path}>{title}</Link>
  </li>
);

export default function Navbar() {

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const userLoggedIn = useSelector(state => state.mainGame.isUserLoggedIn);
  const dispatch = useDispatch();

  //default theme is set to dark 
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'false' ? false : true);
  function handleDark() {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('darkMode', !isDarkMode);
    setIsDarkMode(prev => !prev);
  }
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const logout = async () => {
    try {
      const response = await axios.post(`${backend_url}/api/auth/logout`, {}, { withCredentials: true });
      toast.success(response.data?.message);
      dispatch(setUserLogin(false));
    } catch (error) {
      toast.error(error.response.data?.message || 'An error occurred');
      return;
    }
  }
  const [isNavOpen, setIsNavOpen] = useState(false);
  const closeNavMenu = () => {
    setIsNavOpen(false);
  }

  return (

    <nav className={`w-full dark:bg-slate-800 bg-white`}>

      <div className={`sticky left-0 top-0 z-50  max-w-screen-xl w-full bg-white shadow dark:bg-slate-800 h-[75px] dark:text-white px-10 py-3 items-center mx-auto flex justify-between`}>
        <Link to="/">
          <div>
            <img className='w-[150px] md:w-[150px]' src={isDarkMode ? whiteLogo : blackLogo} alt="typingMonk" />
          </div>
        </Link>

        <div className="hidden md:block">
          <ul className="flex items-center gap-4">
            <NavigationItem title="Leaderboard" path="/leaderboard" />
            <div >
              <DarkModeToggle
                onChange={handleDark}
                checked={isDarkMode}
                size={60}
              />
            </div>

          </ul>
        </div>

        <div className="hidden md:block">
          <ul className="flex items-center gap-4">
            <Link to={userLoggedIn ? '/user' : '/login'}>
              <button className="nav-secondary-btn">
                {userLoggedIn ? 'Profile' : 'Login'}
              </button>
            </Link>
            <Link to={userLoggedIn ? '' : '/signup'}>
              <button
                className="nav-primary-btn"
                onClick={userLoggedIn ? logout : null}
              >
                {userLoggedIn ? (
                  <div className="flex items-center gap-1">
                    Logout<IoMdLogOut className="text-2xl" />
                  </div>
                ) : (
                  'Signup'
                )}
              </button>
            </Link>
          </ul>
        </div>

        <div className="block md:hidden">
          <GiHamburgerMenu onClick={() => {
            setIsNavOpen(true);
          }} className="text-3xl" />
        </div>
        {isNavOpen &&
          <div className="absolute top-0 left-0 flex flex-col w-full h-screen gap-5 p-5 transition-all duration-500 bg-white dark:bg-slate-800">
            <div className="flex justify-center border-b-2 dark:border-slate-300 border-slate-800 " >
              <FaRegWindowClose onClick={closeNavMenu} className="mb-5 text-4xl" />
            </div>
            <div className="flex flex-col items-center gap-8 ">
              <Link onClick={closeNavMenu} to={userLoggedIn ? '/user' : '/login'}>
                <button className="nav-secondary-btn">
                  {userLoggedIn ? 'Profile' : 'Login'}
                </button>
              </Link>
              <Link onClick={closeNavMenu} to={userLoggedIn ? '' : '/signup'}>
                <button
                  className="nav-primary-btn"
                  onClick={userLoggedIn ? logout : null}
                >
                  {userLoggedIn ? (
                    <div className="flex items-center gap-1">
                      Logout<IoMdLogOut className="text-2xl" />
                    </div>
                  ) : (
                    'Signup'
                  )}
                </button>
              </Link>
              <div onClick={closeNavMenu}>
                <NavigationItem title="Leaderboard" path="/leaderboard" />
              </div>
              <div >
                <DarkModeToggle onChange={handleDark} checked={isDarkMode} size={60} />
              </div>

            </div>
          </div>}

      </div>


    </nav>

  );
}
