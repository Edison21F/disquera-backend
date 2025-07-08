import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ 
  timestamps: true,
  collection: 'analytics_data'
})
export class AnalyticsData {
  @Prop({ required: true, index: true })
  entity_type: string; // 'user', 'artist', 'album', 'song', 'event'

  @Prop({ required: true, index: true })
  entity_id: number;

  @Prop({ required: true, index: true })
  metric_type: string; // 'plays', 'purchases', 'shares', 'likes', etc.

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ type: Object })
  metadata: {
    source?: string; // 'spotify', 'youtube', 'website', etc.
    country?: string;
    device_type?: string;
    user_segment?: string;
    [key: string]: any;
  };

  @Prop({ default: 'daily' })
  aggregation_period: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export const AnalyticsDataSchema = SchemaFactory.createForClass(AnalyticsData);
