
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { MessageCircleIcon, HeartPulseIcon, MapPinIcon, UserIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { to: '/ai-chat', icon: MessageCircleIcon, label: 'Konsultasi AI', color: 'bg-blue-500' },
    { to: '/health-check', icon: HeartPulseIcon, label: 'Cek Kesehatan', color: 'bg-red-500' },
    { to: '/nearby', icon: MapPinIcon, label: 'Layanan Terdekat', color: 'bg-yellow-500' },
    { to: '/profile', icon: UserIcon, label: 'Profil Saya', color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 sm:p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang,</h1>
        <p className="text-3xl font-bold text-green-600">{user?.name || user?.email}!</p>
        <p className="text-gray-500 mt-1">Bagaimana perasaanmu hari ini?</p>
      </header>
      
      <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Ringkasan Kesehatan</h2>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">Status Terakhir</p>
                <p className="text-xl font-bold text-green-600">Baik</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-500">Cek Terakhir</p>
                <p className="text-md font-semibold text-gray-700">Kemarin</p>
            </div>
        </div>
        <Link to="/health-check" className="mt-4 block w-full text-center bg-green-100 text-green-700 font-semibold py-2 rounded-lg hover:bg-green-200 transition">
          Lakukan Pengecekan
        </Link>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Fitur Utama</h2>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} className={`p-4 rounded-xl text-white flex flex-col items-center justify-center space-y-2 shadow-lg hover:scale-105 transform transition-transform ${item.color}`}>
                <item.icon className="w-10 h-10"/>
                <span className="font-semibold text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tips Kesehatan Hari Ini</h2>
        <p className="text-gray-600">
          Jangan lupa untuk minum setidaknya 8 gelas air hari ini untuk menjaga tubuh tetap terhidrasi dan bugar!
        </p>
      </section>
    </div>
  );
};

export default HomePage;
