
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAnimeById, createEpisode } from '@/lib/data';
import { Anime } from '@/lib/types';
import PageTransition from '@/components/ui/PageTransition';
import BlurContainer from '@/components/ui/BlurContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const NewEpisode = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const navigate = useNavigate();
  
  const [anime, setAnime] = useState<Anime | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    number: 1,
    embedUrl: '',
    thumbnail: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (animeId) {
      try {
        const animeData = getAnimeById(animeId);
        if (animeData) {
          setAnime(animeData);
        } else {
          toast.error('Anime not found');
          navigate('/admin/anime');
        }
      } catch (error) {
        console.error('Failed to fetch anime:', error);
        toast.error('Failed to load anime data');
      } finally {
        setLoading(false);
      }
    }
  }, [animeId, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'number' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeId) return;
    
    try {
      setSaving(true);
      
      const newEpisode = createEpisode({
        ...formData,
        animeId
      });
      
      toast.success('Episode created successfully');
      navigate(`/admin/anime/${animeId}/episodes`);
    } catch (error) {
      console.error('Failed to create episode:', error);
      toast.error('Failed to create episode');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse text-center py-8">Loading...</div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to={`/admin/anime/${animeId}/episodes`}
            className="inline-flex items-center text-muted-foreground hover:text-primary text-sm mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Episodes
          </Link>
          <h1 className="text-3xl font-bold">Add New Episode</h1>
          {anime && (
            <p className="text-muted-foreground mt-1">
              {anime.title}
            </p>
          )}
        </div>

        <BlurContainer className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Episode Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter episode title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="number">Episode Number</Label>
                <Input
                  id="number"
                  name="number"
                  type="number"
                  min="1"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="Enter episode number"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="embedUrl">Embed URL</Label>
              <Textarea
                id="embedUrl"
                name="embedUrl"
                value={formData.embedUrl}
                onChange={handleInputChange}
                placeholder="Enter embed URL for the episode"
                rows={3}
                required
              />
              <p className="text-sm text-muted-foreground">
                Paste the embed URL from your video source (e.g., iframe code from video platforms)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="Enter thumbnail URL"
              />
              <p className="text-sm text-muted-foreground">
                Add a URL to a thumbnail image for this episode
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Episode
                  </span>
                )}
              </Button>
            </div>
          </form>
        </BlurContainer>
      </div>
    </PageTransition>
  );
};

export default NewEpisode;
