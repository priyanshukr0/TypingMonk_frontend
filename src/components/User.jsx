import React, { useEffect, useState } from 'react'
import { FaUserAstronaut } from "react-icons/fa";
import DeleteModal from './DeleteModal';

const ProfilePage = ({ userData, onDelete }) => {
    return (
        <div className='w-full bg-gray-100 dark:bg-slate-800 '>
            <div className="max-w-screen-xl mx-auto bg-gray-100 custom-height dark:bg-slate-800 ">
                <div className="w-full max-[470px]:px-1 max-[470px]:py-6 p-6 mx-auto rounded-lg ">
                    <div className="flex max-[360px]:justify-center items-center justify-center w-full gap-3 p-3 mb-4 rounded-lg dark:bg-blue-300 dark:shadow-lg bg-slate-300">
                        <FaUserAstronaut className='max-[380px]:text-3xl text-5xl' />
                        <div>
                            <h2 className=" max-[360px]:text-lg text-2xl font-bold dark:text-slate-950">{userData.name}</h2>
                            <p className="italic font-medium text-gray-600 dark:text-zinc-900">{userData.email}</p>
                        </div>
                    </div>

                    <div className="">
                        <div>
                            <h3 className="text-4xl font-bold text-center text-orange-400 sm:mt-8 sm:mb-12">Best Score</h3>
                        </div>

                        <div className="flex flex-col justify-around gap-5 mt-4 lg:flex-row sm ">
                            <div className="px-2 py-4 w-full lg:w-[48%] flex  dark:bg-slate-900 justify-around dark:shadow-score-box-shadow shadow-lg rounded-lg">
                                {Object.keys(userData.bestScore.timeStats).map((key, index) => (
                                    <div key={index} className="flex flex-col items-center gap-5 cursor-pointer">
                                        <div className="text-2xl font-medium max-[500px]:text-lg text-slate-500 dark:text-slate-300">{key}</div>
                                        <div className="relative text-5xl font-semibold dark:text-sky-400 hover:wpm-tooltip text-sky-900"> {userData.bestScore.timeStats[key].wpm}</div>
                                        <div className="relative text-2xl font-semibold dark:text-gray-300 hover:acc-tooltip text-slate-500">  {userData.bestScore.timeStats[key].accuracy}<span className='font-mono text-sm font-bold'>%</span> </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-2 py-4 w-full lg:w-[48%] flex dark:bg-slate-900 justify-around dark:shadow-score-box-shadow shadow-lg rounded-lg">
                                {Object.keys(userData.bestScore.wordStats).map((key, index) => (
                                    <div key={index} className="flex flex-col items-center gap-5 cursor-pointer ">
                                        <div className="text-2xl font-medium max-[500px]:text-lg text-slate-500 dark:text-slate-300">{key}</div>
                                        <div className="relative text-5xl font-semibold dark:text-sky-400 hover:wpm-tooltip text-sky-900">{userData.bestScore.wordStats[key].wpm}</div>
                                        <div className="relative text-2xl font-semibold dark:text-gray-300 hover:acc-tooltip text-slate-500">  {userData.bestScore.wordStats[key].accuracy}<span className='font-mono text-sm font-bold '>%</span></div>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>

                    <DeleteModal />


                </div>
            </div>
        </div>


    );
};




export default function User() {

    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch user data from the backend
        fetch(`${backend_url}/api/score/stats`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setUserData(data.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });

    }, []);

    const handleDeleteUser = async () => { return; }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return <ProfilePage userData={userData} onDelete={handleDeleteUser} />;

}