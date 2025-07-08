import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ 
  timestamps: true,
  collection: 'manager_profiles'
})
export class ManagerProfile {
  @Prop({ required: true, unique: true, index: true })
  manager_id: number; // Referencia a MySQL managers.id

  @Prop({ type: String })
  biography: string;

  @Prop()
  profile_photo_url: string;

  @Prop({ type: String })
  experience: string;

  @Prop({ type: Object })
  social_networks: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };

  @Prop([Number]) // IDs de MySQL artists
  managed_artists: number[];

  @Prop({ type: Object })
  contact_info: {
    phone?: string;
    email?: string;
    office_address?: string;
    office_hours?: string;
    emergency_contact?: string;
  };

  @Prop({ type: String })
  additional_notes: string;

  @Prop({ type: Object })
  portfolio: {
    successful_projects?: string[];
    awards?: string[];
    testimonials?: {
      artist_name: string;
      testimonial: string;
      date: Date;
    }[];
    certifications?: string[];
  };

  @Prop({ type: Object })
  business_info: {
    company_name?: string;
    years_in_business?: number;
    specializations?: string[];
    commission_rate?: number;
    territories?: string[];
  };
}

export const ManagerProfileSchema = SchemaFactory.createForClass(ManagerProfile);
