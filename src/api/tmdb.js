import axios from 'axios';


const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';


const client = axios.create({
baseURL: TMDB_BASE,
params: { api_key: TMDB_KEY },
});


export function posterUrl(path, size = 'w500') {
if (!path) return null;
return `${IMAGE_BASE}/${size}${path}`;
}


export async function search(query, page = 1, type = 'multi') {
const endpoint = type === 'movie' ? '/search/movie' : type === 'tv' ? '/search/tv' : '/search/multi';
const res = await client.get(endpoint, { params: { query, page } });
return res.data;
}


export async function discover(type = 'movie', page = 1, params = {}) {
const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
const res = await client.get(endpoint, { params: { page, ...params } });
return res.data;
}


export async function getDetails(type = 'movie', id) {
const endpoint = `/${type}/${id}`;
const res = await client.get(endpoint, { params: { append_to_response: 'credits,videos,recommendations' } });
return res.data;
}


export default { search, discover, getDetails, posterUrl };