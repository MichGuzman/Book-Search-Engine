// client/src/utils/localStorage.ts

/**
 * Obtiene los IDs de libros guardados desde localStorage.
 * @returns Un arreglo de strings con los bookIds guardados.
 */
export const getSavedBookIds = (): string[] => {
  const savedBookIds = localStorage.getItem('saved_books');
  return savedBookIds ? JSON.parse(savedBookIds) : [];
};

/**
 * Guarda un arreglo de IDs de libros en localStorage.
 * @param bookIdArr Un arreglo de bookIds para guardar.
 */
export const saveBookIds = (bookIdArr: string[]): void => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

/**
 * Elimina un ID de libro específico del arreglo en localStorage.
 * @param bookId ID del libro a eliminar.
 */
export const removeBookId = (bookId: string): void => {
  const savedBookIds = getSavedBookIds();
  if (!savedBookIds.length) return;

  const updatedBookIds = savedBookIds.filter((id) => id !== bookId);
  saveBookIds(updatedBookIds);
};
