"use client";
import React from "react";
import Header from "./layout/vertical/header/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-[#f0f9ff]">
        <Header />
          {/* Body Content  */}
          <div className="bg-[#f0f9ff] rounded-page min-h-[90vh]" id="content_body">
            <div
              className={`container mx-auto p-4`}
            >
              {children}
            </div>
          </div>

    </div>
  );
}
