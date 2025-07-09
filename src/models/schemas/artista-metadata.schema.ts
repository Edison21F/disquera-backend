import { Schema, Document } from 'mongoose';

export const ArtistaMetadataSchema = new Schema({
  id_artista: { type: Number, required: true, unique: true },
  redes_sociales: { type: [String], default: [] },
  rider_tecnico: { 
    equipos_audio: { type: [String], default: [] },
    iluminacion: { type: [String], default: [] },
    catering: { type: String, default: '' },
    hospedaje: { type: String, default: '' },
    transporte: { type: String, default: '' },
    otros_requerimientos: { type: String, default: '' }
  },
  generos_secundarios: { type: [String], default: [] },
  manager_contacto: { type: String, default: '' },
  discografia_externa: [{
    titulo: String,
    año: Number,
    sello: String,
    plataforma: String
  }],
  estadisticas: {
    reproducciones_totales: { type: Number, default: 0 },
    seguidores_totales: { type: Number, default: 0 },
    conciertos_realizados: { type: Number, default: 0 }
  },
  fechas_importantes: [{
    evento: String,
    fecha: Date,
    descripcion: String
  }]
}, {
  timestamps: true
});

export interface ArtistaMetadata extends Document {
  id_artista: number;
  redes_sociales: string[];
  rider_tecnico: any;
  generos_secundarios: string[];
  manager_contacto: string;
  discografia_externa: any[];
  estadisticas: any;
  fechas_importantes: any[];
}