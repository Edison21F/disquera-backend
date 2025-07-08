import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({ 
  timestamps: true,
  collection: 'user_profiles'
})
export class UserProfile {
  @Prop({ required: true, unique: true, index: true })
  user_id: number; // Referencia a MySQL users.id

  @Prop({ trim: true })
  first_name: string;

  @Prop({ trim: true })
  last_name: string;

  @Prop({ trim: true })
  profession: string;

  @Prop()
  profile_photo_url: string;

  @Prop({ type: Object, default: {} })
  social_networks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    spotify?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
  };

  @Prop([String])
  favorite_topics: string[];

  @Prop({ type: Object, default: {} })
  preferences: {
    favorite_genres?: string[];
    favorite_artists?: number[]; // IDs de MySQL
    favorite_albums?: number[];
    favorite_songs?: number[];
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    privacy?: {
      profile_visibility: 'public' | 'friends' | 'private';
      show_activity: boolean;
      show_playlists: boolean;
    };
    playback?: {
      auto_play: boolean;
      shuffle_mode: boolean;
      repeat_mode: 'none' | 'one' | 'all';
      volume_level: number;
    };
  };

  @Prop({ type: Object })
  location: {
    country?: string;
    city?: string;
    state?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    timezone?: string;
  };

  @Prop({ type: Object })
  activity_stats: {
    total_plays?: number;
    total_purchases?: number;
    total_playlists?: number;
    total_favorites?: number;
    last_login?: Date;
    listening_time_minutes?: number;
  };

  @Prop([{ type: Object }])
  recent_activity: {
    action: string; // 'play', 'purchase', 'favorite', 'share'
    entity_type: string; // 'song', 'album', 'artist'
    entity_id: number;
    timestamp: Date;
    metadata?: any;
  }[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);