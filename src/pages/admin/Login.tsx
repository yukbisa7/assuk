
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateAdmin } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import BlurContainer from '@/components/ui/BlurContainer';
import PageTransition from '@/components/ui/PageTransition';
import { Lock, User, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = authenticateAdmin(username, password);
      
      if (user) {
        localStorage.setItem('adminAuth', JSON.stringify({ 
          id: user.id, 
          username: user.username,
          role: user.role 
        }));
        toast.success('Login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
      
      setLoading(false);
    }, 800);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4 inline mr-1" />
          Back to Home
        </Link>
        
        <div className="w-full max-w-md">
          <BlurContainer className="p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full glass-morphism flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-2xl font-semibold text-center mb-6">Admin Login</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Use these credentials:</p>
              <p className="mt-1">
                <span className="text-foreground">Username:</span> Admin
                <span className="mx-2">|</span>
                <span className="text-foreground">Password:</span> aikacungwen1103
              </p>
            </div>
          </BlurContainer>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
