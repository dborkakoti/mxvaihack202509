'use client';

import { useState, useEffect } from 'react';

const FaqPage = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await fetch('/faq.json');
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ data');
        }
        const data = await response.json();
        setFaqData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading FAQ...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqData.map(([question, answer], index) => (
          <div key={index} className="p-4 border rounded-md bg-white shadow-sm">
            <h3 className="text-lg font-medium">{question}</h3>
            <p className="mt-2 text-gray-600">{answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
