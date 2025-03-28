import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAnimeById, getEpisodesByAnimeId, deleteEpisode } from '@/lib/data';
import { useDataSync } from '@/hooks/use-data-sync';
import { Anime, Episode } from '@/lib/types';
import BlurContainer from '@/components/ui/BlurContainer';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, Pencil, Trash2, MessageSquare, Grid3X3 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ManageEpisodes = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const navigate = useNavigate();
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const lastUpdate = useDataSync();

  useEffect(() => {
    if (animeId) {
      try {
        const animeData = getAnimeById(animeId);
        if (animeData) {
          setAnime(animeData);
          const episodesData = getEpisodesByAnimeId(animeId);
          setEpisodes(episodesData);
        } else {
          navigate('/admin/anime');
          toast.error('Anime not found');
        }
      } catch (error) {
        console.error('Failed to fetch anime or episodes:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [animeId, navigate, lastUpdate]);

  const handleDeleteEpisode = () => {
    if (episodeToDelete) {
      try {
        deleteEpisode(episodeToDelete.id);
        setEpisodes(episodes.filter(ep => ep.id !== episodeToDelete.id));
        toast.success('Episode deleted successfully');
      } catch (error) {
        console.error('Failed to delete episode:', error);
        toast.error('Failed to delete episode');
      } finally {
        setEpisodeToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const confirmDelete = (episode: Episode) => {
    setEpisodeToDelete(episode);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="animate-pulse text-center py-8">Loading...</div>
    );
  }

  if (!anime) {
    return null; // Should navigate away if anime not found
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Link to="/admin/anime" className="inline-flex items-center text-muted-foreground hover:text-primary text-sm mb-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to All Anime
            </Link>
            <h1 className="text-3xl font-bold">Manage Episodes: {anime.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Link to={`/admin/anime/${animeId}/episodes/new`}>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New Episode
              </Button>
            </Link>
          </div>
        </div>

        <BlurContainer className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-20 rounded overflow-hidden flex-shrink-0">
              <img 
                src={anime.cover} 
                alt={anime.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{anime.title}</h2>
              <p className="text-sm text-muted-foreground">
                {anime.genre.join(', ')} • {anime.releaseYear} • {anime.status}
              </p>
            </div>
          </div>
        </BlurContainer>

        {viewMode === 'grid' ? (
          <BlurContainer className="p-4">
            {episodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...episodes]
                  .sort((a, b) => a.number - b.number)
                  .map((episode) => (
                    <div 
                      key={episode.id} 
                      className="relative group"
                    >
                      <BlurContainer className="p-3 h-full">
                        <div className="aspect-video bg-black/20 mb-2 rounded-md overflow-hidden relative">
                          <img 
                            src={episode.thumbnail || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1974'} 
                            alt={episode.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                            Ep {episode.number}
                          </div>
                        </div>
                        <h3 className="font-medium text-sm line-clamp-1">
                          {episode.title}
                        </h3>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/60 transition-opacity rounded-md">
                          <div className="flex gap-2">
                            <Link to={`/admin/anime/${animeId}/episodes/${episode.id}/edit`}>
                              <Button size="sm" variant="secondary" title="Edit Episode">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm"
                              variant="destructive" 
                              title="Delete Episode"
                              onClick={() => confirmDelete(episode)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </BlurContainer>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No episodes added yet</p>
                <Link 
                  to={`/admin/anime/${animeId}/episodes/new`} 
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  Add your first episode
                </Link>
              </div>
            )}
          </BlurContainer>
        ) : (
          <BlurContainer>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left">Number</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3">Embed URL</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {episodes.length > 0 ? (
                    [...episodes]
                      .sort((a, b) => a.number - b.number)
                      .map((episode) => (
                        <tr 
                          key={episode.id} 
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3">
                            Episode {episode.number}
                          </td>
                          <td className="px-4 py-3">
                            {episode.title}
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-xs truncate text-muted-foreground text-sm">
                              {episode.embedUrl}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link to={`/admin/anime/${animeId}/episodes/${episode.id}/edit`}>
                                <Button size="icon" variant="outline" title="Edit Episode">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button 
                                size="icon" 
                                variant="destructive" 
                                title="Delete Episode"
                                onClick={() => confirmDelete(episode)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No episodes added yet</p>
                        <Link 
                          to={`/admin/anime/${animeId}/episodes/new`} 
                          className="mt-2 inline-block text-primary hover:underline"
                        >
                          Add your first episode
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </BlurContainer>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Episode</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "Episode {episodeToDelete?.number}: {episodeToDelete?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteEpisode}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default ManageEpisodes;
