// server/src/models/Book.ts

import { Schema, type Document } from 'mongoose';

/**
 * Representa un libro guardado por el usuario
 */
export interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

// Creamos el esquema sin _id porque será usado como subdocumento
const bookSchema = new Schema<BookDocument>(
  {
    bookId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: [String],
    description: String,
    image: String,
    link: String,
  },
  {
    _id: false, // ✅ Especificamos que no queremos un _id por subdocumento
  }
);

export default bookSchema;
