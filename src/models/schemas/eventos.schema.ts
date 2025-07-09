import { Schema } from "mongoose";

export const EventoSchema = new Schema({
    id_evento: { type: Number, required: true },
    descripcion: { type: String, required: true },
    artistas: { type: [String], required: true },
    contacto: { type: String, required: true },
    url_flyer_evento: { type: String, required: true },
    archivos_adjuntos: { type: [String], required: true },
});

export interface Evento extends Document {
    id_evento: number;
    descripcion: string;
    artistas: string[];
    contacto: string;
    url_flyer_evento: string;
    archivos_adjuntos: string[];
}
