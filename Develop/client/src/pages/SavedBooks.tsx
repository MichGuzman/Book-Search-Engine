import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import type { Book } from '../models/Book';

const SavedBooks = () => {
  const { loading, data, refetch } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me || { savedBooks: [], username: '', email: '' };

  const handleDeleteBook = async (bookId: string) => {
    if (!Auth.loggedIn()) return;

    try {
      await removeBook({
        variables: { bookId },
        update(cache) {
          try {
            const existing: any = cache.readQuery({ query: GET_ME });

            if (!existing?.me?.savedBooks) return;

            const updatedBooks = existing.me.savedBooks.filter(
              (book: Book) => book.bookId !== bookId
            );

            cache.writeQuery({
              query: GET_ME,
              data: {
                me: {
                  ...existing.me,
                  savedBooks: updatedBooks,
                },
              },
            });
          } catch (err) {
            console.warn('⚠️ Cache update failed, using refetch fallback.');
          }
        },
      });

      removeBookId(bookId);
      await refetch(); // Garantiza que el frontend se sincronice
    } catch (err) {
      console.error('❌ Error deleting book:', err);
    }
  };

  if (loading) return <h2 className="text-center">LOADING...</h2>;

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing {userData.username || 'your'} saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `You have ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: Book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image && (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">
                    Authors: {book.authors?.join(', ') || 'N/A'}
                  </p>
                  <Card.Text>{book.description || 'No description available.'}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
