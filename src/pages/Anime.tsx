
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimeById, getEpisodesByAnimeId } from '@/lib/data';
import { Anime as AnimeType, Episode } from '@/lib/types';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/ui/PageTransition';
import BlurContainer from '@/components/ui/BlurContainer';
import EpisodeCard from '@/components/EpisodeCard';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Anime = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeType | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (id) {
      try {
        const animeData = getAnimeById(id);
        if (animeData) {
          setAnime(animeData);
          const episodesData = getEpisodesByAnimeId(id);
          setEpisodes(episodesData);
        }
      } catch (error) {
        console.error('Failed to fetch anime details:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </>
    );
  }

  if (!anime) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-semibold mb-4">Anime not found</h1>
          <Link to="/">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen pt-16 pb-8 px-1 sm:px-4 md:pt-24">
        <div className="container mx-auto">
          <section className="mb-4 md:mb-12">
            <BlurContainer className="relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src={anime.cover}
                  alt={anime.title}
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-3 md:gap-8 p-2 md:p-6">
                <div className="flex justify-center md:block">
                  <div className="w-[140px] md:w-[200px] lg:w-[250px] shrink-0">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={anime.cover}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-2 md:mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span>Back to Home</span>
                  </Link>
                  
                  <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 text-center md:text-left">{anime.title}</h1>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-1 sm:gap-2 mb-2 md:mb-4">
                    {anime.genre.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 sm:px-3 py-1 bg-secondary rounded-full text-xs md:text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-center md:justify-start gap-2 sm:gap-3 md:gap-4 mb-3 md:mb-6">
                    <div className="px-2 sm:px-3 py-1 bg-secondary/50 rounded-md text-xs md:text-sm">
                      {anime.releaseYear}
                    </div>
                    <div className="px-2 sm:px-3 py-1 bg-primary/20 rounded-md text-xs md:text-sm text-primary">
                      {anime.status}
                    </div>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-lg md:text-xl font-medium mb-1 text-center md:text-left">Synopsis</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6 text-center md:text-left">
                      {anime.description}
                    </p>
                  </div>
                </div>
              </div>
            </BlurContainer>
          </section>

          <section className="mb-4 md:mb-12">
            <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-6 px-1">Episodes</h2>
            
            {episodes.length === 0 ? (
              <BlurContainer className="p-4 md:p-8 text-center">
                <p className="text-muted-foreground">No episodes available yet.</p>
              </BlurContainer>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-4">
                {episodes.map((episode) => (
                  <EpisodeCard key={episode.id} episode={episode} animeTitle={anime.title} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default Anime;
