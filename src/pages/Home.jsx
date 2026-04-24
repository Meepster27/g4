import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchList, LISTS } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import './Home.css';

export default function Home() {
  const [listData, setListData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const results = await Promise.all(
          LISTS.map((l) => fetchList(l.id).then((data) => ({ id: l.id, data })))
        );
        const map = {};
        results.forEach(({ id, data }) => {
          map[id] = data;
        });
        setListData(map);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  if (loading) return <div className="status-msg">Loading lists…</div>;
  if (error) return <div className="status-msg error">Error: {error}</div>;

  return (
    <main className="home">
      <div className="home-hero">
        <h1>Welcome to MovieLists</h1>
        <p>Curated collections of great films — family favourites, heartfelt dramas, and laugh-out-loud comedies.</p>
      </div>

      {LISTS.map((list) => {
        const data = listData[list.id];
        const movies = data?.results?.slice(0, 8) ?? [];
        return (
          <section key={list.id} className="list-section">
            <div className="list-section-header">
              <h2>{list.name}</h2>
              <Link to={`/list/${list.id}`} className="see-all-btn">See all →</Link>
            </div>
            <div className="card-row">
              {movies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
