export interface RegistrationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  tshirt_size: string;
  dietary_preference: string;
  selfie_url?: string;
  poster_url?: string;
  poster_video_url?: string;
}