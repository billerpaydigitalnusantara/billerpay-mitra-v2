"use client";

import dynamic from 'next/dynamic'
import Header from "./components/header";
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
const Main = dynamic(() => import("./components/main"), { ssr: false })

export default function Home() {
  return (
    <div className="bg-gray-100 w-full min-h-screen grid grid-cols-[1fr,2.7fr] grid-rows-[1fr, 2fr, 1fr]  gap-4">
      <Header />
      <Sidebar />
      <Main />
      <Footer />
    </div>
  );
}
