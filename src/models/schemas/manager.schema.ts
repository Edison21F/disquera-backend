import { Schema } from "mongoose";

export const ManagerSchema = new Schema({
    id_manager: { type: Number, required: true },
    biografia: { type: String, required: true },
    url_imagen_perfil: { type: String, required: true },
    experiencia: { type: String, required: true },
    redes_sociales: { type: Object, required: true },
    notas_adicionales: { type: String, required: true },
});

export interface Manager extends Document {
    id_manager: number;
    biografia: string;
    url_imagen_perfil: string;
    experiencia: string;
    redes_sociales: object;
    notas_adicionales: string;
}
