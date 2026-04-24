import { Link, useLocation } from 'react-router-dom';
import { LISTS } from '../api/tmdb';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🎬 MovieLists</Link>
      <div className="navbar-links">
        {LISTS.map((list) => (
          <Link
            key={list.id}
            to={`/list/${list.id}`}
            className={`navbar-link ${pathname === `/list/${list.id}` ? 'active' : ''}`}
          >
            {list.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
