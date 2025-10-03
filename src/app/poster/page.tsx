"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PosterViewer from "@/components/ui/poster-viewer";
import Uploader from "@/components/ui/uploader";
import { Button } from "@/components/ui/button";

export default function PosterPage() {
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [registrationRecord, setRegistrationRecord] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedRegistrationId = localStorage.getItem("registration_id");
    const storedRegistrationRecord = localStorage.getItem("registration_record");

    if (!storedRegistrationId) {
      router.push("/register");
      return;
    }

    setRegistrationId(storedRegistrationId);

    if (storedRegistrationRecord) {
      const record = JSON.parse(storedRegistrationRecord);
      setRegistrationRecord(record);
      if (record.selfie_url) {
        setSelfieUrl(record.selfie_url);
      }
    }
  }, [router]);

  const handleUpload = (newSelfieUrl: string) => {
    setSelfieUrl(newSelfieUrl);
    // Refresh registration record from local storage
    const storedRegistrationRecord = localStorage.getItem("registration_record");
    if (storedRegistrationRecord) {
      setRegistrationRecord(JSON.parse(storedRegistrationRecord));
    }
  };

  if (!registrationId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">
          You need to register to generate a poster.
        </p>
        <Button variant="outline" onClick={() => router.push("/register")}>
          Go to Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Your Poster</h1>
      {selfieUrl && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Your Selfie</h2>
          <img
            src={selfieUrl}
            alt="Your selfie"
            className="w-32 h-32 rounded-full"
          />
        </div>
      )}
      <Uploader registrationId={registrationId} onUploaded={handleUpload} />
      <PosterViewer registrationId={registrationId} />
    </div>
  );
}
