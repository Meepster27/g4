import { Link } from 'react-router-dom';
import { IMAGE_BASE } from '../api/tmdb';
import './MovieCard.css';

const PLACEHOLDER = 'https://via.placeholder.com/220x330?text=No+Image';

export default function MovieCard({ movie }) {
  const poster = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : PLACEHOLDER;

  const year = movie.release_date ? movie.release_date.slice(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img src={poster} alt={movie.title} className="movie-card-poster" />
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-year">{year}</span>
          <span className="movie-card-rating">⭐ {rating}</span>
        </div>
      </div>
    </Link>
  );
}
