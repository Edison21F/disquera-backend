import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ 
  timestamps: true,
  collection: 'acquisition_documents'
})
export class AcquisitionDocuments {
  @Prop({ required: true, unique: true, index: true })
  acquisition_id: number; // Referencia a MySQL artist_acquisitions.id
  

  @Prop()
  contract_url: string;

  @Prop([String])
  legal_documents: string[];

  @Prop([{ type: Object }])
  negotiation_history: {
    date: Date;
    action: string;
    amount?: number;
    notes: string;
    participants: string[];
    documents?: string[];
  }[];

  @Prop({ type: Object })
  contract_terms: {
    duration_months?: number;
    royalty_percentage?: number;
    advance_payment?: number;
    territorial_rights?: string[];
    exclusive?: boolean;
    renewal_options?: {
      periods: number;
      terms: string;
    };
    termination_clauses?: string[];
    performance_requirements?: string[];
  };

  @Prop({ type: Object })
  financial_details: {
    initial_payment?: number;
    milestone_payments?: {
      milestone: string;
      amount: number;
      due_date: Date;
      completed: boolean;
    }[];
    revenue_splits?: {
      category: string; // 'streaming', 'physical', 'licensing', etc.
      artist_percentage: number;
      label_percentage: number;
    }[];
    recoupment_details?: {
      advance_amount: number;
      recouped_amount: number;
      outstanding_balance: number;
    };
  };
   


  @Prop([{ type: Object }])
  amendments: {
    date: Date;
    description: string;
    document_url: string;
    effective_date: Date;
  }[];

  @Prop({ type: Object })
  compliance: {
    last_audit_date?: Date;
    next_audit_date?: Date;
    compliance_status: 'compliant' | 'warning' | 'breach';
    issues?: string[];
    resolutions?: string[];
  };
}

export const AcquisitionDocumentsSchema = SchemaFactory.createForClass(AcquisitionDocuments);
