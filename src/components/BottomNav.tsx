
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Plus, Calendar, User } from 'lucide-react';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/add', icon: Plus, label: 'Add' },
  { to: '/', icon: Calendar, label: 'Calendar' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const BottomNav: React.FC = () => {
  const activeClass = "p-2 text-[#5bb9e5] font-bold";
  const inactiveClass = "p-2 text-gray-500 hover:text-blue-500";

  return (
    <footer className="flex-shrink-0 bg-white border-t border-gray-200">
      <nav className="max-w-7xl mx-auto flex justify-around items-center h-16">
        {navItems.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <item.icon size={28} />
          </NavLink>
        ))}
      </nav>
    </footer>
  );
};