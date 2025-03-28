
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAnime } from '@/lib/data';
import { Anime } from '@/lib/types';
import PageTransition from '@/components/ui/PageTransition';
import BlurContainer from '@/components/ui/BlurContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const NewAnime = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    status: 'Ongoing' as 'Ongoing' | 'Completed',
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'releaseYear' ? parseInt(value, 10) || new Date().getFullYear() : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Convert genre string to array
      const genreArray = formData.genre
        .split(',')
        .map(g => g.trim())
        .filter(g => g !== '');
      
      const newAnime = createAnime({
        ...formData,
        genre: genreArray,
      });
      
      toast.success('Anime created successfully');
      navigate(`/admin/anime/${newAnime.id}/episodes`);
    } catch (error) {
      console.error('Failed to create anime:', error);
      toast.error('Failed to create anime');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/admin/anime"
            className="inline-flex items-center text-muted-foreground hover:text-primary text-sm mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to All Anime
          </Link>
          <h1 className="text-3xl font-bold">Add New Anime</h1>
        </div>

        <BlurContainer className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Anime Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter anime title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter anime description"
                rows={5}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  name="cover"
                  value={formData.cover}
                  onChange={handleInputChange}
                  placeholder="Enter cover image URL"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="genre">Genres (comma separated)</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  placeholder="Action, Adventure, Drama"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input
                  id="releaseYear"
                  name="releaseYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
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
                    Save Anime
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

export default NewAnime;
