import React from 'react';
import { Link } from 'react-router-dom';

const TestResult = ({ WPM, accuracy, wpmref, accref, resetGame, userLoggedIn }) => {
    return (
        <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col w-full gap-12 p-6 md:gap-0 md:flex-row md:justify-between">
                <div>
                    <div className="mb-5 text-6xl font-medium text-slate-800 dark:text-slate-200">Test Result</div>
                    <div className="px-3 mb-4">
                        <p className="mb-2 text-4xl text-zinc-900 dark:text-slate-200">wpm</p>
                        <p ref={wpmref} className="text-6xl font-semibold text-primary">
                            {WPM}
                        </p>
                    </div>
                    <div className="px-3 mb-6">
                        <p className="mb-2 text-4xl text-zinc-900 dark:text-slate-200">accuracy</p>
                        <p ref={accref} className="text-6xl font-semibold text-primary">{accuracy}%</p>
                    </div>
                    <button
                        className="restart-test-btn-blue"
                        onClick={resetGame}
                    >
                        Restart Test
                    </button>
                </div>
                {!userLoggedIn && (
                    <div className="my-auto text-3xl font-medium md:mx-auto text-slate-900 dark:text-slate-200">
                        Please login to save Test Result{' '}
                        <Link to={'/login'}>
                            <span className="mx-2 font-medium text-indigo-600 dark:hover:text-sky-400 dark:text-sky-500 hover:text-indigo-500">
                                Log In
                            </span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestResult;
