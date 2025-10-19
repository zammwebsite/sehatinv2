
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would call a function to update the user profile in the database.
    console.log("Saving data (mock):", formData);
    setIsEditing(false);
    // You might want to update the auth context user here as well.
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600">Profil Saya</h1>
        <div className="mt-4 w-24 h-24 mx-auto rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-4xl font-bold">
          {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-green-600 font-semibold">
            {isEditing ? 'Batal' : 'Edit Profil'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500">Nama</label>
            {isEditing ? (
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-green-500 outline-none" />
            ) : (
              <p className="font-semibold text-gray-800">{user.name}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Umur</label>
            {isEditing ? (
              <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-green-500 outline-none" />
            ) : (
              <p className="font-semibold text-gray-800">{user.age || 'Belum diatur'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500">Jenis Kelamin</label>
            {isEditing ? (
              <select name="gender" value={formData.gender || ''} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-green-500 outline-none bg-transparent">
                  <option value="Male">Laki-laki</option>
                  <option value="Female">Perempuan</option>
                  <option value="Other">Lainnya</option>
              </select>
            ) : (
              <p className="font-semibold text-gray-800">{user.gender || 'Belum diatur'}</p>
            )}
          </div>
        </div>

        {isEditing && (
            <button onClick={handleSave} className="w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                Simpan Perubahan
            </button>
        )}
      </div>

      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Keluar
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
