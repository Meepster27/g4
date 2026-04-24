const BASE_URL = 'https://api.themoviedb.org';

// TMDB v4 Read Access Token
const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMWQ4MmI0MTI0YjQ5YTUxZGVmNjFlYWE0OGFmZjFlMSIsIm5iZiI6MTc3NTU3NDU4Ny40NjIwMDAxLCJzdWIiOiI2OWQ1MWUzYmJmMjhiNTM4YzUzMTNlMGMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.axcH7i19C8pA6MmL0WPvO4fhdO5dkczEHTkav59n2JQ';

const HEADERS = {
  accept: 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};

export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

export const LISTS = [
  { id: '8644544', name: 'Family' },
  { id: '8644536', name: 'Drama Love Stories' },
  { id: '8644539', name: 'Comedy Love Stories' },
];

export async function fetchList(listId, page = 1) {
  const res = await fetch(
    `${BASE_URL}/4/list/${listId}?page=${page}&language=en-US`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

export async function fetchMovieDetails(movieId) {
  const res = await fetch(
    `${BASE_URL}/3/movie/${movieId}?language=en-US&append_to_response=credits`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}
