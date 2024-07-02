import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom'


export default function () {

    const backend_url = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
    const userMail = localStorage.getItem('userMail') || null;

    const otpInput = useRef(null);
    useEffect(() => {
        setTimeout(() => {
            otpInput.current.focus();
        }, 0);

        if (userMail === null) {
            // toast.error('UaserMail not found');
            navigate('/signup');
        }
    }, [])

    async function resendOtp() {
        try {
            const response = await axios.post(`${backend_url}/api/auth/resend-otp`, { email: userMail });
            toast.success(response.data.message);

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    }

    async function handleOtpSubmit(e) {
        e.preventDefault();
        const otp = otpInput.current.value;
        if (otp.length !== 6) {
            toast.error('Invalid OTP');
            return;
        }

        try {
            const response = await axios.post(`${backend_url}/api/auth/verify-otp`, {
                email: userMail, otp
            })
            toast.success(response.data.message);
            localStorage.removeItem('userMail');
            navigate('/login')

        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
            return;
        }

        // Call API to verify OTP
        // navigate('/dashboard');
    }
    return (
        <div className="relative flex flex-col justify-center py-12 overflow-hidden custom-height dark:bg-slate-800 bg-gray-50">
            <div className="relative w-full max-w-lg px-6 pt-10 mx-auto bg-white shadow-xl dark:bg-slate-800 pb-9 rounded-2xl">
                <div className="flex flex-col w-full max-w-md mx-auto space-y-16">
                    <div className="flex flex-col items-center justify-center space-y-2 text-center dark:text-white">
                        <div className="text-3xl font-semibold">
                            <p>Email Verification</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-400">
                            <p>{`We have sent a code to your email ${userMail}`}</p>
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleOtpSubmit}>
                            <div className="flex flex-col space-y-16">
                                <div className="flex flex-row items-center justify-between w-full max-w-xs mx-auto">
                                    <div className="w-2/3 h-16 mx-auto ">
                                        <input ref={otpInput}
                                            className="w-full px-3 py-2 mt-2 font-semibold text-gray-500 bg-transparent border-2 rounded-lg shadow-sm outline-none dark:shadow-2xl dark:text-white dark:border-slate-500 dark:focus:border-indigo-500 focus:border-indigo-600 " type="text" name="" id="" />
                                    </div>

                                </div>

                                <div className="flex flex-col space-y-5">
                                    <div>
                                        <button
                                            type='submit'
                                            className="flex flex-row items-center justify-center w-full py-5 text-sm text-center text-white bg-blue-700 border border-none shadow-sm outline-none hover:bg-blue-600 rounded-xl">
                                            Verify Account
                                        </button>
                                    </div>

                                    <div className="flex flex-row items-center justify-center space-x-1 text-sm font-medium text-center text-gray-500">
                                        <p>Didn't recieve code?</p> <a onClick={resendOtp} className="text-blue-600 cursor-pointer " >Resend</a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}



