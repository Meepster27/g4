import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchList, LISTS } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import './ListPage.css';

export default function ListPage() {
  const { listId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const listMeta = LISTS.find((l) => l.id === listId);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchList(listId, page)
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [listId, page]);

  // Reset page when list changes
  useEffect(() => {
    setPage(1);
  }, [listId]);

  if (loading) return <div className="status-msg">Loading…</div>;
  if (error) return <div className="status-msg error">Error: {error}</div>;

  const totalPages = data?.total_pages ?? 1;
  const movies = data?.results ?? [];

  return (
    <main className="list-page">
      <div className="list-page-header">
        <h1>{data?.name ?? listMeta?.name}</h1>
        {data?.description && <p className="list-description">{data.description}</p>}
        <span className="list-count">{data?.total_results ?? 0} movies</span>
      </div>

      <div className="list-page-grid">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="page-info">Page {page} / {totalPages}</span>
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}
