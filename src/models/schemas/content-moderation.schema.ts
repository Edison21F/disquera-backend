import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ 
  timestamps: true,
  collection: 'content_moderation'
})
export class ContentModeration {
  @Prop({ required: true, index: true })
  content_type: string; // 'song', 'album', 'artist_bio', 'user_comment', etc.

  @Prop({ required: true, index: true })
  content_id: number;

  @Prop({ required: true })
  status: 'pending' | 'approved' | 'rejected' | 'flagged';

  @Prop([{ type: Object }])
  flags: {
    type: string; // 'explicit_content', 'copyright_violation', 'inappropriate', etc.
    severity: 'low' | 'medium' | 'high';
    reporter_id?: number;
    description: string;
    timestamp: Date;
  }[];

  @Prop({ type: Object })
  moderation_notes: {
    moderator_id?: number;
    decision: string;
    reason: string;
    timestamp: Date;
  };

  @Prop({ type: Object })
  automated_checks: {
    copyright_scan?: {
      status: 'pass' | 'fail' | 'manual_review';
      matches?: string[];
      confidence: number;
    };
    content_filter?: {
      explicit_language: boolean;
      violence: boolean;
      hate_speech: boolean;
      confidence: number;
    };
    audio_analysis?: {
      quality_score: number;
      technical_issues?: string[];
    };
  };
}

export const ContentModerationSchema = SchemaFactory.createForClass(ContentModeration);
