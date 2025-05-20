/**
 * Utilidad para buscar libros en Google Books API
 * @param query término de búsqueda
 * @returns JSON con los resultados del libro
 */
export const searchGoogleBooks = async (query: string) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Google Books API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};
