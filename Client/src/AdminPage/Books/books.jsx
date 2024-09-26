import { useState, useEffect } from 'react';
import Navbar from '../../Components/navbar';
import BookRecord from './book-record';
import BookInfo from './book-info';
import { FaBookOpen } from "react-icons/fa";
import axios from 'axios';
import { bookForm } from '../../utils/utils';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8081/book/data')
      .then(response => {
        if (response.data.status) {
          setBooks(response.data.data);
        }
      })
      .catch(error => {
        console.error('Error fetching books', error);
      });
  }, [update]);

  const handleEditClick = (book) => {
    setSelectedBook(book);
  };

  const handleFormSubmit = (updatedBook) => {
    const endpoint = selectedBook ? 'http://localhost:8081/edit/books' : 'http://localhost:8081/add/book';

    axios.post(endpoint, updatedBook)
      .then(response => {
        if (response.data.status) {
          if (selectedBook) {
            setBooks((prevBooks) =>
              prevBooks.map((book) =>
                book.accession_number === updatedBook.accession_number ? updatedBook : book
              )
            );
          } else {
            setBooks((prevBooks) => [...prevBooks, updatedBook]);
          }
          setUpdate(!update);
        }
      })
      .catch(error => {
        console.error('Error submitting book data', error);
      });

    setSelectedBook(null);
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-row pt-8 items-center pl-[250px] border-b font-montserrat font-bold text-[25px] p-5 gap-1'>
        <FaBookOpen /><span>Books</span>
      </div>
      <div className='h-screen flex justify-between w-[100%] p-[50px] gap-8'>
        {/* Always pass formData to BookInfo */}
        <BookInfo selectedBook={selectedBook} onFormSubmit={handleFormSubmit} />
        <BookRecord books={books} onEditClick={handleEditClick} />
      </div>
    </>
  );
};

export default Books;
