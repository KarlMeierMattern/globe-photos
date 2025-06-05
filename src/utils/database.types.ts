export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string;
          created_at: string;
          location_name: string;
          description: string;
          latitude: number;
          longitude: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          location_name: string;
          description: string;
          latitude: number;
          longitude: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          location_name?: string;
          description?: string;
          latitude?: number;
          longitude?: number;
        };
      };
      images: {
        Row: {
          id: string;
          created_at: string;
          location_id: string;
          name: string;
          url: string;
          description: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          location_id: string;
          name: string;
          url: string;
          description?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          location_id?: string;
          name?: string;
          url?: string;
          description?: string;
        };
      };
    };
  };
}
