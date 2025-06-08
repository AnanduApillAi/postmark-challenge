import React from "react";

export const Badge = ({ text }: { text: string }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 no-underline group mb-4 md:mb-8 cursor-pointer relative shadow-lg shadow-blue-100/50 rounded-full p-px text-xs font-semibold leading-6 text-blue-700 inline-block">
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(59,130,246,0.3)_0%,rgba(59,130,246,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
      </span>
      <div className="relative flex space space-x-2 items-center z-10 rounded-full bg-white py-1 md:py-2 px-4 ring-1 ring-blue-200/50 border border-blue-100">
        <span className="text-blue-600 font-medium">✨ {text}</span>
        
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-blue-400/0 via-blue-400/60 to-purple-400/0 transition-opacity duration-500 group-hover:opacity-60"></span>
    </div>
  );
};
