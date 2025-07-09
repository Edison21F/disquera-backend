import { Schema, Document } from 'mongoose';

export const ManagerMetadataSchema = new Schema({
  id_manager: { type: Number, required: true, unique: true },
  biografia: { type: String, default: '' },
  url_imagen_perfil: { type: String, default: '' },
  experiencia: { type: String, default: '' },
  redes_sociales: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    tiktok: { type: String, default: '' }
  },
  notas_adicionales: { type: String, default: '' },
  artistas_gestionados: { type: [String], default: [] },
  contacto_profesional: {
    telefono: { type: String, default: '' },
    email_profesional: { type: String, default: '' },
    direccion_oficina: { type: String, default: '' },
    horario_atencion: { type: String, default: '' }
  },
  especialidades: {
    generos_musicales: { type: [String], default: [] },
    servicios_ofrecidos: { type: [String], default: [] },
    idiomas: { type: [String], default: [] }
  },
  estadisticas: {
    años_experiencia: { type: Number, default: 0 },
    total_artistas_gestionados: { type: Number, default: 0 },
    eventos_organizados: { type: Number, default: 0 },
    contratos_cerrados: { type: Number, default: 0 }
  },
  certificaciones: [{
    nombre: String,
    institucion: String,
    fecha_obtencion: Date,
    vigencia: Date
  }]
}, {
  timestamps: true
});

export interface ManagerMetadata extends Document {
  id_manager: number;
  biografia: string;
  url_imagen_perfil: string;
  experiencia: string;
  redes_sociales: any;
  notas_adicionales: string;
  artistas_gestionados: string[];
  contacto_profesional: any;
  especialidades: any;
  estadisticas: any;
  certificaciones: any[];
}
