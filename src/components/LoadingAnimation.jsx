import React from 'react'

export default function TextLoadingAnimation() {
    return (
        <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-slate-800">
            <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export function LoadingAnimation() {
    return (
        <div className='flex items-center justify-center my-auto custom-height bg-gray-50 dark:bg-slate-800'>
            <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-slate-800">
                <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>

        </div>
    )
}
