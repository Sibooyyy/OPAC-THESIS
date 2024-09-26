import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../App';

const AdvanceSearch = () => {
    const options = ['Title', 'Author', 'Accession Number', 'Publisher', 'ISBN/ISSN', 'Category'];
    const operators = ['AND', 'OR', 'NOT'];

    const { addReservedBook } = useContext(AuthContext);

    const [searchCriteria, setSearchCriteria] = useState({
        option1: '',
        expression1: '',
        option2: '',
        expression2: '',
        operator: ''
    });

    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        const { option1, expression1, option2, expression2, operator } = searchCriteria;

        if (!option1 || !expression1 || !operator || !option2 || !expression2) {
            setError('Please select fields, enter expressions, and choose an operator.');
            return;
        }

        const searchData = {
            conditions: [
                { field: options[option1], expression: expression1 },
                { field: options[option2], expression: expression2 }
            ],
            operator: operators[operator]
        };

        try {
            const response = await axios.post('http://localhost:8081/search/book', searchData);
            if (response.data.status) {
                setResults(response.data.data);
                setError('');
            } else {
                setError(response.data.message);
                setResults([]);
            }
        } catch (err) {
            setError('Error searching for books');
            setResults([]);
        }
    };

    const handleClear = () => {
        setSearchCriteria({
            option1: '',
            expression1: '',
            option2: '',
            expression2: '',
            operator: ''
        });
        setResults([]);
        setError('');
    };

    const handleReserveBook = (book) => {
        addReservedBook(book); // Add the selected book to the reserved books list
    };

    return (
        <div className='w-full h-screen p-6 md:p-12 bg-[#0CA1E2] flex flex-col items-center gap-5'>
            <h1 className='font-poppins text-white text-2xl md:text-3xl font-bold'>Advance Search</h1>
            <p className='font-poppins text-white text-sm md:text-lg'>Search the library's holdings for books, digital records, periodicals, and more</p>
            <form className='flex flex-col md:flex-row gap-6 items-center mt-1 w-full max-w-5xl' onSubmit={handleSearch}>
                <div className='flex flex-col text-center gap-3'>
                    <h1 className='text-white font-montserrat font-semibold text-base md:text-lg'>Search Field</h1>
                    <select
                        className='py-2 pl-2 w-full md:w-56 rounded-lg font-montserrat text-md'
                        name="option1"
                        value={searchCriteria.option1}
                        onChange={handleChange}
                    >
                        <option hidden>Select</option>
                        {options.map((item, index) => (
                            <option value={index} key={item}>{item}</option>
                        ))}
                    </select>
                    <select
                        className='py-2 pl-2 w-full md:w-56 rounded-lg font-montserrat text-md'
                        name="option2"
                        value={searchCriteria.option2}
                        onChange={handleChange}
                    >
                        <option hidden>Select</option>
                        {options.map((item, index) => (
                            <option value={index} key={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col text-center gap-3'>
                    <h1 className='text-white font-montserrat font-semibold text-base md:text-lg'>Search Expression</h1>
                    <input
                        className="py-2 pl-2 rounded-lg w-full md:w-72 font-montserrat text-md"
                        type="text"
                        placeholder="Type Something ..."
                        name="expression1"
                        value={searchCriteria.expression1}
                        onChange={handleChange}
                    />
                    <input
                        className="py-2 pl-2 rounded-lg w-full md:w-72 font-montserrat text-md"
                        type="text"
                        placeholder="Type Something ..."
                        name="expression2"
                        value={searchCriteria.expression2}
                        onChange={handleChange}
                    />
                </div>
                <div className='flex flex-col text-center gap-3'>
                    <h1 className='text-white font-montserrat font-semibold text-base md:text-lg'>Operator</h1>
                    <select
                        className='py-2 pl-2 w-full md:w-56 rounded-lg font-montserrat text-md'
                        name="operator"
                        value={searchCriteria.operator}
                        onChange={handleChange}
                    >
                        <option hidden>Select Operator</option>
                        {operators.map((item, index) => (
                            <option value={index} key={item}>{item}</option>
                        ))}
                    </select>
                </div>
                <div className='flex mt-10 gap-1'>
                    <button
                        type="submit"
                        className="bg-[#161D6F] text-white py-2 w-24 rounded-lg cursor-pointer font-montserrat text-xs md:text-sm hover:bg-[#161D6F]/70"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        className="bg-[#161D6F] text-white py-2 w-24 rounded-lg cursor-pointer font-montserrat text-xs md:text-sm hover:bg-[#161D6F]/70"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 font-montserrat mt-4">{error}</p>}

            {results.length > 0 && (
                <div className='mt-5 w-full'>
                    <table className='min-w-full bg-white rounded-lg overflow-hidden shadow-lg'>
                        <thead className='bg-[#161D6F] text-white text-center'>
                            <tr>
                                <th className='py-3 px-5'>Title</th>
                                <th className='py-3 px-5'>Author</th>
                                <th className='py-3 px-5'>Accession Number</th>
                                <th className='py-3 px-5'>Publisher</th>
                                <th className='py-3 px-5'>ISBN/ISSN</th>
                                <th className='py-3 px-5'>Category</th>
                                <th className='py-3 px-5'>Status</th>
                                <th className='py-3 px-5'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((book, index) => (
                                <tr key={index} className='border-b text-center'>
                                    <td className='py-2 px-5'>{book.title}</td>
                                    <td className='py-2 px-5'>{book.author}</td>
                                    <td className='py-2 px-5'>{book.accession_number}</td>
                                    <td className='py-2 px-5'>{book.publisher}</td>
                                    <td className='py-2 px-5'>{book.isbn_issn}</td>
                                    <td className='py-2 px-5'>{book.category}</td>
                                    <td className='py-2 px-5'>
                                        {book.book_status === 'available' ? (
                                            <span className='bg-green-500 text-white px-3 py-1 rounded'>
                                                Available
                                            </span>
                                        ) : book.book_status === 'borrowed' ? (
                                            <span className='bg-red-500 text-white px-3 py-1 rounded cursor-not-allowed'>
                                                Inactive
                                            </span>
                                        ) : (
                                            <span className='text-gray-500'>Unknown</span>
                                        )}
                                    </td>
                                    <td className='py-2 px-5'>
                                        {book.book_status === 'available' && (
                                            <button className='bg-[#0CA1E2] text-white px-3 py-1 rounded-md hover:bg-[#0A90D2]' onClick={() => handleReserveBook(book)}>
                                                Reserve Book
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdvanceSearch;
