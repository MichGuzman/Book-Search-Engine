// server/src/models/User.ts

import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcryptjs'; // Recomendado para compatibilidad cross-platform

// Importa correctamente el esquema de Book
import bookSchema from './Book.js';
import type { BookDocument } from './Book.js';

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  savedBooks: BookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema], // subdocumentos (libros)
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Middleware: encripta la contraseña si es nueva o modificada
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Método de instancia: compara password ingresado con hash
userSchema.methods.isCorrectPassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Virtual: cantidad de libros guardados
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

// Exporta el modelo
const User = model<UserDocument>('User', userSchema);
export default User;
