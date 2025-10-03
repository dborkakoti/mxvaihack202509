'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import Uploader from './uploader';

const PosterViewer = ({ registrationId }) => {
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [posterVideoUrl, setPosterVideoUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkPoster = () => {
      const storedRegistrationRecord = localStorage.getItem("registration_record");
      if (storedRegistrationRecord) {
        const record = JSON.parse(storedRegistrationRecord);
        setName(record.name);
        if (record.poster_url) {
          setPosterUrl(record.poster_url);
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            setGenerating(false);
          }
        }
        if (record.poster_video_url) {
          setPosterVideoUrl(record.poster_video_url);
        }
      }
    };

    checkPoster();
    const interval = setInterval(checkPoster, 5000); // Periodically check for updates

    return () => clearInterval(interval);
  }, []);

  const onUploaded = (result: { selfie_url: string, poster_url: string }) => {
    const existing = JSON.parse(localStorage.getItem("registration_record") || "{}")
    const new_value = JSON.stringify({ ...existing, ...result })
    localStorage.setItem("registration_record", new_value)
  }

  const handleGeneratePoster = async () => {
    setGenerating(true);
    setError(null);

    try {
      const registrationRecord = JSON.parse(
        localStorage.getItem("registration_record") || "{}"
      );
      const response = await fetch(
        process.env.NEXT_PUBLIC_N8N_GENERATE_POSTER_WEBHOOK_URL!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registration_id: registrationId,
            name: registrationRecord.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Poster generation failed");
      }

      // Start polling for the poster
      pollingInterval.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/registration/${registrationId}`);
          const data = await res.json();
          if (data.poster_url) {
            localStorage.setItem("registration_record", JSON.stringify(data));
            setPosterUrl(data.poster_url);
            if (data.poster_video_url) {
              setPosterVideoUrl(data.poster_video_url);
            }
            if (pollingInterval.current) {
              clearInterval(pollingInterval.current);
            }
            setGenerating(false);
          }
        } catch (err) {
          // Keep polling
        }
      }, 5000);

      setTimeout(() => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          setGenerating(false);
          setError("Poster generation timed out. Please try again.");
        }
      }, 180000); // 3 minutes timeout

    } catch (err) {
      setError("Poster generation failed. Please try again.");
      setGenerating(false);
    }
  };

  const handleCopyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md mt-8">
      {(posterVideoUrl || generating) && (
        <>
          <h2 className="text-2xl font-bold mb-4">Your Vintage Bollywood Poster</h2>
          {generating && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p>Poster processing — we will notify when done</p>
            </div>
          )}</>
      )}
      {/* {error && (
        <div className="text-red-500">
          {error}
          <Button variant="link" onClick={handleGeneratePoster} className="ml-2">
            Retry
          </Button>
        </div>
      )}
      {!posterUrl && !generating && (
        <Button onClick={handleGeneratePoster}>Generate Poster</Button>
      )} */}
      {/* <Uploader registrationId={registrationId} onUploaded={onUploaded} />
      {posterUrl && (
        <div className="space-y-4">
          <img src={posterUrl} alt={`Vintage Bollywood Poster for ${name}`} className="w-full rounded-lg" />
          <div className="flex space-x-2">
            <a href={posterUrl} download>
              <Button variant="outline">Download Poster</Button>
            </a>
            <Button variant="outline" onClick={() => handleCopyToClipboard(posterUrl)}>Share Poster</Button>
          </div>
        </div>
      )} */}
      {posterVideoUrl && (
        <div className="space-y-4 mt-8">
          <video src={posterVideoUrl} controls className="w-full rounded-lg" />
          <div className="flex space-x-2">
            <a href={posterVideoUrl} download>
              <Button variant="outline">Download Video</Button>
            </a>
            <Button variant="outline" onClick={() => handleCopyToClipboard(posterVideoUrl)}>Share Video</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterViewer;