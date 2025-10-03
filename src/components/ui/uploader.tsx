"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface UploaderProps {
  registrationId: string;
  onUploaded: (result: {selfie_url: string, poster_url: string}) => void;
}

export default function Uploader({
  registrationId,
  onUploaded,
}: UploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("registration_id", registrationId);

    const uploadUrl = "/api/poster/upload";
    console.log("Upload URL:", uploadUrl);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      uploadUrl,
      true
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
        console.log(`Upload progress: ${percentComplete}%`);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      console.log("Upload finished with status:", xhr.status);
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          console.log("Upload successful, response:", response);
          localStorage.setItem(
            "registration_record",
            JSON.stringify(response)
          );
          onUploaded(response.selfie_url);
        } catch (e) {
          console.error("Error parsing upload response:", e);
          setError("Error processing upload response.");
        }
      } else {
        console.error("Upload failed with status:", xhr.status, xhr.responseText);
        setError("Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      console.error("Upload failed due to a network error.");
      setError("Upload failed. Please try again.");
    };

    xhr.send(formData);
  };

  const handleGeneratePoster = async () => {
    setGenerating(true);
    setError(null);
    try {
      const registrationRecord = JSON.parse(
        localStorage.getItem("registration_record") || "{}"
      );
      const response = await fetch("/api/poster/generate", {
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

      const result = await response.json();
      localStorage.setItem("registration_record", JSON.stringify(result));
      // The parent component will be responsible for refreshing the poster viewer
    } catch (err) {
      setError("Poster generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="selfie" className="block text-xl font-medium mb-1">
          Upload Selfie
        </label>
        <div className="flex items-center space-x-2">
          <Input
            id="selfie"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button variant="outline" onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </div>
      {uploading && <Progress value={progress} />}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
          <Button
            variant="link"
            onClick={file ? handleUpload : () => {}}
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      )}
      <div>
        <Button variant="outline" onClick={handleGeneratePoster} disabled={!file || uploading || generating}>
          {generating ? "Generating..." : "Generate Poster"}
        </Button>
      </div>
    </div>
  );
}