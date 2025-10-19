
import React, { useState } from 'react';
import { analyzeHealthSymptoms } from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../services/supabaseService';
import { useAuth } from '../hooks/useAuth';

const HealthCheckPage: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError('Mohon deskripsikan gejala atau perasaan Anda.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiFeedback('');
    try {
      const feedback = await analyzeHealthSymptoms(symptoms);
      setAiFeedback(feedback);
      
      // Save to health_logs
      if (user) {
        await supabase.from('health_logs').insert({
          user_id: user.id,
          camera_result: symptoms, // Store symptoms here as "camera_result" for simplicity
          ai_feedback: feedback,
        });
      }
    } catch (err) {
      setError('Gagal mendapatkan analisis AI. Coba lagi nanti.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600">Pengecekan Kesehatan</h1>
        <p className="text-gray-500 mt-2">Deskripsikan apa yang Anda rasakan untuk mendapatkan saran dari AI.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
            Gejala atau Keluhan Anda
          </label>
          <textarea
            id="symptoms"
            rows={5}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Contoh: Saya merasa pusing dan sedikit mual selama 2 hari terakhir."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
        >
          {isLoading ? <LoadingSpinner /> : 'Analisis dengan AI'}
        </button>
      </div>

      {aiFeedback && (
        <div className="mt-8 bg-green-50 p-6 rounded-xl border border-green-200">
          <h2 className="text-lg font-semibold text-green-800 mb-3">Saran dari AI Sehatin</h2>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {aiFeedback}
          </div>
          <p className="mt-4 text-xs text-red-600 font-semibold">
            PENTING: Analisis ini bukan diagnosis medis. Selalu konsultasikan dengan dokter atau tenaga medis profesional untuk masalah kesehatan Anda.
          </p>
        </div>
      )}
    </div>
  );
};

export default HealthCheckPage;