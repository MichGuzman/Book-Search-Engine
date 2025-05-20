import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries.ts';
import { REMOVE_BOOK } from '../utils/mutations';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import AuthService from '../utils/auth'; // para logout si decides usarlo

const Profile = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: GET_ME }],
  });

  const userData = data?.me || { savedBooks: [] };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await removeBook({ variables: { bookId } });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>Loading your profile...</h2>;

  return (
    <Container>
      <h2 className='pt-3'>
        {userData.username}'s Saved Books ({userData.savedBooks.length})
      </h2>

      <Row>
        {userData.savedBooks.map((book: any) => (
          <Col md="4" key={book.bookId} className='my-3'>
            <Card border="dark">
              {book.image && <Card.Img src={book.image} alt={book.title} variant="top" />}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {book.authors?.join(', ')}
                </Card.Subtitle>
                <Card.Text>{book.description}</Card.Text>
                <Button variant="danger" onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Profile;
