import React from 'react'
import ProfileInfoCard from '../cards/ProfileInfoCard'
import { Link } from 'react-router-dom';
import { LuSparkles } from 'react-icons/lu';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-6 max-w-7xl">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <LuSparkles className="text-white text-lg" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
            NitroBot
          </span>
        </Link>
        <div>
          <ProfileInfoCard />
        </div>
      </div>
    </div>
  );
}

export default Navbar