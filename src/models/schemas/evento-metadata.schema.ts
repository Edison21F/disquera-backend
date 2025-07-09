import { Schema, Document } from 'mongoose';

export const EventoMetadataSchema = new Schema({
  id_evento: { type: Number, required: true, unique: true },
  artistas_invitados: { type: [String], default: [] },
  archivos_adjuntos: { type: [String], default: [] },
  precio_entrada: {
    general: { type: Number, default: 0 },
    vip: { type: Number, default: 0 },
    estudiantes: { type: Number, default: 0 }
  },
  requisitos_tecnicos: {
    sonido: { type: [String], default: [] },
    iluminacion: { type: [String], default: [] },
    escenario: { type: String, default: '' },
    otros: { type: String, default: '' }
  },
  sponsors: { type: String, default: '' },
  politicas_evento: {
    edad_minima: { type: Number, default: 0 },
    prohibiciones: { type: [String], default: [] },
    reembolsos: { type: String, default: '' }
  },
  estadisticas: {
    entradas_vendidas: { type: Number, default: 0 },
    asistentes_confirmados: { type: Number, default: 0 },
    ingresos_generados: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export interface EventoMetadata extends Document {
  id_evento: number;
  artistas_invitados: string[];
  archivos_adjuntos: string[];
  precio_entrada: any;
  requisitos_tecnicos: any;
  sponsors: string;
  politicas_evento: any;
  estadisticas: any;
}
