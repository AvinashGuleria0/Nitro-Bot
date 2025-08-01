import React from 'react'
import ProfileInfoCard from '../cards/ProfileInfoCard'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="h-16 bg-white border border-gray-200/50 backdrop-blur-[2px] py-0 px-4 md:px-0 sticky top-2 z-30 rounded-2xl">
      <div className="container mx-auto flex items-center justify-between gap-5">
        <Link to="/dashboard">
          <h2 className="text-lg md:text-xl font-medium text-black leading-5 pl-5">Nitro Bot</h2>
        </Link>
        <ProfileInfoCard />
      </div>
    </div>
  );
}

export default Navbar