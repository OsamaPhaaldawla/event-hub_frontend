import { BsTicketDetailedFill } from "react-icons/bs";

export default function Button({ children, disable = false, ...props }) {
  return (
    <div className="relative">
      <button
        className="flex justify-center w-fit text-lg mx-auto items-center text-white bg-blue-600 border-white border rounded-2xl px-4 py-1 hover:text-black hover:border-blue-600 hover:bg-transparent group transition duration-300 cursor-pointer mt-3 group"
        disabled={disable}
        {...props}
      >
        <BsTicketDetailedFill className="text-white/90 mr-2 group-hover:text-blue-600/90 transition duration-300" />
        {children}
      </button>
    </div>
  );
}
