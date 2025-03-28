
import { Link } from 'react-router-dom';
import { Anime } from '@/lib/types';
import BlurContainer from './ui/BlurContainer';

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Link to={`/anime/${anime.id}`} className="block group">
      <BlurContainer className="h-full transition-transform duration-300 group-hover:scale-[1.02] p-1 sm:p-3">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md mb-1 sm:mb-2">
          <img
            src={anime.cover}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
            <div className="text-xs font-medium flex items-center gap-1">
              <span className="px-1 py-0.5 bg-primary/90 text-black rounded-md text-xs">
                {anime.status}
              </span>
              <span className="px-1 py-0.5 bg-black/60 rounded-md text-xs">
                {anime.releaseYear}
              </span>
            </div>
          </div>
        </div>
        <h3 className="font-medium text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
          {anime.title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1 h-4 sm:h-10">
          {anime.description}
        </p>
        <div className="mt-1 sm:mt-2 flex flex-wrap gap-1">
          {anime.genre.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="text-xs px-1 sm:px-2 py-0.5 bg-secondary rounded-full text-muted-foreground"
            >
              {genre}
            </span>
          ))}
          {anime.genre.length > 2 && (
            <span className="text-xs px-1 sm:px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">
              +{anime.genre.length - 2}
            </span>
          )}
        </div>
      </BlurContainer>
    </Link>
  );
};

export default AnimeCard;
