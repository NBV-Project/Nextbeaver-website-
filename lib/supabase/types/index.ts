export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_body: {
        Row: {
          id: string
          order_index: number
          text: string
          text_th: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_index: number
          text: string
          text_th?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_index?: number
          text?: string
          text_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      about_content: {
        Row: {
          eyebrow: string
          eyebrow_th: string | null
          highlight_label: string
          highlight_label_th: string | null
          highlight_value: string
          id: string
          image_alt: string
          image_alt_th: string | null
          image_url: string
          title: string
          title_accent: string
          title_accent_th: string | null
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          eyebrow: string
          eyebrow_th?: string | null
          highlight_label: string
          highlight_label_th?: string | null
          highlight_value: string
          id?: string
          image_alt: string
          image_alt_th?: string | null
          image_url: string
          title: string
          title_accent: string
          title_accent_th?: string | null
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          eyebrow?: string
          eyebrow_th?: string | null
          highlight_label?: string
          highlight_label_th?: string | null
          highlight_value?: string
          id?: string
          image_alt?: string
          image_alt_th?: string | null
          image_url?: string
          title?: string
          title_accent?: string
          title_accent_th?: string | null
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      about_pillars: {
        Row: {
          body: string
          body_th: string | null
          id: string
          order_index: number
          title: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          body: string
          body_th?: string | null
          id?: string
          order_index: number
          title: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          body_th?: string | null
          id?: string
          order_index?: number
          title?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      about_styles: {
        Row: {
          body_color_dark: string | null
          body_color_light: string | null
          body_font_family_en: string | null
          body_font_family_th: string | null
          body_font_size: number | null
          eyebrow_color_dark: string | null
          eyebrow_color_light: string | null
          eyebrow_font_family_en: string | null
          eyebrow_font_family_th: string | null
          eyebrow_font_size: number | null
          highlight_bg_color_dark: string | null
          highlight_bg_color_light: string | null
          highlight_label_color_dark: string | null
          highlight_label_color_light: string | null
          highlight_label_font_family_en: string | null
          highlight_label_font_family_th: string | null
          highlight_label_font_size: number | null
          highlight_value_color_dark: string | null
          highlight_value_color_light: string | null
          highlight_value_font_family_en: string | null
          highlight_value_font_family_th: string | null
          highlight_value_font_size: number | null
          id: string
          image_overlay_color_dark: string | null
          image_overlay_color_light: string | null
          pillar_body_color_dark: string | null
          pillar_body_color_light: string | null
          pillar_body_font_family_en: string | null
          pillar_body_font_family_th: string | null
          pillar_body_font_size: number | null
          pillar_title_color_dark: string | null
          pillar_title_color_light: string | null
          pillar_title_font_family_en: string | null
          pillar_title_font_family_th: string | null
          pillar_title_font_size: number | null
          title_accent_color_dark: string | null
          title_accent_color_light: string | null
          title_accent_font_family_en: string | null
          title_accent_font_family_th: string | null
          title_accent_font_size: number | null
          title_color_dark: string | null
          title_color_light: string | null
          title_font_family_en: string | null
          title_font_family_th: string | null
          title_font_size: number | null
          updated_at: string | null
        }
        Insert: {
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          eyebrow_color_dark?: string | null
          eyebrow_color_light?: string | null
          eyebrow_font_family_en?: string | null
          eyebrow_font_family_th?: string | null
          eyebrow_font_size?: number | null
          highlight_bg_color_dark?: string | null
          highlight_bg_color_light?: string | null
          highlight_label_color_dark?: string | null
          highlight_label_color_light?: string | null
          highlight_label_font_family_en?: string | null
          highlight_label_font_family_th?: string | null
          highlight_label_font_size?: number | null
          highlight_value_color_dark?: string | null
          highlight_value_color_light?: string | null
          highlight_value_font_family_en?: string | null
          highlight_value_font_family_th?: string | null
          highlight_value_font_size?: number | null
          id?: string
          image_overlay_color_dark?: string | null
          image_overlay_color_light?: string | null
          pillar_body_color_dark?: string | null
          pillar_body_color_light?: string | null
          pillar_body_font_family_en?: string | null
          pillar_body_font_family_th?: string | null
          pillar_body_font_size?: number | null
          pillar_title_color_dark?: string | null
          pillar_title_color_light?: string | null
          pillar_title_font_family_en?: string | null
          pillar_title_font_family_th?: string | null
          pillar_title_font_size?: number | null
          title_accent_color_dark?: string | null
          title_accent_color_light?: string | null
          title_accent_font_family_en?: string | null
          title_accent_font_family_th?: string | null
          title_accent_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Update: {
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          eyebrow_color_dark?: string | null
          eyebrow_color_light?: string | null
          eyebrow_font_family_en?: string | null
          eyebrow_font_family_th?: string | null
          eyebrow_font_size?: number | null
          highlight_bg_color_dark?: string | null
          highlight_bg_color_light?: string | null
          highlight_label_color_dark?: string | null
          highlight_label_color_light?: string | null
          highlight_label_font_family_en?: string | null
          highlight_label_font_family_th?: string | null
          highlight_label_font_size?: number | null
          highlight_value_color_dark?: string | null
          highlight_value_color_light?: string | null
          highlight_value_font_family_en?: string | null
          highlight_value_font_family_th?: string | null
          highlight_value_font_size?: number | null
          id?: string
          image_overlay_color_dark?: string | null
          image_overlay_color_light?: string | null
          pillar_body_color_dark?: string | null
          pillar_body_color_light?: string | null
          pillar_body_font_family_en?: string | null
          pillar_body_font_family_th?: string | null
          pillar_body_font_size?: number | null
          pillar_title_color_dark?: string | null
          pillar_title_color_light?: string | null
          pillar_title_font_family_en?: string | null
          pillar_title_font_family_th?: string | null
          pillar_title_font_size?: number | null
          title_accent_color_dark?: string | null
          title_accent_color_light?: string | null
          title_accent_font_family_en?: string | null
          title_accent_font_family_th?: string | null
          title_accent_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_label: string | null
          after_data: Json | null
          attempts: number | null
          before_data: Json | null
          created_at: string
          diff_data: Json | null
          geo: Json | null
          id: string
          ip_address: string | null
          metadata: Json | null
          request_id: string | null
          result: string | null
          session_id: string | null
          target: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_label?: string | null
          after_data?: Json | null
          attempts?: number | null
          before_data?: Json | null
          created_at?: string
          diff_data?: Json | null
          geo?: Json | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          request_id?: string | null
          result?: string | null
          session_id?: string | null
          target?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_label?: string | null
          after_data?: Json | null
          attempts?: number | null
          before_data?: Json | null
          created_at?: string
          diff_data?: Json | null
          geo?: Json | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          request_id?: string | null
          result?: string | null
          session_id?: string | null
          target?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      contact_content: {
        Row: {
          body: string
          body_th: string | null
          email: string
          email_label: string
          email_label_th: string | null
          eyebrow: string
          eyebrow_th: string | null
          id: string
          location: string
          location_label: string
          location_label_th: string | null
          location_th: string | null
          title_bottom: string
          title_bottom_th: string | null
          title_top: string
          title_top_th: string | null
          updated_at: string | null
        }
        Insert: {
          body: string
          body_th?: string | null
          email: string
          email_label: string
          email_label_th?: string | null
          eyebrow: string
          eyebrow_th?: string | null
          id?: string
          location: string
          location_label: string
          location_label_th?: string | null
          location_th?: string | null
          title_bottom: string
          title_bottom_th?: string | null
          title_top: string
          title_top_th?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          body_th?: string | null
          email?: string
          email_label?: string
          email_label_th?: string | null
          eyebrow?: string
          eyebrow_th?: string | null
          id?: string
          location?: string
          location_label?: string
          location_label_th?: string | null
          location_th?: string | null
          title_bottom?: string
          title_bottom_th?: string | null
          title_top?: string
          title_top_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_form_content: {
        Row: {
          company_label: string
          company_label_th: string | null
          company_placeholder: string
          company_placeholder_th: string | null
          details_label: string
          details_label_th: string | null
          details_placeholder: string
          details_placeholder_th: string | null
          email_label: string
          email_label_th: string | null
          email_placeholder: string
          email_placeholder_th: string | null
          id: string
          name_label: string
          name_label_th: string | null
          name_placeholder: string
          name_placeholder_th: string | null
          submit_label: string
          submit_label_th: string | null
          updated_at: string | null
        }
        Insert: {
          company_label: string
          company_label_th?: string | null
          company_placeholder: string
          company_placeholder_th?: string | null
          details_label: string
          details_label_th?: string | null
          details_placeholder: string
          details_placeholder_th?: string | null
          email_label: string
          email_label_th?: string | null
          email_placeholder: string
          email_placeholder_th?: string | null
          id?: string
          name_label: string
          name_label_th?: string | null
          name_placeholder: string
          name_placeholder_th?: string | null
          submit_label: string
          submit_label_th?: string | null
          updated_at?: string | null
        }
        Update: {
          company_label?: string
          company_label_th?: string | null
          company_placeholder?: string
          company_placeholder_th?: string | null
          details_label?: string
          details_label_th?: string | null
          details_placeholder?: string
          details_placeholder_th?: string | null
          email_label?: string
          email_label_th?: string | null
          email_placeholder?: string
          email_placeholder_th?: string | null
          id?: string
          name_label?: string
          name_label_th?: string | null
          name_placeholder?: string
          name_placeholder_th?: string | null
          submit_label?: string
          submit_label_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_styles: {
        Row: {
          body_color_dark: string | null
          body_color_light: string | null
          body_font_family_en: string | null
          body_font_family_th: string | null
          body_font_size: number | null
          button_bg_dark: string | null
          button_bg_light: string | null
          button_font_family_en: string | null
          button_font_family_th: string | null
          button_font_size: number | null
          button_text_dark: string | null
          button_text_light: string | null
          eyebrow_color_dark: string | null
          eyebrow_color_light: string | null
          eyebrow_font_family_en: string | null
          eyebrow_font_family_th: string | null
          eyebrow_font_size: number | null
          form_bg_dark: string | null
          form_bg_light: string | null
          form_border_dark: string | null
          form_border_light: string | null
          form_label_color_dark: string | null
          form_label_color_light: string | null
          form_label_font_family_en: string | null
          form_label_font_family_th: string | null
          form_label_font_size: number | null
          icon_bg_dark: string | null
          icon_bg_light: string | null
          icon_color_dark: string | null
          icon_color_light: string | null
          id: string
          info_color_dark: string | null
          info_color_light: string | null
          info_font_family_en: string | null
          info_font_family_th: string | null
          info_font_size: number | null
          input_bg_dark: string | null
          input_bg_light: string | null
          input_border_dark: string | null
          input_border_light: string | null
          input_font_family_en: string | null
          input_font_family_th: string | null
          input_font_size: number | null
          input_placeholder_dark: string | null
          input_placeholder_light: string | null
          input_text_dark: string | null
          input_text_light: string | null
          label_color_dark: string | null
          label_color_light: string | null
          label_font_family_en: string | null
          label_font_family_th: string | null
          label_font_size: number | null
          title_color_dark: string | null
          title_color_light: string | null
          title_font_family_en: string | null
          title_font_family_th: string | null
          title_font_size: number | null
          updated_at: string | null
        }
        Insert: {
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          button_bg_dark?: string | null
          button_bg_light?: string | null
          button_font_family_en?: string | null
          button_font_family_th?: string | null
          button_font_size?: number | null
          button_text_dark?: string | null
          button_text_light?: string | null
          eyebrow_color_dark?: string | null
          eyebrow_color_light?: string | null
          eyebrow_font_family_en?: string | null
          eyebrow_font_family_th?: string | null
          eyebrow_font_size?: number | null
          form_bg_dark?: string | null
          form_bg_light?: string | null
          form_border_dark?: string | null
          form_border_light?: string | null
          form_label_color_dark?: string | null
          form_label_color_light?: string | null
          form_label_font_family_en?: string | null
          form_label_font_family_th?: string | null
          form_label_font_size?: number | null
          icon_bg_dark?: string | null
          icon_bg_light?: string | null
          icon_color_dark?: string | null
          icon_color_light?: string | null
          id?: string
          info_color_dark?: string | null
          info_color_light?: string | null
          info_font_family_en?: string | null
          info_font_family_th?: string | null
          info_font_size?: number | null
          input_bg_dark?: string | null
          input_bg_light?: string | null
          input_border_dark?: string | null
          input_border_light?: string | null
          input_font_family_en?: string | null
          input_font_family_th?: string | null
          input_font_size?: number | null
          input_placeholder_dark?: string | null
          input_placeholder_light?: string | null
          input_text_dark?: string | null
          input_text_light?: string | null
          label_color_dark?: string | null
          label_color_light?: string | null
          label_font_family_en?: string | null
          label_font_family_th?: string | null
          label_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Update: {
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          button_bg_dark?: string | null
          button_bg_light?: string | null
          button_font_family_en?: string | null
          button_font_family_th?: string | null
          button_font_size?: number | null
          button_text_dark?: string | null
          button_text_light?: string | null
          eyebrow_color_dark?: string | null
          eyebrow_color_light?: string | null
          eyebrow_font_family_en?: string | null
          eyebrow_font_family_th?: string | null
          eyebrow_font_size?: number | null
          form_bg_dark?: string | null
          form_bg_light?: string | null
          form_border_dark?: string | null
          form_border_light?: string | null
          form_label_color_dark?: string | null
          form_label_color_light?: string | null
          form_label_font_family_en?: string | null
          form_label_font_family_th?: string | null
          form_label_font_size?: number | null
          icon_bg_dark?: string | null
          icon_bg_light?: string | null
          icon_color_dark?: string | null
          icon_color_light?: string | null
          id?: string
          info_color_dark?: string | null
          info_color_light?: string | null
          info_font_family_en?: string | null
          info_font_family_th?: string | null
          info_font_size?: number | null
          input_bg_dark?: string | null
          input_bg_light?: string | null
          input_border_dark?: string | null
          input_border_light?: string | null
          input_font_family_en?: string | null
          input_font_family_th?: string | null
          input_font_size?: number | null
          input_placeholder_dark?: string | null
          input_placeholder_light?: string | null
          input_text_dark?: string | null
          input_text_light?: string | null
          label_color_dark?: string | null
          label_color_light?: string | null
          label_font_family_en?: string | null
          label_font_family_th?: string | null
          label_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faq_content: {
        Row: {
          eyebrow: string
          eyebrow_th: string | null
          faq_key: string
          id: string
          title: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          eyebrow: string
          eyebrow_th?: string | null
          faq_key: string
          id?: string
          title: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          eyebrow?: string
          eyebrow_th?: string | null
          faq_key?: string
          id?: string
          title?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          answer_th: string | null
          id: string
          order_index: number
          question: string
          question_th: string | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          answer_th?: string | null
          id?: string
          order_index?: number
          question: string
          question_th?: string | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          answer_th?: string | null
          id?: string
          order_index?: number
          question?: string
          question_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      floating_social_items: {
        Row: {
          bg_color: string | null
          href: string
          icon_color: string | null
          icon_svg: string
          id: string
          label: string
          label_th: string | null
          order_index: number
          type: string
          updated_at: string | null
        }
        Insert: {
          bg_color?: string | null
          href: string
          icon_color?: string | null
          icon_svg: string
          id?: string
          label: string
          label_th?: string | null
          order_index: number
          type: string
          updated_at?: string | null
        }
        Update: {
          bg_color?: string | null
          href?: string
          icon_color?: string | null
          icon_svg?: string
          id?: string
          label?: string
          label_th?: string | null
          order_index?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      home_hero: {
        Row: {
          accent: string
          accent_th: string | null
          badge: string
          badge_th: string | null
          code_filename: string
          description: string
          description_th: string | null
          id: string
          primary_cta: string
          primary_cta_href: string
          primary_cta_th: string | null
          secondary_cta: string
          secondary_cta_href: string
          secondary_cta_th: string | null
          status_label: string
          status_label_th: string | null
          status_value: string
          status_value_th: string | null
          title: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          accent: string
          accent_th?: string | null
          badge: string
          badge_th?: string | null
          code_filename: string
          description: string
          description_th?: string | null
          id?: string
          primary_cta: string
          primary_cta_href: string
          primary_cta_th?: string | null
          secondary_cta: string
          secondary_cta_href: string
          secondary_cta_th?: string | null
          status_label: string
          status_label_th?: string | null
          status_value: string
          status_value_th?: string | null
          title: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          accent?: string
          accent_th?: string | null
          badge?: string
          badge_th?: string | null
          code_filename?: string
          description?: string
          description_th?: string | null
          id?: string
          primary_cta?: string
          primary_cta_href?: string
          primary_cta_th?: string | null
          secondary_cta?: string
          secondary_cta_href?: string
          secondary_cta_th?: string | null
          status_label?: string
          status_label_th?: string | null
          status_value?: string
          status_value_th?: string | null
          title?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      home_hero_capabilities: {
        Row: {
          icon: string
          id: string
          label: string
          label_th: string | null
          order_index: number
          updated_at: string | null
        }
        Insert: {
          icon: string
          id?: string
          label: string
          label_th?: string | null
          order_index: number
          updated_at?: string | null
        }
        Update: {
          icon?: string
          id?: string
          label?: string
          label_th?: string | null
          order_index?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      home_hero_code_lines: {
        Row: {
          id: string
          line: string
          order_index: number
          updated_at: string | null
        }
        Insert: {
          id?: string
          line: string
          order_index: number
          updated_at?: string | null
        }
        Update: {
          id?: string
          line?: string
          order_index?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      home_hero_styles: {
        Row: {
          accent_color_dark: string | null
          accent_color_light: string | null
          accent_font_family_en: string | null
          accent_font_family_th: string | null
          accent_font_size: number | null
          accent_gradient_dark_end: string | null
          accent_gradient_dark_start: string | null
          accent_gradient_enabled_dark: boolean | null
          accent_gradient_enabled_light: boolean | null
          accent_gradient_light_end: string | null
          accent_gradient_light_start: string | null
          badge_bg_color_dark: string | null
          badge_bg_color_light: string | null
          badge_border_color_dark: string | null
          badge_border_color_light: string | null
          badge_dot_color_dark: string | null
          badge_dot_color_light: string | null
          badge_font_family_en: string | null
          badge_font_family_th: string | null
          badge_font_size: number | null
          badge_text_color_dark: string | null
          badge_text_color_light: string | null
          code_font_family: string | null
          code_font_size: number | null
          cta_font_family_en: string | null
          cta_font_family_th: string | null
          cta_font_size: number | null
          description_color_dark: string | null
          description_color_light: string | null
          description_font_family_en: string | null
          description_font_family_th: string | null
          description_font_size: number | null
          id: string
          primary_cta_bg_dark: string | null
          primary_cta_bg_light: string | null
          primary_cta_text_dark: string | null
          primary_cta_text_light: string | null
          secondary_cta_bg_dark: string | null
          secondary_cta_bg_light: string | null
          secondary_cta_border_dark: string | null
          secondary_cta_border_light: string | null
          secondary_cta_text_dark: string | null
          secondary_cta_text_light: string | null
          status_label_color_dark: string | null
          status_label_color_light: string | null
          status_label_font_family_en: string | null
          status_label_font_family_th: string | null
          status_label_font_size: number | null
          status_value_color_dark: string | null
          status_value_color_light: string | null
          status_value_font_family_en: string | null
          status_value_font_family_th: string | null
          status_value_font_size: number | null
          title_color_dark: string | null
          title_color_light: string | null
          title_font_family_en: string | null
          title_font_family_th: string | null
          title_font_size: number | null
          updated_at: string | null
        }
        Insert: {
          accent_color_dark?: string | null
          accent_color_light?: string | null
          accent_font_family_en?: string | null
          accent_font_family_th?: string | null
          accent_font_size?: number | null
          accent_gradient_dark_end?: string | null
          accent_gradient_dark_start?: string | null
          accent_gradient_enabled_dark?: boolean | null
          accent_gradient_enabled_light?: boolean | null
          accent_gradient_light_end?: string | null
          accent_gradient_light_start?: string | null
          badge_bg_color_dark?: string | null
          badge_bg_color_light?: string | null
          badge_border_color_dark?: string | null
          badge_border_color_light?: string | null
          badge_dot_color_dark?: string | null
          badge_dot_color_light?: string | null
          badge_font_family_en?: string | null
          badge_font_family_th?: string | null
          badge_font_size?: number | null
          badge_text_color_dark?: string | null
          badge_text_color_light?: string | null
          code_font_family?: string | null
          code_font_size?: number | null
          cta_font_family_en?: string | null
          cta_font_family_th?: string | null
          cta_font_size?: number | null
          description_color_dark?: string | null
          description_color_light?: string | null
          description_font_family_en?: string | null
          description_font_family_th?: string | null
          description_font_size?: number | null
          id?: string
          primary_cta_bg_dark?: string | null
          primary_cta_bg_light?: string | null
          primary_cta_text_dark?: string | null
          primary_cta_text_light?: string | null
          secondary_cta_bg_dark?: string | null
          secondary_cta_bg_light?: string | null
          secondary_cta_border_dark?: string | null
          secondary_cta_border_light?: string | null
          secondary_cta_text_dark?: string | null
          secondary_cta_text_light?: string | null
          status_label_color_dark?: string | null
          status_label_color_light?: string | null
          status_label_font_family_en?: string | null
          status_label_font_family_th?: string | null
          status_label_font_size?: number | null
          status_value_color_dark?: string | null
          status_value_color_light?: string | null
          status_value_font_family_en?: string | null
          status_value_font_family_th?: string | null
          status_value_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Update: {
          accent_color_dark?: string | null
          accent_color_light?: string | null
          accent_font_family_en?: string | null
          accent_font_family_th?: string | null
          accent_font_size?: number | null
          accent_gradient_dark_end?: string | null
          accent_gradient_dark_start?: string | null
          accent_gradient_enabled_dark?: boolean | null
          accent_gradient_enabled_light?: boolean | null
          accent_gradient_light_end?: string | null
          accent_gradient_light_start?: string | null
          badge_bg_color_dark?: string | null
          badge_bg_color_light?: string | null
          badge_border_color_dark?: string | null
          badge_border_color_light?: string | null
          badge_dot_color_dark?: string | null
          badge_dot_color_light?: string | null
          badge_font_family_en?: string | null
          badge_font_family_th?: string | null
          badge_font_size?: number | null
          badge_text_color_dark?: string | null
          badge_text_color_light?: string | null
          code_font_family?: string | null
          code_font_size?: number | null
          cta_font_family_en?: string | null
          cta_font_family_th?: string | null
          cta_font_size?: number | null
          description_color_dark?: string | null
          description_color_light?: string | null
          description_font_family_en?: string | null
          description_font_family_th?: string | null
          description_font_size?: number | null
          id?: string
          primary_cta_bg_dark?: string | null
          primary_cta_bg_light?: string | null
          primary_cta_text_dark?: string | null
          primary_cta_text_light?: string | null
          secondary_cta_bg_dark?: string | null
          secondary_cta_bg_light?: string | null
          secondary_cta_border_dark?: string | null
          secondary_cta_border_light?: string | null
          secondary_cta_text_dark?: string | null
          secondary_cta_text_light?: string | null
          status_label_color_dark?: string | null
          status_label_color_light?: string | null
          status_label_font_family_en?: string | null
          status_label_font_family_th?: string | null
          status_label_font_size?: number | null
          status_value_color_dark?: string | null
          status_value_color_light?: string | null
          status_value_font_family_en?: string | null
          status_value_font_family_th?: string | null
          status_value_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      home_logo_loop_items: {
        Row: {
          alt: string
          alt_th: string | null
          id: string
          order_index: number
          src: string
          updated_at: string | null
        }
        Insert: {
          alt: string
          alt_th?: string | null
          id?: string
          order_index: number
          src: string
          updated_at?: string | null
        }
        Update: {
          alt?: string
          alt_th?: string | null
          id?: string
          order_index?: number
          src?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      home_logo_loop_settings: {
        Row: {
          direction: string
          fade_out: boolean
          fade_out_color_dark: string
          fade_out_color_light: string
          gap: number
          id: string
          logo_height: number
          speed: number
          updated_at: string | null
        }
        Insert: {
          direction: string
          fade_out?: boolean
          fade_out_color_dark: string
          fade_out_color_light: string
          gap: number
          id?: string
          logo_height: number
          speed: number
          updated_at?: string | null
        }
        Update: {
          direction?: string
          fade_out?: boolean
          fade_out_color_dark?: string
          fade_out_color_light?: string
          gap?: number
          id?: string
          logo_height?: number
          speed?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      home_marquee_items: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          order_index: number | null
          src: string
          updated_at: string | null
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          src: string
          updated_at?: string | null
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          src?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      home_marquee_showcase: {
        Row: {
          badge: string
          badge_th: string | null
          created_at: string | null
          cta1_link: string
          cta1_text: string
          cta1_text_th: string | null
          cta2_link: string
          cta2_text: string
          cta2_text_th: string | null
          description: string
          description_th: string | null
          heading_prefix: string
          heading_prefix_th: string | null
          heading_suffix: string
          heading_suffix_th: string | null
          highlighted_text: string
          highlighted_text_th: string | null
          id: string
          marquee_direction: string
          marquee_reverse: boolean
          marquee_speed: number
          title: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          badge?: string
          badge_th?: string | null
          created_at?: string | null
          cta1_link?: string
          cta1_text?: string
          cta1_text_th?: string | null
          cta2_link?: string
          cta2_text?: string
          cta2_text_th?: string | null
          description?: string
          description_th?: string | null
          heading_prefix?: string
          heading_prefix_th?: string | null
          heading_suffix?: string
          heading_suffix_th?: string | null
          highlighted_text?: string
          highlighted_text_th?: string | null
          id?: string
          marquee_direction?: string
          marquee_reverse?: boolean
          marquee_speed?: number
          title?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          badge?: string
          badge_th?: string | null
          created_at?: string | null
          cta1_link?: string
          cta1_text?: string
          cta1_text_th?: string | null
          cta2_link?: string
          cta2_text?: string
          cta2_text_th?: string | null
          description?: string
          description_th?: string | null
          heading_prefix?: string
          heading_prefix_th?: string | null
          heading_suffix?: string
          heading_suffix_th?: string | null
          highlighted_text?: string
          highlighted_text_th?: string | null
          id?: string
          marquee_direction?: string
          marquee_reverse?: boolean
          marquee_speed?: number
          title?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      home_marquee_styles: {
        Row: {
          badge_color_dark: string | null
          badge_color_light: string | null
          badge_font_family_en: string | null
          badge_font_family_th: string | null
          badge_font_size: number | null
          created_at: string | null
          cta1_bg_dark: string | null
          cta1_bg_light: string | null
          cta1_text_color_dark: string | null
          cta1_text_color_light: string | null
          cta2_bg_dark: string | null
          cta2_bg_light: string | null
          cta2_border_dark: string | null
          cta2_border_light: string | null
          cta2_text_color_dark: string | null
          cta2_text_color_light: string | null
          desc_color_dark: string | null
          desc_color_light: string | null
          desc_font_family_en: string | null
          desc_font_family_th: string | null
          desc_font_size: number | null
          heading_color_dark: string | null
          heading_color_light: string | null
          heading_font_family_en: string | null
          heading_font_family_th: string | null
          heading_font_size: number | null
          highlight_bg_color_dark: string | null
          highlight_bg_color_light: string | null
          highlight_text_color_dark: string | null
          highlight_text_color_light: string | null
          id: string
          title_color_dark: string | null
          title_color_light: string | null
          title_font_family_en: string | null
          title_font_family_th: string | null
          title_font_size: number | null
          updated_at: string | null
        }
        Insert: {
          badge_color_dark?: string | null
          badge_color_light?: string | null
          badge_font_family_en?: string | null
          badge_font_family_th?: string | null
          badge_font_size?: number | null
          created_at?: string | null
          cta1_bg_dark?: string | null
          cta1_bg_light?: string | null
          cta1_text_color_dark?: string | null
          cta1_text_color_light?: string | null
          cta2_bg_dark?: string | null
          cta2_bg_light?: string | null
          cta2_border_dark?: string | null
          cta2_border_light?: string | null
          cta2_text_color_dark?: string | null
          cta2_text_color_light?: string | null
          desc_color_dark?: string | null
          desc_color_light?: string | null
          desc_font_family_en?: string | null
          desc_font_family_th?: string | null
          desc_font_size?: number | null
          heading_color_dark?: string | null
          heading_color_light?: string | null
          heading_font_family_en?: string | null
          heading_font_family_th?: string | null
          heading_font_size?: number | null
          highlight_bg_color_dark?: string | null
          highlight_bg_color_light?: string | null
          highlight_text_color_dark?: string | null
          highlight_text_color_light?: string | null
          id?: string
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Update: {
          badge_color_dark?: string | null
          badge_color_light?: string | null
          badge_font_family_en?: string | null
          badge_font_family_th?: string | null
          badge_font_size?: number | null
          created_at?: string | null
          cta1_bg_dark?: string | null
          cta1_bg_light?: string | null
          cta1_text_color_dark?: string | null
          cta1_text_color_light?: string | null
          cta2_bg_dark?: string | null
          cta2_bg_light?: string | null
          cta2_border_dark?: string | null
          cta2_border_light?: string | null
          cta2_text_color_dark?: string | null
          cta2_text_color_light?: string | null
          desc_color_dark?: string | null
          desc_color_light?: string | null
          desc_font_family_en?: string | null
          desc_font_family_th?: string | null
          desc_font_size?: number | null
          heading_color_dark?: string | null
          heading_color_light?: string | null
          heading_font_family_en?: string | null
          heading_font_family_th?: string | null
          heading_font_size?: number | null
          highlight_bg_color_dark?: string | null
          highlight_bg_color_light?: string | null
          highlight_text_color_dark?: string | null
          highlight_text_color_light?: string | null
          id?: string
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      home_quote: {
        Row: {
          author_name: string
          author_name_th: string | null
          author_role: string
          author_role_th: string | null
          body: string
          body_th: string | null
          created_at: string
          icon: string
          id: string
          updated_at: string
        }
        Insert: {
          author_name: string
          author_name_th?: string | null
          author_role: string
          author_role_th?: string | null
          body: string
          body_th?: string | null
          created_at?: string
          icon?: string
          id?: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_name_th?: string | null
          author_role?: string
          author_role_th?: string | null
          body?: string
          body_th?: string | null
          created_at?: string
          icon?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      home_quote_styles: {
        Row: {
          author_color_dark: string | null
          author_color_light: string | null
          author_font_family_en: string | null
          author_font_family_th: string | null
          author_font_size: number | null
          body_color_dark: string | null
          body_color_light: string | null
          body_font_family_en: string | null
          body_font_family_th: string | null
          body_font_size: number | null
          created_at: string
          icon_color_dark: string | null
          icon_color_light: string | null
          id: string
          role_color_dark: string | null
          role_color_light: string | null
          role_font_family_en: string | null
          role_font_family_th: string | null
          role_font_size: number | null
          section_bg_dark: string | null
          section_bg_light: string | null
          updated_at: string
        }
        Insert: {
          author_color_dark?: string | null
          author_color_light?: string | null
          author_font_family_en?: string | null
          author_font_family_th?: string | null
          author_font_size?: number | null
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          created_at?: string
          icon_color_dark?: string | null
          icon_color_light?: string | null
          id?: string
          role_color_dark?: string | null
          role_color_light?: string | null
          role_font_family_en?: string | null
          role_font_family_th?: string | null
          role_font_size?: number | null
          section_bg_dark?: string | null
          section_bg_light?: string | null
          updated_at?: string
        }
        Update: {
          author_color_dark?: string | null
          author_color_light?: string | null
          author_font_family_en?: string | null
          author_font_family_th?: string | null
          author_font_size?: number | null
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          created_at?: string
          icon_color_dark?: string | null
          icon_color_light?: string | null
          id?: string
          role_color_dark?: string | null
          role_color_light?: string | null
          role_font_family_en?: string | null
          role_font_family_th?: string | null
          role_font_size?: number | null
          section_bg_dark?: string | null
          section_bg_light?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_hero: {
        Row: {
          accent: string | null
          accent_th: string | null
          description: string | null
          description_th: string | null
          id: string
          styles: Json | null
          title: string | null
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          accent?: string | null
          accent_th?: string | null
          description?: string | null
          description_th?: string | null
          id?: string
          styles?: Json | null
          title?: string | null
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          accent?: string | null
          accent_th?: string | null
          description?: string | null
          description_th?: string | null
          id?: string
          styles?: Json | null
          title?: string | null
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          breadcrumbs: string | null
          breadcrumbs_th: string | null
          description: string | null
          description_th: string | null
          details: string[] | null
          details_th: string[] | null
          gallery: string[] | null
          id: string
          image: string | null
          link: string | null
          order_index: number | null
          styles: Json | null
          tech: string[] | null
          title: string | null
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          breadcrumbs?: string | null
          breadcrumbs_th?: string | null
          description?: string | null
          description_th?: string | null
          details?: string[] | null
          details_th?: string[] | null
          gallery?: string[] | null
          id?: string
          image?: string | null
          link?: string | null
          order_index?: number | null
          styles?: Json | null
          tech?: string[] | null
          title?: string | null
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          breadcrumbs?: string | null
          breadcrumbs_th?: string | null
          description?: string | null
          description_th?: string | null
          details?: string[] | null
          details_th?: string[] | null
          gallery?: string[] | null
          id?: string
          image?: string | null
          link?: string | null
          order_index?: number | null
          styles?: Json | null
          tech?: string[] | null
          title?: string | null
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      process_content: {
        Row: {
          id: string
          subtitle: string
          subtitle_th: string | null
          title: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          subtitle: string
          subtitle_th?: string | null
          title: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          subtitle?: string
          subtitle_th?: string | null
          title?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          body: string
          body_color_dark: string | null
          body_color_light: string | null
          body_font_family_en: string | null
          body_font_family_th: string | null
          body_font_size: number | null
          body_th: string | null
          highlight: boolean | null
          icon: string
          icon_color_dark: string | null
          icon_color_light: string | null
          id: string
          number: string
          offset_class: string | null
          order_index: number | null
          title: string
          title_color_dark: string | null
          title_color_light: string | null
          title_font_family_en: string | null
          title_font_family_th: string | null
          title_font_size: number | null
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          body: string
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          body_th?: string | null
          highlight?: boolean | null
          icon: string
          icon_color_dark?: string | null
          icon_color_light?: string | null
          id?: string
          number: string
          offset_class?: string | null
          order_index?: number | null
          title: string
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          body_color_dark?: string | null
          body_color_light?: string | null
          body_font_family_en?: string | null
          body_font_family_th?: string | null
          body_font_size?: number | null
          body_th?: string | null
          highlight?: boolean | null
          icon?: string
          icon_color_dark?: string | null
          icon_color_light?: string | null
          id?: string
          number?: string
          offset_class?: string | null
          order_index?: number | null
          title?: string
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      process_styles: {
        Row: {
          accent_color_dark: string | null
          accent_color_light: string | null
          id: string
          line_accent_color_dark: string | null
          line_accent_color_light: string | null
          line_base_color_dark: string | null
          line_base_color_light: string | null
          line_dash_color_dark: string | null
          line_dash_color_light: string | null
          line_dash_duration_desktop: number | null
          line_dash_duration_mobile: number | null
          line_pulse_duration_desktop: number | null
          line_pulse_duration_mobile: number | null
          step_body_color_dark: string | null
          step_body_color_light: string | null
          step_body_font_family_en: string | null
          step_body_font_family_th: string | null
          step_body_font_size: number | null
          step_icon_color_dark: string | null
          step_icon_color_light: string | null
          step_number_color_dark: string | null
          step_number_color_light: string | null
          step_title_color_dark: string | null
          step_title_color_light: string | null
          step_title_font_family_en: string | null
          step_title_font_family_th: string | null
          step_title_font_size: number | null
          subtitle_color_dark: string | null
          subtitle_color_light: string | null
          subtitle_font_family_en: string | null
          subtitle_font_family_th: string | null
          subtitle_font_size: number | null
          title_color_dark: string | null
          title_color_light: string | null
          title_font_family_en: string | null
          title_font_family_th: string | null
          title_font_size: number | null
          updated_at: string | null
        }
        Insert: {
          accent_color_dark?: string | null
          accent_color_light?: string | null
          id?: string
          line_accent_color_dark?: string | null
          line_accent_color_light?: string | null
          line_base_color_dark?: string | null
          line_base_color_light?: string | null
          line_dash_color_dark?: string | null
          line_dash_color_light?: string | null
          line_dash_duration_desktop?: number | null
          line_dash_duration_mobile?: number | null
          line_pulse_duration_desktop?: number | null
          line_pulse_duration_mobile?: number | null
          step_body_color_dark?: string | null
          step_body_color_light?: string | null
          step_body_font_family_en?: string | null
          step_body_font_family_th?: string | null
          step_body_font_size?: number | null
          step_icon_color_dark?: string | null
          step_icon_color_light?: string | null
          step_number_color_dark?: string | null
          step_number_color_light?: string | null
          step_title_color_dark?: string | null
          step_title_color_light?: string | null
          step_title_font_family_en?: string | null
          step_title_font_family_th?: string | null
          step_title_font_size?: number | null
          subtitle_color_dark?: string | null
          subtitle_color_light?: string | null
          subtitle_font_family_en?: string | null
          subtitle_font_family_th?: string | null
          subtitle_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Update: {
          accent_color_dark?: string | null
          accent_color_light?: string | null
          id?: string
          line_accent_color_dark?: string | null
          line_accent_color_light?: string | null
          line_base_color_dark?: string | null
          line_base_color_light?: string | null
          line_dash_color_dark?: string | null
          line_dash_color_light?: string | null
          line_dash_duration_desktop?: number | null
          line_dash_duration_mobile?: number | null
          line_pulse_duration_desktop?: number | null
          line_pulse_duration_mobile?: number | null
          step_body_color_dark?: string | null
          step_body_color_light?: string | null
          step_body_font_family_en?: string | null
          step_body_font_family_th?: string | null
          step_body_font_size?: number | null
          step_icon_color_dark?: string | null
          step_icon_color_light?: string | null
          step_number_color_dark?: string | null
          step_number_color_light?: string | null
          step_title_color_dark?: string | null
          step_title_color_light?: string | null
          step_title_font_family_en?: string | null
          step_title_font_family_th?: string | null
          step_title_font_size?: number | null
          subtitle_color_dark?: string | null
          subtitle_color_light?: string | null
          subtitle_font_family_en?: string | null
          subtitle_font_family_th?: string | null
          subtitle_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services_content: {
        Row: {
          explore: string
          explore_th: string | null
          eyebrow: string
          eyebrow_th: string | null
          id: string
          title: string
          title_th: string | null
          updated_at: string | null
          view_all: string
          view_all_th: string | null
        }
        Insert: {
          explore: string
          explore_th?: string | null
          eyebrow: string
          eyebrow_th?: string | null
          id?: string
          title: string
          title_th?: string | null
          updated_at?: string | null
          view_all: string
          view_all_th?: string | null
        }
        Update: {
          explore?: string
          explore_th?: string | null
          eyebrow?: string
          eyebrow_th?: string | null
          id?: string
          title?: string
          title_th?: string | null
          updated_at?: string | null
          view_all?: string
          view_all_th?: string | null
        }
        Relationships: []
      }
      services_items: {
        Row: {
          body: string
          body_th: string | null
          features: Json
          icon_type: string
          icon_value: string
          id: string
          modal_plans: Json | null
          order_index: number
          title: string
          title_th: string | null
          updated_at: string | null
        }
        Insert: {
          body: string
          body_th?: string | null
          features?: Json
          icon_type?: string
          icon_value: string
          id?: string
          modal_plans?: Json | null
          order_index: number
          title: string
          title_th?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          body_th?: string | null
          features?: Json
          icon_type?: string
          icon_value?: string
          id?: string
          modal_plans?: Json | null
          order_index?: number
          title?: string
          title_th?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services_styles: {
        Row: {
          card_bg_dark: string | null
          card_bg_light: string | null
          card_body_color_dark: string | null
          card_body_color_light: string | null
          card_body_font_family_en: string | null
          card_body_font_family_th: string | null
          card_body_font_size: number | null
          card_border_dark: string | null
          card_border_light: string | null
          card_icon_bg_dark: string | null
          card_icon_bg_light: string | null
          card_icon_color_dark: string | null
          card_icon_color_light: string | null
          card_title_color_dark: string | null
          card_title_color_light: string | null
          card_title_font_family_en: string | null
          card_title_font_family_th: string | null
          card_title_font_size: number | null
          explore_color_dark: string | null
          explore_color_light: string | null
          explore_font_family_en: string | null
          explore_font_family_th: string | null
          explore_font_size: number | null
          eyebrow_color_dark: string | null
          eyebrow_color_light: string | null
          eyebrow_font_family_en: string | null
          eyebrow_font_family_th: string | null
          eyebrow_font_size: number | null
          id: string
          plan_badge_color_dark: string | null
          plan_badge_color_light: string | null
          plan_badge_font_family_en: string | null
          plan_badge_font_family_th: string | null
          plan_badge_font_size: number | null
          plan_cta_color_dark: string | null
          plan_cta_color_light: string | null
          plan_cta_font_family_en: string | null
          plan_cta_font_family_th: string | null
          plan_cta_font_size: number | null
          plan_currency_color_dark: string | null
          plan_currency_color_light: string | null
          plan_currency_font_family_en: string | null
          plan_currency_font_family_th: string | null
          plan_currency_font_size: number | null
          plan_desc_color_dark: string | null
          plan_desc_color_light: string | null
          plan_desc_font_family_en: string | null
          plan_desc_font_family_th: string | null
          plan_desc_font_size: number | null
          plan_feature_color_dark: string | null
          plan_feature_color_light: string | null
          plan_feature_font_family_en: string | null
          plan_feature_font_family_th: string | null
          plan_feature_font_size: number | null
          plan_period_color_dark: string | null
          plan_period_color_light: string | null
          plan_period_font_family_en: string | null
          plan_period_font_family_th: string | null
          plan_period_font_size: number | null
          plan_price_color_dark: string | null
          plan_price_color_light: string | null
          plan_price_font_family_en: string | null
          plan_price_font_family_th: string | null
          plan_price_font_size: number | null
          plan_title_color_dark: string | null
          plan_title_color_light: string | null
          plan_title_font_family_en: string | null
          plan_title_font_family_th: string | null
          plan_title_font_size: number | null
          title_color_dark: string | null
          title_color_light: string | null
          title_font_family_en: string | null
          title_font_family_th: string | null
          title_font_size: number | null
          updated_at: string | null
        }
        Insert: {
          card_bg_dark?: string | null
          card_bg_light?: string | null
          card_body_color_dark?: string | null
          card_body_color_light?: string | null
          card_body_font_family_en?: string | null
          card_body_font_family_th?: string | null
          card_body_font_size?: number | null
          card_border_dark?: string | null
          card_border_light?: string | null
          card_icon_bg_dark?: string | null
          card_icon_bg_light?: string | null
          card_icon_color_dark?: string | null
          card_icon_color_light?: string | null
          card_title_color_dark?: string | null
          card_title_color_light?: string | null
          card_title_font_family_en?: string | null
          card_title_font_family_th?: string | null
          card_title_font_size?: number | null
          explore_color_dark?: string | null
          explore_color_light?: string | null
          explore_font_family_en?: string | null
          explore_font_family_th?: string | null
          explore_font_size?: number | null
          eyebrow_color_dark?: string | null
          eyebrow_color_light?: string | null
          eyebrow_font_family_en?: string | null
          eyebrow_font_family_th?: string | null
          eyebrow_font_size?: number | null
          id?: string
          plan_badge_color_dark?: string | null
          plan_badge_color_light?: string | null
          plan_badge_font_family_en?: string | null
          plan_badge_font_family_th?: string | null
          plan_badge_font_size?: number | null
          plan_cta_color_dark?: string | null
          plan_cta_color_light?: string | null
          plan_cta_font_family_en?: string | null
          plan_cta_font_family_th?: string | null
          plan_cta_font_size?: number | null
          plan_currency_color_dark?: string | null
          plan_currency_color_light?: string | null
          plan_currency_font_family_en?: string | null
          plan_currency_font_family_th?: string | null
          plan_currency_font_size?: number | null
          plan_desc_color_dark?: string | null
          plan_desc_color_light?: string | null
          plan_desc_font_family_en?: string | null
          plan_desc_font_family_th?: string | null
          plan_desc_font_size?: number | null
          plan_feature_color_dark?: string | null
          plan_feature_color_light?: string | null
          plan_feature_font_family_en?: string | null
          plan_feature_font_family_th?: string | null
          plan_feature_font_size?: number | null
          plan_period_color_dark?: string | null
          plan_period_color_light?: string | null
          plan_period_font_family_en?: string | null
          plan_period_font_family_th?: string | null
          plan_period_font_size?: number | null
          plan_price_color_dark?: string | null
          plan_price_color_light?: string | null
          plan_price_font_family_en?: string | null
          plan_price_font_family_th?: string | null
          plan_price_font_size?: number | null
          plan_title_color_dark?: string | null
          plan_title_color_light?: string | null
          plan_title_font_family_en?: string | null
          plan_title_font_family_th?: string | null
          plan_title_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Update: {
          card_bg_dark?: string | null
          card_bg_light?: string | null
          card_body_color_dark?: string | null
          card_body_color_light?: string | null
          card_body_font_family_en?: string | null
          card_body_font_family_th?: string | null
          card_body_font_size?: number | null
          card_border_dark?: string | null
          card_border_light?: string | null
          card_icon_bg_dark?: string | null
          card_icon_bg_light?: string | null
          card_icon_color_dark?: string | null
          card_icon_color_light?: string | null
          card_title_color_dark?: string | null
          card_title_color_light?: string | null
          card_title_font_family_en?: string | null
          card_title_font_family_th?: string | null
          card_title_font_size?: number | null
          explore_color_dark?: string | null
          explore_color_light?: string | null
          explore_font_family_en?: string | null
          explore_font_family_th?: string | null
          explore_font_size?: number | null
          eyebrow_color_dark?: string | null
          eyebrow_color_light?: string | null
          eyebrow_font_family_en?: string | null
          eyebrow_font_family_th?: string | null
          eyebrow_font_size?: number | null
          id?: string
          plan_badge_color_dark?: string | null
          plan_badge_color_light?: string | null
          plan_badge_font_family_en?: string | null
          plan_badge_font_family_th?: string | null
          plan_badge_font_size?: number | null
          plan_cta_color_dark?: string | null
          plan_cta_color_light?: string | null
          plan_cta_font_family_en?: string | null
          plan_cta_font_family_th?: string | null
          plan_cta_font_size?: number | null
          plan_currency_color_dark?: string | null
          plan_currency_color_light?: string | null
          plan_currency_font_family_en?: string | null
          plan_currency_font_family_th?: string | null
          plan_currency_font_size?: number | null
          plan_desc_color_dark?: string | null
          plan_desc_color_light?: string | null
          plan_desc_font_family_en?: string | null
          plan_desc_font_family_th?: string | null
          plan_desc_font_size?: number | null
          plan_feature_color_dark?: string | null
          plan_feature_color_light?: string | null
          plan_feature_font_family_en?: string | null
          plan_feature_font_family_th?: string | null
          plan_feature_font_size?: number | null
          plan_period_color_dark?: string | null
          plan_period_color_light?: string | null
          plan_period_font_family_en?: string | null
          plan_period_font_family_th?: string | null
          plan_period_font_size?: number | null
          plan_price_color_dark?: string | null
          plan_price_color_light?: string | null
          plan_price_font_family_en?: string | null
          plan_price_font_family_th?: string | null
          plan_price_font_size?: number | null
          plan_title_color_dark?: string | null
          plan_title_color_light?: string | null
          plan_title_font_family_en?: string | null
          plan_title_font_family_th?: string | null
          plan_title_font_size?: number | null
          title_color_dark?: string | null
          title_color_light?: string | null
          title_font_family_en?: string | null
          title_font_family_th?: string | null
          title_font_size?: number | null
          updated_at?: string | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
