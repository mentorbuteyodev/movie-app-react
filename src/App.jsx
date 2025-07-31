import { useState, useEffect,} from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { updateSearchCount, useTrendingMovies } from './appwrite'


// TMDB API configuration
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// API options for fetching movies
// This includes the API key and the method for the request
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
}

// Main App component
// This is the main component that renders the entire application
const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Custom hook to fetch trending movies
  const getTrendingMovies = useTrendingMovies();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [errorTrendingMessage, setErrorTrendingMessage] = useState('');



  // Debounce the search term to avoid too many API calls
  // This will wait for  the user to stop typing for 500ms before making the API call
  useDebounce( () => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  // Function to fetch movies from TMDB API
  // This function fetches movies from the TMDB API based on the search term
  // If the search term is empty, it fetches popular movies
  // If the search term is not empty, it fetches movies based on the search term
  // It also updates the search count in Appwrite if a movie is found
  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Faild to fetch movies');
      }
      const data = await response.json();

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Faild to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
          // Update the search count in Appwrite
          await updateSearchCount(query, data.results[0]);
      }

      // console.log(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  // Function to load trending movies
  // This function uses the custom hook to fetch trending movies
  // It sets the trending movies state and handles any errors
  // It is called when the component mounts
  // It also logs the trending movies to the console
  const loadTrendingMovies = async () => {
    try {
      const movie = await getTrendingMovies.fetchTrendingMovies();
      setTrendingMovies(movie);
      
      // console.log('Trending Movies:', movie);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      setErrorTrendingMessage('Failed to fetch trending movies. Please try again later.');
      
    }
  }

  // Load movies when the component mounts
  // This will fetch popular movies when the component mounts
  // It will also fetch movies based on the search term when the user types in the search box
  // It uses the debounced search term to avoid too many API calls
  // Load movies anytime the a movie is searched
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Load trending movies when the component mounts
  useEffect(() => {
    loadTrendingMovies();
  }, []);





  return (
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
        
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Trending Movies Section */}
        {getTrendingMovies.isTrendingLoading? 
        (
            <div className="spinner">
              <Spinner />

            </div>
          )
        : trendingMovies.length > 0 && (
          errorTrendingMessage ? (
            <p className="error-msg">{errorTrendingMessage}</p>
          ) : (
            <section className="trending">
            <h2 className="mt-[40px]">Trending</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
                ))}
            </ul>
          </section>
          )
        )}

        <section className="all-movies">
          <h2 className="mt-[40px]">Popular</h2>

          {isLoading ? (
            <div className="spinner">
              <Spinner />

            </div>
          ) : errorMessage ? (
              <p className="error-msg">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.length > 0 ? (
                movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                ))
              ) : (
                <p className="text-white">No movies found.</p>
              )}
            </ul>
          )}


        </section>

      </div>
    </main>
  )
}

export default App