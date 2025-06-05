import type { Database } from "./database.types";

export type Picture = {
  name: string;
  data: string;
  description: string;
};

export type Label = {
  text: string;
  description: string;
  lat: number;
  lng: number;
  picture?: Picture[];
  labelColor?: string;
  labelSize?: number;
  labelDotRadius?: number;
};

export type FormData = {
  locationName: string;
  description: string;
  latitude: string;
  longitude: string;
  files: File[];
};

export type Image = Database["public"]["Tables"]["images"]["Row"];
export type LocationWithImages =
  Database["public"]["Tables"]["locations"]["Row"] & { images: Image[] };
