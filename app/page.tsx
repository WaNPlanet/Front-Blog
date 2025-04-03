"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // News items with corresponding images
  const newsItems = [
    { title: "A sculpture of the Laocoön group was vandalized...", img: "/1.webp" },
    { title: "Mysterious artifact discovered in the desert...", img: "/2.jpg" },
    { title: "Ancient city ruins found beneath the ocean...", img: "/3.jpg" },
    { title: "Scientists uncover a new dinosaur species...", img: "/4.jpg" },
  ];

  return (
    <div className="bg-gray-100 text-black font-sans">
      {/* Navbar */}
      <nav className="shadow-md py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">MySite</Link>
        <ul className="flex space-x-6">
          <li><Link href="/" className="text-gray-600 hover:text-black">Home</Link></li>
          <li><Link href="/components/category" className="text-gray-600 hover:text-black">Categories</Link></li>
          <li><Link href="/blog" className="text-gray-600 hover:text-black">Blog</Link></li>
          <li><Link href="/contact" className="text-gray-600 hover:text-black">Contact</Link></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Left Column - Featured News */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">TODAY&apos;S NEWS</h1>
          <h2 className="text-xl font-semibold">
            60 Awesome Classic Cars Found Rotting in a Barn Go Up for Auction
          </h2>
          <p className="text-sm text-gray-700 space-x-2">
            <span className="font-bold">- Categories</span> 
            <span className="text-gray-600">• By Jenny Preston • 22 May 2022 • 17 Shares</span>
          </p>
          <p className="text-base leading-relaxed text-gray-800">
            <span className="font-bold">F</span>ortunately for those who want to see these cars...
          </p>

          {/* Main Image */}
          <Image
            src="/1.webp"
            alt="todays news"
            width={600}
            height={400}
            className="rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Middle Column - Sidebar */}
        <div>
          <div className="border-l pl-6 border-gray-400">
            <h3 className="font-bold text-lg">More News</h3>

            {/* Sidebar News Items with Hover */}
            <Link href="/components/read">
            {newsItems.map((news, index) => (
              <ul key={index} className="space-y-3 mt-4 text-sm">
                <li
                  className="relative flex justify-between items-start border-b pb-1 hover:bg-gray-200 cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div>
                    <h2 className="text-md font-bold uppercase leading-snug">{news.title}</h2>
                    <div className="text-gray-700 mt-1 mb-1 flex justify-between items-center">
                      <p className="flex space-x-2">
                        <span className="font-bold text-black">- Travel</span>
                        <span className="text-gray-600">• By Kyere</span>
                      </p>
                      <Image  src="./foward.png" alt="arrow" className="w-10 h-10" />
                    </div>
                  </div>
                </li>
              </ul>
            ))}
            </Link>
          </div>
        </div>

        {/* Rightmost Column - Displays Hovered Image on Large Screens Only */}
        <div className="hidden lg:flex justify-center items-center border">
          <div className="relative border-2 border-black shadow-lg p-2">
            <Image
              src={hoveredIndex !== null ? newsItems[hoveredIndex].img : newsItems[0].img}
              alt="Hovered news image"
              width={400}
              height={600}
              className="w-full h-70 transform transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Breaking News */}
      <div className="bg-gray-200 p-2 text-center text-sm">
        <marquee>
          🚨 Breaking News: Prevent future pandemics just 5% off • Deadly project
          recovered in Alec Baldwin • Maserati Boomerang turns 50
        </marquee>
      </div>
    </div>
  );
}
