// Define los tipos para datos de usuario y libros
export interface UserInput {
  username?: string;
  email: string;
  password?: string;
}

export interface BookInput {
  bookId: string;
  authors?: string[];
  description?: string;
  title: string;
  image?: string;
  link?: string;
}

// route to get logged in user's info (needs the token)
export const getMe = (token: string): Promise<Response> => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (userData: UserInput): Promise<Response> => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData: UserInput): Promise<Response> => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged in user
export const saveBook = (bookData: BookInput, token: string): Promise<Response> => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId: string, token: string): Promise<Response> => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// make a search to google books api
export const searchGoogleBooks = (query: string): Promise<Response> => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
