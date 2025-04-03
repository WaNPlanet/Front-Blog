"use client";
import Link from "next/link";

export default function CategoryPage() {
  return (
    <div className="bg-gray-100 text-black font-sans min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="shadow-md py-5 px-6 ">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">MySite</Link>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-gray-600 hover:text-black">Home</Link></li>
            <li><Link href="/components/category" className="text-gray-600 hover:text-black">Categories</Link></li>
            <li><Link href="/blog" className="text-gray-600 hover:text-black">Blog</Link></li>
            <li><Link href="/contact" className="text-gray-600 hover:text-black">Contact</Link></li>
          </ul>
        </div>
      </nav>

      {/* Page Content */}
      <div className="p-6 container mx-auto flex flex-col flex-grow">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 py-2">
          <ul className="flex space-x-2">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:underline">Home</Link> <span className="mx-1">/</span>
            </li>
            <li className="text-black">Categories</li>
          </ul>
        </nav>

        {/* Category Title */}
        <h1 className="text-4xl font-bold mt-2">Find The Category of Your Interest</h1>
        <p className="text-gray-700 text-lg mt-2">
          We leverage the latest technology to improve the way we manage your shipments.
        </p>

        {/* Spacer for alignment */}
        <div className="flex-grow"></div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 py-6">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border-t border-b  hover:shadow-lg transition-shadow duration-200 h-full flex flex-col ">
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
              <Link href="#" className="mt-auto text-indigo-600 font-semibold flex items-center hover:underline">
                Learn More <span className="ml-2">➡️</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  { title: "Politics", description: "Stay up-to-date with your shipments from pick-up to delivery." },
  { title: "Finance", description: "Gain insights into your supply chain, identify bottlenecks, and make data-driven decisions." },
  { title: "Technology Updates", description: "Receive timely notifications about your shipments, including expected delivery times and delays." },
  { title: "Personal Letter", description: "Access your account anytime with our secure online portal for booking, managing, and tracking shipments." },
];
