import { useState } from "react";
import { Menu, X } from "lucide-react";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full bg-gray-100 shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold">TODOLIST</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-gray-500">
            Home
          </a>
          <a href="/about" className="hover:text-gray-500">
            About
          </a>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center py-2 bg-gray-200">
          <a href="/" className="py-2 w-full text-center hover:bg-gray-300">
            Home
          </a>
          <a href="/about" className="py-2 w-full text-center hover:bg-gray-300">
            About
          </a>
        </div>
      )}

     
    </div>
  );
};

export default Navbar;
