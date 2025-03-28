import { Anime, Episode, User } from './types';

// Prefix for localStorage keys
const STORAGE_PREFIX = 'slay-donghua-';

// Get data from localStorage or use default values
const getStoredData = <T>(key: string, defaultValue: T): T => {
  // Force fetch from localStorage every time (simulating server fetch)
  const storedData = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

// Save data to localStorage
const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  // Update last modified timestamp
  const timestamp = Date.now();
  localStorage.setItem(`${STORAGE_PREFIX}last-modified`, timestamp.toString());
  
  // Dispatch event for current tab
  window.dispatchEvent(dataUpdateEvent);
  
  // Notify other tabs/browsers via localStorage change
  try {
    // This creates a change that other tabs can detect
    localStorage.setItem(`${STORAGE_PREFIX}broadcast`, timestamp.toString());
  } catch (err) {
    console.error('Failed to broadcast change:', err);
  }
};

// Get last modified timestamp
export const getLastModified = (): number => {
  const timestamp = localStorage.getItem(`${STORAGE_PREFIX}last-modified`);
  return timestamp ? parseInt(timestamp) : 0;
};

// Create a custom event for data updates
const dataUpdateEvent = new CustomEvent('dataUpdate');

// Keep everything below the same, but refresh our variables on every access
let animes: Anime[] = [];
let episodes: Episode[] = [];

// Function to refresh data from localStorage
export const refreshData = (): void => {
  // Always fetch fresh data from storage
  animes = getStoredData('animes', initialAnimes);
  episodes = getStoredData('episodes', initialEpisodes);
  
  // Dispatch the update event
  window.dispatchEvent(dataUpdateEvent);
};

// Mock admin user
const adminUser: User = {
  id: '1',
  username: 'Admin',
  password: 'aikacungwen1103',
  role: 'admin'
};

// Initial anime collection
const initialAnimes: Anime[] = [
  {
    id: '1',
    title: 'Demon Slayer',
    description: 'Tanjiro Kamado\'s life turned upside down when his family was slaughtered by demons, and his sister Nezuko was transformed into one. Now, he\'s on a quest to cure his sister and avenge his family.',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=2370',
    genre: ['Action', 'Fantasy', 'Adventure'],
    releaseYear: 2019,
    status: 'Ongoing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Attack on Titan',
    description: 'Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid beings who devour humans seemingly without reason.',
    cover: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2574',
    genre: ['Action', 'Drama', 'Fantasy'],
    releaseYear: 2013,
    status: 'Completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'My Hero Academia',
    description: 'In a world where people with superpowers (called Quirks) are the norm, Izuku Midoriya has dreams of being a hero despite being bullied for not having a Quirk.',
    cover: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=2370',
    genre: ['Action', 'Superhero', 'School'],
    releaseYear: 2016,
    status: 'Ongoing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial episodes collection
const initialEpisodes: Episode[] = [
  {
    id: '1',
    animeId: '1',
    title: 'Cruelty',
    number: 1,
    embedUrl: 'https://www.youtube.com/embed/VQGCKyvzIM4',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=2370',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    animeId: '1',
    title: 'Trainer Sakonji Urokodaki',
    number: 2,
    embedUrl: 'https://www.youtube.com/embed/VQGCKyvzIM4',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=2370',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    animeId: '2',
    title: 'To You, 2000 Years From Now',
    number: 1,
    embedUrl: 'https://www.youtube.com/embed/LV-nazLVmgo',
    thumbnail: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&q=80&w=2574',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Data access functions - Each function now forces a refresh before returning data
export const getAnimes = () => {
  refreshData(); // Always refresh data before returning
  return [...animes]; // Return a copy to prevent direct mutation
};

export const getAnimeById = (id: string) => {
  refreshData(); // Always refresh data before returning
  return animes.find(anime => anime.id === id);
};

export const getEpisodesByAnimeId = (animeId: string) => {
  refreshData(); // Always refresh data before returning
  return episodes.filter(episode => episode.animeId === animeId);
};

export const getEpisodeById = (id: string) => {
  refreshData(); // Always refresh data before returning
  return episodes.find(episode => episode.id === id);
};

// Admin authentication
export const authenticateAdmin = (username: string, password: string) => {
  return (username === adminUser.username && password === adminUser.password) ? adminUser : null;
};

// Admin CRUD operations - Each now forces a refresh of data before modifications
export const createAnime = (newAnime: Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>) => {
  refreshData(); // Refresh before modifying
  
  const anime: Anime = {
    ...newAnime,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  animes.push(anime);
  saveData('animes', animes);
  return anime;
};

export const updateAnime = (id: string, updates: Partial<Omit<Anime, 'id' | 'createdAt' | 'updatedAt'>>) => {
  refreshData(); // Refresh before modifying
  
  const index = animes.findIndex(anime => anime.id === id);
  if (index !== -1) {
    animes[index] = {
      ...animes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveData('animes', animes);
    return animes[index];
  }
  return null;
};

export const deleteAnime = (id: string) => {
  refreshData(); // Refresh before modifying
  
  const index = animes.findIndex(anime => anime.id === id);
  if (index !== -1) {
    const deleted = animes[index];
    animes = animes.filter(anime => anime.id !== id);
    // Also delete associated episodes
    episodes = episodes.filter(episode => episode.animeId !== id);
    saveData('animes', animes);
    saveData('episodes', episodes);
    return deleted;
  }
  return null;
};

export const createEpisode = (newEpisode: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>) => {
  refreshData(); // Refresh before modifying
  
  const episode: Episode = {
    ...newEpisode,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  episodes.push(episode);
  saveData('episodes', episodes);
  return episode;
};

export const updateEpisode = (id: string, updates: Partial<Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>>) => {
  refreshData(); // Refresh before modifying
  
  const index = episodes.findIndex(episode => episode.id === id);
  if (index !== -1) {
    episodes[index] = {
      ...episodes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveData('episodes', episodes);
    return episodes[index];
  }
  return null;
};

export const deleteEpisode = (id: string) => {
  refreshData(); // Refresh before modifying
  
  const index = episodes.findIndex(episode => episode.id === id);
  if (index !== -1) {
    const deleted = episodes[index];
    episodes = episodes.filter(episode => episode.id !== id);
    saveData('episodes', episodes);
    return deleted;
  }
  return null;
};
