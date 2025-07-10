import { Schema, Document } from 'mongoose';

export const PerfilUsuarioSchema = new Schema({
    id_usuario: { type: Number, required: true },
    profesion: { type: String, required: true },
    foto_perfil_url: { type: String, required: false },
    redes_sociales: { type: String, required: false },
    temas_favoritos: { type: [String], required: false },
});

export interface PerfilUsuario extends Document {
    id_usuario: number;
    profesion: string;
    foto_perfil_url: string;
    redes_sociales: string;
    temas_favoritos: string[];
}
