import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchMovieDetails, IMAGE_BASE } from '../api/tmdb';
import './MovieDetail.css';

const PLACEHOLDER = 'https://via.placeholder.com/400x600?text=No+Image';

export default function MovieDetail() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMovieDetails(movieId)
      .then(setMovie)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [movieId]);

  if (loading) return <div className="status-msg">Loading…</div>;
  if (error) return <div className="status-msg error">Error: {error}</div>;
  if (!movie) return null;

  const poster = movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER;
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const year = movie.release_date?.slice(0, 4) ?? '';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : '';
  const genres = movie.genres?.map((g) => g.name).join(', ') ?? '';
  const cast = movie.credits?.cast?.slice(0, 6).map((c) => c.name).join(', ') ?? '';
  const director = movie.credits?.crew?.find((c) => c.job === 'Director')?.name ?? '';

  return (
    <main className="detail-page">
      {backdrop && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-content">
        <div className="detail-poster-wrap">
          <img src={poster} alt={movie.title} className="detail-poster" />
        </div>

        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>

          <div className="detail-badges">
            {year && <span className="badge">{year}</span>}
            {runtime && <span className="badge">{runtime}</span>}
            {movie.vote_average > 0 && (
              <span className="badge badge-rating">⭐ {movie.vote_average.toFixed(1)}</span>
            )}
          </div>

          {genres && <p className="detail-genres">{genres}</p>}

          {movie.overview && (
            <div className="detail-section">
              <h2>Overview</h2>
              <p>{movie.overview}</p>
            </div>
          )}

          {director && (
            <div className="detail-section">
              <h2>Director</h2>
              <p>{director}</p>
            </div>
          )}

          {cast && (
            <div className="detail-section">
              <h2>Cast</h2>
              <p>{cast}</p>
            </div>
          )}

          {movie.tagline && (
            <blockquote className="detail-tagline">"{movie.tagline}"</blockquote>
          )}
        </div>
      </div>
    </main>
  );
}
