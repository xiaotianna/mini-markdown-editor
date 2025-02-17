import React, { FC } from "react";
import "highlight.js/styles/atom-one-dark.css";

const Layout: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="w-full px-6 py-4">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">在线尝试🥳</h1>
      </header>
      {children}
    </div>
  );
};

export default Layout;
