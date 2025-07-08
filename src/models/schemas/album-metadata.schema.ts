import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ 
  timestamps: true,
  collection: 'album_metadata'
})
export class AlbumMetadata {
  @Prop({ required: true, unique: true, index: true })
  album_id: number; // Referencia a MySQL albums.id

  @Prop([String])
  cover_art_urls: string[];

  @Prop({ type: String })
  description: string;

  @Prop()
  producer: string;

  @Prop()
  recording_studio: string;

  @Prop({ type: Object })
  credits: {
    vocals?: string[];
    instruments?: {
      instrument: string;
      player: string;
    }[];
    production?: {
      role: string;
      name: string;
    }[];
    songwriting?: {
      song_title: string;
      writers: string[];
    }[];
  };

  @Prop({ type: Object })
  streaming_urls: {
    spotify?: string;
    apple_music?: string;
    youtube?: string;
    amazon_music?: string;
    deezer?: string;
    tidal?: string;
  };

  @Prop([{ type: Object }])
  reviews: {
    reviewer: string;
    publication?: string;
    rating: number;
    max_rating: number;
    comment: string;
    review_url?: string;
    date: Date;
  }[];

  @Prop({ type: Object })
  recording_details: {
    recording_dates?: {
      start_date: Date;
      end_date: Date;
    };
    studios?: string[];
    engineers?: string[];
    mastered_by?: string;
    mixed_by?: string;
  };

  @Prop({ type: Object })
  sales_stats: {
    total_sales?: number;
    digital_sales?: number;
    physical_sales?: number;
    streaming_revenue?: number;
    last_updated?: Date;
  };

  @Prop([String])
  tags: string[];

  @Prop([{ type: Object }])
  bonus_content: {
    type: 'video' | 'audio' | 'document' | 'image';
    title: string;
    url: string;
    description?: string;
  }[];
}

export const AlbumMetadataSchema = SchemaFactory.createForClass(AlbumMetadata);
