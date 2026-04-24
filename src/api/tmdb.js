// TMDB API v4 service
const BASE_URL = 'https://api.themoviedb.org';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// The three curated lists
export const LISTS = [
  { id: '8644544', name: 'Family', slug: 'family' },
  { id: '8644536', name: 'Drama Love Stories', slug: 'drama' },
  { id: '8644539', name: 'Comedy Love Stories', slug: 'comedy' },
];

export async function fetchList(listId, page = 1) {
  const res = await fetch(
    `${BASE_URL}/4/list/${listId}?page=${page}&language=en-US`,
    { headers }
  );
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

export async function fetchMovieDetails(movieId) {
  const res = await fetch(
    `${BASE_URL}/3/movie/${movieId}?language=en-US&append_to_response=credits`,
    { headers }
  );
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}
