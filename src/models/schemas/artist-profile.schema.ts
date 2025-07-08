import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ 
  timestamps: true,
  collection: 'artist_profiles'
})
export class ArtistProfile {
  @Prop({ required: true, unique: true, index: true })
  artist_id: number; // Referencia a MySQL artists.id

  @Prop({ type: String })
  biography: string;

  @Prop([String])
  photo_urls: string[];

  @Prop({ type: Object, default: {} })
  social_networks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    spotify?: string;
    youtube?: string;
    tiktok?: string;
    soundcloud?: string;
    bandcamp?: string;
    website?: string;
  };

  @Prop({ type: Object })
  discography_details: {
    total_albums?: number;
    total_songs?: number;
    debut_year?: number;
    latest_release?: Date;
    upcoming_releases?: {
      title: string;
      release_date: Date;
      type: 'single' | 'album' | 'ep';
    }[];
  };

  @Prop([String])
  achievements: string[];

  @Prop([Number]) // IDs de otros artistas
  collaborations: number[];

  @Prop({ type: Object })
  streaming_stats: {
    spotify_monthly_listeners?: number;
    youtube_subscribers?: number;
    total_streams?: number;
    top_countries?: string[];
    last_updated?: Date;
  };

  @Prop({ type: Object })
  tour_info: {
    is_touring?: boolean;
    upcoming_shows?: {
      event_id: number;
      venue: string;
      city: string;
      date: Date;
      ticket_url?: string;
    }[];
    past_tours?: {
      name: string;
      year: number;
      countries: string[];
    }[];
  };

  @Prop([{ type: Object }])
  press_coverage: {
    title: string;
    publication: string;
    url: string;
    date: Date;
    excerpt?: string;
  }[];

  @Prop({ type: Object })
  contact_info: {
    booking_email?: string;
    management_email?: string;
    press_email?: string;
    phone?: string;
  };
}

export const ArtistProfileSchema = SchemaFactory.createForClass(ArtistProfile);