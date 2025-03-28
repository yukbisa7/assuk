
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnimes, getEpisodesByAnimeId } from '@/lib/data';
import { Anime, Episode } from '@/lib/types';
import BlurContainer from '@/components/ui/BlurContainer';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { FilmIcon, PlusCircle, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      try {
        const animesData = getAnimes();
        setAnimes(animesData);
        
        let allEpisodes: Episode[] = [];
        animesData.forEach((anime) => {
          const animeEpisodes = getEpisodesByAnimeId(anime.id);
          allEpisodes = [...allEpisodes, ...animeEpisodes];
        });
        
        setEpisodes(allEpisodes);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRecentActivity = () => {
    // Sort episodes by updatedAt date (newest first)
    return [...episodes].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    ).slice(0, 5);
  };

  if (loading) {
    return (
      <div className="animate-pulse text-center py-8">Loading...</div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/admin/anime/new">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Anime
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BlurContainer className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Total Anime</h3>
              <FilmIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{animes.length}</p>
          </BlurContainer>
          
          <BlurContainer className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Total Episodes</h3>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">{episodes.length}</p>
          </BlurContainer>
          
          <BlurContainer className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Ongoing Series</h3>
              <PlusCircle className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">
              {animes.filter(anime => anime.status === 'Ongoing').length}
            </p>
          </BlurContainer>
        </div>

        {/* Recent Activity */}
        <BlurContainer className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {getRecentActivity().length > 0 ? (
              getRecentActivity().map((episode) => {
                const anime = animes.find(a => a.id === episode.animeId);
                return (
                  <div 
                    key={episode.id} 
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden">
                      <img 
                        src={anime?.cover} 
                        alt={anime?.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{anime?.title} - Episode {episode.number}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(episode.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </BlurContainer>

        {/* Anime List Preview */}
        <BlurContainer className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Anime Library</h2>
            <Link to="/admin/anime">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          <div className="space-y-2">
            {animes.slice(0, 5).map((anime) => {
              const episodeCount = episodes.filter(ep => ep.animeId === anime.id).length;
              return (
                <div 
                  key={anime.id} 
                  className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden">
                      <img 
                        src={anime.cover} 
                        alt={anime.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{anime.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {episodeCount} episodes • {anime.status}
                      </p>
                    </div>
                  </div>
                  
                  <Link to={`/admin/anime/${anime.id}/episodes`}>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </BlurContainer>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
