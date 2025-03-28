
export interface Anime {
  id: string;
  title: string;
  description: string;
  cover: string;
  genre: string[];
  releaseYear: number;
  status: 'Ongoing' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  id: string;
  animeId: string;
  title: string;
  number: number;
  embedUrl: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin';
}
