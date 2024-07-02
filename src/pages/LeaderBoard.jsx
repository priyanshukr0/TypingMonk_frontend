import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { IoMdRefresh } from "react-icons/io";

export default function LeaderBoard() {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [leaderboardData, setLeaderboardData] = useState(null);
    const [testMode, setTestMode] = useState('word');
    const fetchLeaderboard = async () => {
        try {
            const resposne = await axios.get(`${backend_url}/api/score/leaderboard`, { params: { testMode: testMode } });
            // console.log(resposne);
            setLeaderboardData(resposne.data.data);
        } catch (error) {
            toast.error('An error occured while fetching Leaderboard');
        }
    }
    useEffect(() => {
        fetchLeaderboard();
    }, [testMode])

    return (
        <div className='w-full bg-gray-200 dark:bg-slate-500'>
            <div className='w-full max-w-screen-xl min-h-screen mx-auto bg-gray-200 dark:bg-slate-500'>
                <div className='flex items-center max-[460px]:flex-col justify-around mb-2 px-3 sm:px-0 md:justify-center'>
                    <div className='my-2 text-3xl font-bold text-center sm:text-4xl dark:text-slate-800'>Leaderboard</div>

                    <div>
                        <div className='flex items-baseline gap-4 ml-3 '>
                            <div className='flex my-1 bg-white rounded-lg shadow dark:bg-slate-700'>
                                <div
                                    onClick={() => setTestMode('word')}
                                    className={`cursor-pointer  select-none transition-all border-2 ${testMode === 'word' ? ' border-sky-700 dark:border-slate-950  text-sky-500 bg-sky-50 dark:text-white dark:bg-sky-700' : 'border-slate-500  dark:border-slate-700 dark:text-slate-300 '} rounded-r-none rounded-lg px-3 py-1 shadow-md text-xl transition-colors duration-200`}
                                >
                                    Words
                                </div>
                                <div
                                    onClick={() => setTestMode('time')}
                                    className={`cursor-pointer  select-none transition-all border-2  ${testMode === 'time' ? 'border-sky-700 dark:border-slate-950   text-sky-500 bg-sky-50 dark:text-white dark:bg-sky-700' : 'border-slate-500  dark:border-slate-700 dark:text-slate-300 '} rounded-lg rounded-l-none px-3 py-1 shadow-md text-xl transition-colors duration-200`}
                                >
                                    Time
                                </div>
                            </div>

                            <div
                                onClick={async () => {
                                    await fetchLeaderboard();
                                    toast.success('LeaderBoard refreshed successfully');
                                }}
                                className="mt-3 cursor-pointer select-none text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors focus:outline-none dark:focus:ring-blue-800 flex items-center justify-center"
                            >
                                <span className="block sm:hidden">
                                    <IoMdRefresh />
                                </span>
                                <span className="hidden sm:block">
                                    Refresh
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
                {leaderboardData &&
                    //parent div for the leaderboard boxes
                    <div className='w-full'>

                        <div className='flex flex-col flex-wrap justify-around gap-4 px-4 cursor-default md:px-1 md:flex-row'>
                            {Object.keys(leaderboardData).map((key) => (
                                <div className='w-full  md:w-[48%] bg-white dark:bg-gray-800 shadow-lg rounded-lg pt-6 pb-10 px-3' key={key}>
                                    <div className='mb-4 font-mono text-2xl font-semibold text-center text-slate-900 dark:text-slate-100'>{key}</div>
                                    <div>
                                        <div className='flex justify-between max-[410px]:justify-between px-2 pb-2 text-xl font-semibold border-b-2 text-sky-600 dark:text-sky-400 border-sky-600 dark:border-sky-400'>
                                            <div className='w-[9%]'>#</div>
                                            <div className='w-[50%]'>User</div>

                                            <div className='w-[13%] max-[410px]:w-[15%] max-[410px]:text-start text-center'>wpm</div>
                                            <div className=' max-[410px]:hidden'>
                                                <div className='w-[18%] text-center'>accuracy</div>
                                            </div>
                                            <div className='min-[410px]:hidden'>
                                                <div className='w-[18%] text-start'>acc</div>

                                            </div>

                                        </div>
                                        <div className='flex flex-col gap-4 mt-4'>
                                            {leaderboardData[key].map((item, index) => (
                                                <div key={index} className='flex justify-between p-2 px-2 transition-colors duration-200 rounded-md bg-sky-50 dark:bg-gray-700 hover:bg-sky-100 dark:hover:bg-gray-600'>
                                                    <div className='text-xl font-semibold text-cyan-900 dark:text-cyan-400 w-[9%]'>{`${index + 1}`}</div>
                                                    <div className='w-[50%] font-semibold text-slate-600 dark:text-slate-300 text-xl'>{item.name}</div>
                                                    <div className='max-[410px]:text-lg max-[410px]:text-end text-xl font-semibold text-cyan-900 dark:text-cyan-400 w-[13%]  text-center'>{item.wpm}</div>
                                                    <div className='max-[410px]:text-lg max-[410px]:text-end text-xl font-semibold text-cyan-900 dark:text-cyan-400 w-[18%] text-center'>{item.accuracy + '%'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                }

            </div>
        </div>

    )
} 
