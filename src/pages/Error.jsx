import { useNavigate } from "react-router-dom"
export default () => {
    const navigate = useNavigate();
    return (
        <main>
            <div className="flex items-center justify-start max-w-screen-xl px-4 mx-auto custom-height dark:bg-slate-800 md:px-8">
                <div className="max-w-lg mx-auto space-y-3 text-center">
                    <h3 className="text-3xl font-bold text-indigo-600 dark:text-indigo-500">
                        404 Error
                    </h3>
                    <p className="text-4xl font-semibold text-gray-800 dark:text-slate-200 sm:text-5xl">
                        Page not found
                    </p>
                    <p className="text-gray-600 dark:text-slate-400">
                        Sorry, the page you are looking for could not be found or has been removed.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 ">
                        <a onClick={() => { navigate(-1) }} className="block px-4 py-2 font-medium text-white duration-150 bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-500 active:bg-indigo-700">
                            Go back
                        </a>
                    </div>
                </div>
            </div>
        </main>
    )
}