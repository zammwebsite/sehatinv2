
import React, { useState, useEffect, useCallback } from 'react';
import { findNearbyHealthFacilities } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import HealthFacilityCard from '../components/HealthFacilityCard';
import { GroundingChunk } from '../types';

type FacilityType = 'Semua' | 'Puskesmas' | 'Klinik' | 'Rumah Sakit';

const NearbyHealthPage: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [facilities, setFacilities] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FacilityType>('Semua');

  const getLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (err) => {
        setError('Gagal mendapatkan lokasi. Pastikan izin lokasi telah diberikan.');
        console.error(err);
        setIsLoading(false);
      }
    );
  }, []);

  const fetchFacilities = useCallback(async () => {
    if (!location) return;

    setIsLoading(true);
    setError(null);
    try {
      const results = await findNearbyHealthFacilities(location.lat, location.lon, filter);
      setFacilities(results);
    } catch (err) {
      setError('Gagal mencari fasilitas kesehatan. Coba lagi nanti.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [location, filter]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (location) {
      fetchFacilities();
    }
  }, [location, fetchFacilities]);

  const filters: FacilityType[] = ['Semua', 'Puskesmas', 'Klinik', 'Rumah Sakit'];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600">Layanan Kesehatan Terdekat</h1>
        <p className="text-gray-500 mt-2">Temukan fasilitas kesehatan di sekitar Anda.</p>
      </header>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      )}

      {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}

      {!isLoading && !error && facilities.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            Tidak ada fasilitas ditemukan.
          </p>
      )}

      {!isLoading && facilities.length > 0 && (
        <div className="space-y-4">
          {facilities.map((facility, index) =>
            facility.maps ? (
              <HealthFacilityCard key={index} title={facility.maps.title} uri={facility.maps.uri} />
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyHealthPage;
