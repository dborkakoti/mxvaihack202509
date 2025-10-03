"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PosterViewer from "@/components/ui/poster-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RegistrationRecord } from "@/lib/types";

export default function PosterPage() {
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [registrationRecord, setRegistrationRecord] = useState<RegistrationRecord | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
    }
  }, [router]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleGeneratePoster = async () => {
    if (!file || !registrationId) {
      setError("Please select a selfie to generate the poster.");
      return;
    }

    setGenerating(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("registration_id", registrationId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/poster/generate", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setGenerating(false);
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          localStorage.setItem(
            "registration_record",
            JSON.stringify(response.registrationRecord)
          );
          setRegistrationRecord(response.registrationRecord);
        } catch {
          setError("Error processing server response.");
        }
      } else {
        setError("Poster generation failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setGenerating(false);
      setError("An error occurred during the upload. Please try again.");
    };

    xhr.send(formData);
  };

  if (!registrationId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">Loading registration details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Your Poster</h1>

      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="selfie" className="block text-xl font-medium mb-1">
            1. Upload Your Selfie
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="selfie"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={generating}
            />
          </div>
        </div>

        {registrationRecord?.selfie_url && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Your Current Selfie</h2>
            <img
              src={registrationRecord.selfie_url}
              alt="Your selfie"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}

        <div>
            <Button
            onClick={handleGeneratePoster}
            disabled={!file || generating}
            size="lg"
            >
            {generating ? "Generating..." : "Upload and Generate Poster"}
            </Button>
        </div>
        {generating && <Progress value={progress} className="w-full" />}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <PosterViewer registrationId={registrationId} />
    </div>
  );
}