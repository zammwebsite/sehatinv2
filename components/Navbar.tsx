
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, MessageCircleIcon, HeartPulseIcon, MapPinIcon, UserIcon } from './Icons';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const commonClasses = "flex flex-col items-center justify-center space-y-1 text-gray-500 hover:text-green-600 transition-colors";
  const activeClasses = "text-green-600";
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : ''}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

const Navbar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        <NavItem to="/" icon={<HomeIcon className="w-6 h-6" />} label="Home" />
        <NavItem to="/ai-chat" icon={<MessageCircleIcon className="w-6 h-6" />} label="AI Chat" />
        <NavItem to="/health-check" icon={<HeartPulseIcon className="w-6 h-6" />} label="Cek" />
        <NavItem to="/nearby" icon={<MapPinIcon className="w-6 h-6" />} label="Terdekat" />
        <NavItem to="/profile" icon={<UserIcon className="w-6 h-6" />} label="Profil" />
      </div>
    </nav>
  );
};

export default Navbar;
