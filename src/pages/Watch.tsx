
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEpisodeById, getAnimeById, getEpisodesByAnimeId } from '@/lib/data';
import { Episode, Anime } from '@/lib/types';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/ui/PageTransition';
import BlurContainer from '@/components/ui/BlurContainer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [prevEpisode, setPrevEpisode] = useState<Episode | null>(null);
  const [nextEpisode, setNextEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      try {
        const episodeData = getEpisodeById(id);
        if (episodeData) {
          setEpisode(episodeData);
          
          const animeData = getAnimeById(episodeData.animeId);
          if (animeData) {
            setAnime(animeData);
            
            const episodes = getEpisodesByAnimeId(episodeData.animeId)
              .sort((a, b) => a.number - b.number);
            setAllEpisodes(episodes);
            
            const currentIndex = episodes.findIndex(ep => ep.id === id);
            setPrevEpisode(currentIndex > 0 ? episodes[currentIndex - 1] : null);
            setNextEpisode(currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch episode:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-16 sm:pt-20 pb-8 flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      </>
    );
  }

  if (!episode || !anime) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-16 sm:pt-20 pb-8 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl font-semibold mb-4">Episode not found</h1>
          <Link to="/">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-20 pb-8 px-0 sm:px-4">
        <div className="container mx-auto max-w-[1400px]">
          <section className="mb-4 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-4 px-2 sm:px-0">
              <Link to={`/anime/${anime.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                <span className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to {anime.title}
                </span>
              </Link>
              <span className="text-muted-foreground mx-2 hidden sm:inline">|</span>
              <h1 className="text-lg sm:text-xl font-medium w-full sm:w-auto">
                Episode {episode.number}: {episode.title}
              </h1>
            </div>
            
            <div className="rounded-lg overflow-hidden sm:p-0">
              <div className="aspect-video relative">
                <iframe
                  src={episode.embedUrl}
                  className="w-full h-full absolute inset-0"
                  title={`${anime.title} - Episode ${episode.number}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            <div className="flex justify-between mt-3 sm:mt-4 gap-2 px-2 sm:px-0">
              {prevEpisode ? (
                <Link to={`/watch/${prevEpisode.id}`} className="px-3 sm:px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-md flex items-center transition-colors text-sm sm:text-base">
                  <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                  Previous
                </Link>
              ) : (
                <div></div>
              )}
              
              {nextEpisode ? (
                <Link to={`/watch/${nextEpisode.id}`} className="px-3 sm:px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-md flex items-center transition-colors text-sm sm:text-base">
                  Next
                  <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </section>
          
          <section className="mb-4 sm:mb-8 px-2 sm:px-0">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">All Episodes</h2>
            <BlurContainer className="p-2 sm:p-4">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 sm:gap-2">
                {allEpisodes.map((ep) => (
                  <Link
                    key={ep.id}
                    to={`/watch/${ep.id}`}
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-center text-xs sm:text-sm ${
                      ep.id === episode.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 hover:bg-secondary/80 transition-colors'
                    }`}
                  >
                    EP {ep.number}
                  </Link>
                ))}
              </div>
            </BlurContainer>
          </section>
          
          <section className="px-2 sm:px-0">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">About {anime.title}</h2>
            <BlurContainer className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <div className="sm:w-1/4 max-w-[100px] sm:max-w-none mx-auto sm:mx-0">
                  <div className="aspect-[2/3] rounded-md overflow-hidden">
                    <img
                      src={anime.cover}
                      alt={anime.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-2 text-center sm:text-left">{anime.title}</h3>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1 sm:gap-2 mb-2 sm:mb-4">
                    {anime.genre.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-secondary/50 rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {anime.description}
                  </p>
                </div>
              </div>
            </BlurContainer>
          </section>
        </div>
      </main>
    </PageTransition>
  );
};

export default Watch;
