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
      wants: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          category: string | null
          max_budget: number | null
          location: string
          contact_email: string
          contact_name: string | null
          is_free: boolean
          auto_search: boolean
          status: 'active' | 'fulfilled' | 'expired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          category?: string | null
          max_budget?: number | null
          location: string
          contact_email: string
          contact_name?: string | null
          is_free?: boolean
          auto_search?: boolean
          status?: 'active' | 'fulfilled' | 'expired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          category?: string | null
          max_budget?: number | null
          location?: string
          contact_email?: string
          contact_name?: string | null
          is_free?: boolean
          auto_search?: boolean
          status?: 'active' | 'fulfilled' | 'expired'
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          want_id: string
          source: string
          title: string
          price: number | null
          url: string | null
          location: string | null
          image_url: string | null
          notified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          want_id: string
          source: string
          title: string
          price?: number | null
          url?: string | null
          location?: string | null
          image_url?: string | null
          notified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          want_id?: string
          source?: string
          title?: string
          price?: number | null
          url?: string | null
          location?: string | null
          image_url?: string | null
          notified?: boolean
          created_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          want_id: string
          offerer_name: string
          offerer_email: string
          offerer_phone: string | null
          message: string | null
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
        }
        Insert: {
          id?: string
          want_id: string
          offerer_name: string
          offerer_email: string
          offerer_phone?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
        Update: {
          id?: string
          want_id?: string
          offerer_name?: string
          offerer_email?: string
          offerer_phone?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
      }
    }
  }
}
