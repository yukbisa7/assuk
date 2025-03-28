
import { useState, useEffect } from 'react';
import { getAnimes } from '@/lib/data';
import { Anime } from '@/lib/types';
import PageTransition from '@/components/ui/PageTransition';
import Navbar from '@/components/Navbar';
import AnimeCard from '@/components/AnimeCard';
import BlurContainer from '@/components/ui/BlurContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDataSync } from '@/hooks/use-data-sync';

const Index = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Use the enhanced data sync hook
  const lastUpdate = useDataSync();

  useEffect(() => {
    const fetchAnimes = () => {
      try {
        const data = getAnimes();
        setAnimes(data);
      } catch (error) {
        console.error('Failed to fetch animes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [lastUpdate]); // Re-fetch when lastUpdate changes

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen pt-16 sm:pt-20 pb-8 px-1 sm:px-4">
        <div className="container mx-auto max-w-[1400px]">
          <section className="mb-6 sm:mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 glowing-text color-changing-text">
              Slay Donghua
            </h1>
          </section>

          <section className="mb-4 sm:mb-10">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Trending Now</h2>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-4">
                {[...Array(5)].map((_, index) => (
                  <BlurContainer key={index} className="animate-pulse h-[200px] sm:h-[250px] md:h-[350px]">
                    <div></div>
                  </BlurContainer>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-4">
                {animes.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>

          <section className="mb-4 sm:mb-10">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Recently Updated</h2>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-4">
                {[...Array(5)].map((_, index) => (
                  <BlurContainer key={index} className="animate-pulse h-[200px] sm:h-[250px] md:h-[350px]">
                    <div></div>
                  </BlurContainer>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3 md:gap-4">
                {animes.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <footer className="py-4 sm:py-6 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg sm:text-xl font-semibold color-changing-text">Slay Donghua</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Your gateway to donghua entertainment</p>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Slay Donghua. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
};

export default Index;
