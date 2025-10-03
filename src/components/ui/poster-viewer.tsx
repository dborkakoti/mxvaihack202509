'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { RegistrationRecord } from '@/lib/types';
import Image from 'next/image';

interface PosterViewerProps {
  registrationId: string;
}

const PosterViewer = ({ registrationId }: PosterViewerProps) => {
  const [record, setRecord] = useState<RegistrationRecord | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchRegistrationRecord = useCallback(async () => {
    try {
      const res = await fetch(`/api/registration/${registrationId}`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("registration_record", JSON.stringify(data));
        setRecord(data);

        if (data.selfie_url && !data.poster_url) {
            setIsPolling(true);
        }

        if (data.poster_url) {
          setIsPolling(false);
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch registration record", error);
    }
  }, [registrationId]);

  useEffect(() => {
    const storedRecord = localStorage.getItem("registration_record");
    if (storedRecord) {
        const parsedRecord: RegistrationRecord = JSON.parse(storedRecord);
        setRecord(parsedRecord);
        if(parsedRecord.selfie_url && !parsedRecord.poster_url) {
            setIsPolling(true);
        }
    }

    fetchRegistrationRecord();

    const interval = setInterval(fetchRegistrationRecord, 5000);
    pollingInterval.current = interval;

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [registrationId, fetchRegistrationRecord]);


  const handleCopyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const name = record?.name || 'Attendee';
  const posterUrl = record?.poster_url;
  const posterVideoUrl = record?.poster_video_url;

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">2. Your Vintage Bollywood Poster</h2>

      {isPolling && !posterUrl && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p>Poster processing... This may take a few minutes. The poster will appear below when ready.</p>
        </div>
      )}

      {posterUrl && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Poster</h3>
          <Image src={posterUrl} alt={`Vintage Bollywood Poster for ${name}`} className="w-full rounded-lg" />
          <div className="flex space-x-2">
            <a href={posterUrl} download>
              <Button variant="outline">Download Poster</Button>
            </a>
            <Button variant="outline" onClick={() => handleCopyToClipboard(posterUrl)}>Share Poster</Button>
          </div>
        </div>
      )}

      {posterVideoUrl && (
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold">Your Animated Poster</h3>
          <video src={posterVideoUrl} controls className="w-full rounded-lg" />
          <div className="flex space-x-2">
            <a href={posterVideoUrl} download>
              <Button variant="outline">Download Video</Button>
            </a>
            <Button variant="outline" onClick={() => handleCopyToClipboard(posterVideoUrl)}>Share Video</Button>
          </div>
        </div>
      )}

      {!isPolling && !posterUrl && (
        <p className="text-gray-500">Upload a selfie and click &apos;Generate Poster&apos; to begin.</p>
      )}
    </div>
  );
};

export default PosterViewer;