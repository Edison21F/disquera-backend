import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ 
  timestamps: true,
  collection: 'song_metadata'
})
export class SongMetadata {
  @Prop({ required: true, unique: true, index: true })
  song_id: number; // Referencia a MySQL songs.id

  @Prop()
  cover_art_url: string;

  @Prop({ type: String })
  lyrics: string;

  @Prop()
  audio_url: string;

  @Prop({ type: Object })
  streaming_urls: {
    spotify?: string;
    apple_music?: string;
    youtube?: string;
    soundcloud?: string;
    bandcamp?: string;
  };

  @Prop({ type: Object })
  audio_features: {
    tempo?: number;
    key?: string;
    time_signature?: string;
    energy?: number; // 0-1
    danceability?: number; // 0-1
    valence?: number; // 0-1
    acousticness?: number; // 0-1
    instrumentalness?: number; // 0-1
    liveness?: number; // 0-1
    speechiness?: number; // 0-1
    loudness?: number; // dB
  };

  @Prop({ type: Object, index: true })
  play_stats: {
    total_plays?: number;
    monthly_plays?: number;
    weekly_plays?: number;
    daily_plays?: number;
    unique_listeners?: number;
    skip_rate?: number;
    completion_rate?: number;
    last_updated?: Date;
  };

  @Prop([{ type: Object }])
  credits: {
    role: string; // 'songwriter', 'producer', 'mixer', etc.
    name: string;
    percentage?: number;
  }[];

  @Prop([String])
  moods: string[]; // 'happy', 'sad', 'energetic', etc.

  @Prop([String])
  themes: string[]; // 'love', 'breakup', 'party', etc.

  @Prop({ type: Object })
  technical_info: {
    bitrate?: number;
    sample_rate?: number;
    format?: string;
    file_size?: number;
    duration_ms?: number;
  };

  @Prop([{ type: Object }])
  versions: {
    version_type: 'original' | 'remix' | 'acoustic' | 'live' | 'instrumental';
    title: string;
    audio_url: string;
    duration?: string;
    credits?: string[];
  }[];
}

export const SongMetadataSchema = SchemaFactory.createForClass(SongMetadata);
