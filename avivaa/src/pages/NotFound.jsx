import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans z-[99999]">
      <h1 className="text-7xl sm:text-9xl font-bold tracking-tight text-white mb-3">
        404
      </h1>
      <p className="text-xl sm:text-2xl text-zinc-400 font-medium mb-6">
        Page Not Found
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
      >
        Back to Home
      </Link>
    </div>
  );
}
