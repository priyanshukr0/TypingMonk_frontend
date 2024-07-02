import { useState } from "react"
import { FaTrashCan } from "react-icons/fa6";
import { X } from "react-feather"
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setUserLogin } from "../redux/slices/gameSlice";
import { useDispatch } from "react-redux";

function Modal({ open, onClose, children }) {
    return (
        // backdrop
        <div
            onClick={onClose}
            className={`
        fixed inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-black/20" : "invisible"}
      `}
        >
            {/* modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`
          bg-white dark:bg-slate-700 rounded-xl shadow p-6 transition-all
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
        `}
            >
                <button
                    onClick={onClose}
                    className="absolute p-1 text-gray-400 bg-white rounded-lg top-2 right-2 dark:bg-slate-600 dark:hover:bg-slate-800 hover:bg-gray-50 hover:text-gray-600"
                >
                    <X />
                </button>
                {children}
            </div>
        </div>
    )
}

export default function DeleteModal() {
    const navigate = useNavigate();
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const deleteUserPorfile = async () => {
        try {
            const response = await axios.post(`${backend_url}/api/auth/delete`, {}, { withCredentials: true });
            toast.success('Your account has been deleted successfully');
            dispatch(setUserLogin(false));
            navigate('/');
        } catch (error) {
            toast.error('Error occured while deleting your account');
        }

    }

    const [open, setOpen] = useState(false);
    return (
        <main className="mt-10 ml-5 sm:mt-7">
            <button className="btn btn-danger" onClick={() => setOpen(true)}>
                <FaTrashCan />Delete Your account
            </button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="w-56 text-center">
                    < FaTrashCan size={56} className="mx-auto text-red shadow-red-400/40 dark:text-red-600" />
                    <div className="w-48 mx-auto my-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">Confirm Delete</h3>
                        <p className="text-sm text-gray-700 dark:text-slate-300">
                            Are you sure you want to delete your account permanently?
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-full btn btn-danger" onClick={deleteUserPorfile} >Delete</button>
                        <button
                            className="w-full btn btn-light"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </main>
    )
}


