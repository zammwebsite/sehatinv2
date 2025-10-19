
import React from 'react';

interface HealthFacilityCardProps {
  title: string;
  uri: string;
}

const HealthFacilityCard: React.FC<HealthFacilityCardProps> = ({ title, uri }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <a
        href={uri}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full hover:bg-green-200 transition"
      >
        Navigasi
      </a>
    </div>
  );
};

export default HealthFacilityCard;
