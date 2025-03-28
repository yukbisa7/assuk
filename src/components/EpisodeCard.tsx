
import { Link } from 'react-router-dom';
import { Episode } from '@/lib/types';
import BlurContainer from './ui/BlurContainer';
import { Play } from 'lucide-react';

interface EpisodeCardProps {
  episode: Episode;
  animeTitle: string;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, animeTitle }) => {
  return (
    <Link to={`/watch/${episode.id}`} className="block group">
      <BlurContainer className="h-full transition-transform duration-300 group-hover:scale-[1.02] p-2 sm:p-3">
        <div className="relative aspect-video overflow-hidden rounded-md mb-2">
          <img
            src={episode.thumbnail || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            alt={`${animeTitle} - Episode ${episode.number}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
          </div>
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 px-1 sm:px-2 py-0.5 sm:py-1 bg-black/60 rounded-md text-xs font-medium">
            EP {episode.number}
          </div>
        </div>
        <h3 className="font-medium text-xs sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
          {episode.title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1 h-4 sm:h-5">
          {animeTitle} - Episode {episode.number}
        </p>
      </BlurContainer>
    </Link>
  );
};

export default EpisodeCard;
