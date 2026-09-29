import React, { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans z-[99999]">
      <h1 className="text-7xl sm:text-9xl font-bold tracking-tight text-white mb-3">
        404
      </h1>
      <p className="text-xl sm:text-2xl text-zinc-400 font-medium">
        Page Not Found
      </p>
    </div>
  );
}
