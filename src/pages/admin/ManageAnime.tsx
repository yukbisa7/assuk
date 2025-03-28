import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnimes, getEpisodesByAnimeId, deleteAnime } from '@/lib/data';
import { useDataSync } from '@/hooks/use-data-sync';
import { Anime } from '@/lib/types';
import BlurContainer from '@/components/ui/BlurContainer';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { PlusCircle, Pencil, Trash2, Film, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ManageAnime = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [animeToDelete, setAnimeToDelete] = useState<Anime | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [episodeCount, setEpisodeCount] = useState<Record<string, number>>({});
  
  const lastUpdate = useDataSync();

  useEffect(() => {
    const fetchData = () => {
      try {
        const animesData = getAnimes();
        setAnimes(animesData);
        
        const counts: Record<string, number> = {};
        animesData.forEach((anime) => {
          counts[anime.id] = getEpisodesByAnimeId(anime.id).length;
        });
        setEpisodeCount(counts);
      } catch (error) {
        console.error('Failed to fetch animes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lastUpdate]);

  const handleDeleteAnime = () => {
    if (animeToDelete) {
      try {
        deleteAnime(animeToDelete.id);
        setAnimes(animes.filter(anime => anime.id !== animeToDelete.id));
        toast.success('Anime deleted successfully');
      } catch (error) {
        console.error('Failed to delete anime:', error);
        toast.error('Failed to delete anime');
      } finally {
        setAnimeToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const confirmDelete = (anime: Anime) => {
    setAnimeToDelete(anime);
    setIsDeleteDialogOpen(true);
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
          <h1 className="text-3xl font-bold">Manage Anime</h1>
          <Link to="/admin/anime/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Anime
            </Button>
          </Link>
        </div>

        <BlurContainer>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-center">Episodes</th>
                  <th className="px-4 py-3 text-center">Year</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {animes.length > 0 ? (
                  animes.map((anime) => (
                    <tr 
                      key={anime.id} 
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3">
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
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {anime.genre.join(', ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {episodeCount[anime.id] || 0}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {anime.releaseYear}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span 
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            anime.status === 'Ongoing' 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {anime.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/anime/${anime.id}/episodes`}>
                            <Button size="icon" variant="outline" title="Manage Episodes">
                              <Film className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link to={`/admin/anime/${anime.id}/edit`}>
                            <Button size="icon" variant="outline" title="Edit Anime">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            title="Delete Anime"
                            onClick={() => confirmDelete(anime)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No anime added yet</p>
                      <Link to="/admin/anime/new" className="mt-2 inline-block text-primary hover:underline">
                        Add your first anime
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </BlurContainer>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Anime</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{animeToDelete?.title}"? This action cannot be undone and will also delete all associated episodes.
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
                onClick={handleDeleteAnime}
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

export default ManageAnime;
