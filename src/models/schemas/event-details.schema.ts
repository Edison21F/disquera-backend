import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ 
  timestamps: true,
  collection: 'event_details'
})
export class EventDetails {
  @Prop({ required: true, unique: true, index: true })
  event_id: number; // Referencia a MySQL events.id

  @Prop({ type: String })
  description: string;

  @Prop([String])
  flyer_urls: string[];

  @Prop({ type: Object })
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
    social_media?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };

  @Prop({ type: Object })
  ticket_info: {
    price_ranges?: {
      category: string;
      price: number;
      currency: string;
      available: number;
      sold: number;
    }[];
    sales_start?: Date;
    sales_end?: Date;
    ticket_urls?: {
      platform: string;
      url: string;
    }[];
    box_office?: {
      address: string;
      hours: string;
      phone: string;
    };
  };

  @Prop([Number]) // IDs adicionales de MySQL artists
  featured_artists: number[];

  @Prop({ type: Object })
  venue_details: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    capacity?: number;
    amenities?: string[];
    parking_info?: string;
    accessibility?: string[];
    age_restrictions?: string;
  };

  @Prop([{ type: Object }])
  attachments: {
    type: 'image' | 'video' | 'document' | 'audio';
    title: string;
    url: string;
    description?: string;
    size?: number;
  }[];

  @Prop({ type: Object })
  logistics: {
    doors_open?: string;
    show_start?: string;
    estimated_end?: string;
    setup_time?: string;
    soundcheck_time?: string;
    load_in_time?: string;
  };

  @Prop([{ type: Object }])
  sponsors: {
    name: string;
    logo_url?: string;
    website?: string;
    level: 'title' | 'presenting' | 'supporting' | 'media';
  }[];

  @Prop({ type: Object })
  promotion: {
    press_release?: string;
    media_kit_url?: string;
    promotional_images?: string[];
    radio_spots?: string[];
    social_media_assets?: string[];
  };
}

export const EventDetailsSchema = SchemaFactory.createForClass(EventDetails);
