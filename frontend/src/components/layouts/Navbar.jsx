import React from 'react'
import ProfileInfoCard from '../cards/ProfileInfoCard'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="h-16 bg-white sketch-border sketch-shadow py-0 px-4 md:px-0 sticky top-4 z-30 mb-8 mx-4 md:mx-auto max-w-7xl">
      <div className="container h-full mx-auto flex items-center justify-between px-2">
        <Link to="/dashboard">
          <h2 className="text-xl md:text-2xl font-black text-black leading-5 px-3 py-1 bg-[var(--color-accent-yellow)] sketch-border shadow-[2px_2px_0px_0px_#000]">Nitro Bot</h2>
        </Link>
        <div className="pr-2">
          <ProfileInfoCard />
        </div>
      </div>
    </div>
  );
}

export default Navbar