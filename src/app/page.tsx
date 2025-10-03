'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PosterViewer from '@/components/ui/poster-viewer';
import Agenda from '@/components/ui/agenda';
import Carousel from '@/components/ui/carousel';

const Home = () => {
  const [registrationId, setRegistrationId] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [summaryAvailable, setSummaryAvailable] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('registration_id');
    if (id && id !== 'undefined') {
      setRegistrationId(id);
      fetch(`/api/registration/${id}`)
        .then(res => res.json())
        .then(data => setRegistration(data));

      const eventEndTime = new Date(new Date().getTime() + 60 * 60 * 1000);
      if (new Date() > eventEndTime) {
        setSummaryAvailable(true);
      }
    }
  }, []);

  return (
    <main className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-8">
        {!registrationId && (
          <Link href="/register" className="animate-pulse bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
            Register to join the excitement
          </Link>
        )}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <Agenda registrationTime={registration ? new Date() : null} />
          </div>
          {registrationId && (
            <div className="space-y-8 md:col-span-2">
              <PosterViewer registrationId={registrationId} />
            </div>
          )}
          {registration && summaryAvailable && (
            <div className="p-6 bg-white rounded-lg shadow-md text-center md:col-span-2">
              <h3 className="text-xl font-bold mb-2">Feedback Summary Available</h3>
              <Link href="/summary" className="text-blue-500 hover:underline">
                View Summary
              </Link>
            </div>
          )}
        </div>
        <Carousel />
      </div>
    </main>
  );
};

export default Home;
