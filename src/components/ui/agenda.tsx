'use client';

import { useState, useEffect } from 'react';

const generalAgenda = [
  { time: 'Morning', description: 'Keynote: Winning the Market in 2025' },
  { time: 'Morning', description: 'Workshop: Digital Tools for Smarter Selling' },
  { time: 'Mid-day', description: 'Panel: Customer-Centric Sales Strategies' },
  { time: 'Afternoon', description: 'Session: Data-Driven Prospecting and Pipeline Building' },
  { time: 'Evening', description: 'Closing Session: Celebrating Success and Growth Stories' },
];

interface AgendaProps {
  registrationTime: Date | null;
}

interface AgendaItem {
  time: string;
  description: string;
}

const Agenda = ({ registrationTime }: AgendaProps) => {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);

  useEffect(() => {
    if (registrationTime) {
      const startTime = new Date(registrationTime);
      const sessionDurations = [5, 1, 1, 2, 2, 1, 1];
      let currentTime = startTime;

      const newAgenda = generalAgenda.map((item, index) => {
        const sessionStart = new Date(currentTime);
        currentTime = new Date(currentTime.getTime() + sessionDurations[index] * 60000);
        return { ...item, time: sessionStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      });
      setAgenda(newAgenda);
    } else {
      setAgenda(generalAgenda);
    }
  }, [registrationTime]);

  return (
    <div className="p-4 sm:p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Agenda</h2>
      <div className="space-y-6">
        {agenda.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="text-base sm:text-lg font-bold w-full sm:w-28 mb-2 sm:mb-0">{item.time}</div>
            <div className="text-base sm:text-lg">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agenda;