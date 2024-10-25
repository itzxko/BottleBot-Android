import React from "react";
import { FiX, FiBell } from "react-icons/fi";

const PopupModal = ({ icon, onClose, message, header }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 bg-black/50 h-[100svh] flex items-center justify-center font-dm tracking-normal">
      <div className="w-[240px] flex flex-col space-y-2 items-center justify-center bg-[#F6F6F6] rounded-2xl shadow-xl shadow-black/10">
        <div className="w-full flex flex-row items-center justify-between px-4 py-3 shadow-xl shadow-black/10">
          <p className="text-xs font-semibold text-black/50 tracking-tight">
            {header ? header : "Popup"}
          </p>
          <FiX
            size={16}
            color="black"
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div className="w-full flex flex-col space-y-4 items-center justify-center p-6">
          <div className="w-full flex items-center justify-center">
            <div className="p-4 rounded-full bg-gradient-to-tr from-[#050301] to-[#757575]">
              <FiBell size={20} color="white" />
            </div>
          </div>
          <p className="text-xs font-normal truncate w-full text-center">
            {message ? message : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
