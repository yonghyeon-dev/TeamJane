export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          auth_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          auth_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          auth_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string | null
          business_name: string | null
          phone: string | null
          business_number: string | null
          address: string | null
          profile_image: string | null
          timezone: string
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          business_name?: string | null
          phone?: string | null
          business_number?: string | null
          address?: string | null
          profile_image?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          business_name?: string | null
          phone?: string | null
          business_number?: string | null
          address?: string | null
          profile_image?: string | null
          timezone?: string
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}