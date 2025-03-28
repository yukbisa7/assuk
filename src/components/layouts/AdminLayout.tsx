
import { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarProvider
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, FilmIcon, Plus, LogOut, ChevronLeft, Menu, X } from 'lucide-react';
import BlurContainer from '../ui/BlurContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('adminAuth');
      if (!auth) {
        setIsAuthenticated(false);
        navigate('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const renderSidebarContent = () => (
    <>
      <SidebarHeader className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold text-gradient">Admin Panel</h2>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="sm:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-2">
        <BlurContainer className="mb-2">
          <div className="space-y-1">
            <SidebarLink
              to="/admin/dashboard"
              icon={<Home className="h-4 w-4" />}
              label="Dashboard"
              isActive={location.pathname === '/admin/dashboard'}
            />
            <SidebarLink
              to="/admin/anime"
              icon={<FilmIcon className="h-4 w-4" />}
              label="Manage Anime"
              isActive={location.pathname === '/admin/anime'}
            />
            <SidebarLink
              to="/admin/anime/new"
              icon={<Plus className="h-4 w-4" />}
              label="Add New Anime"
              isActive={location.pathname === '/admin/anime/new'}
            />
          </div>
        </BlurContainer>
        
        <div className="px-3 py-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Website
            </Button>
          </Link>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-3 sm:p-4">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Mobile Sidebar (as overlay) */}
        {isMobile && (
          <div 
            className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <div 
              className={`w-[80%] max-w-[260px] h-full bg-background transition-transform duration-300 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {renderSidebarContent()}
            </div>
          </div>
        )}
        
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar className="fixed top-0 bottom-0 left-0 w-[260px] z-10">
            {renderSidebarContent()}
          </Sidebar>
        )}
        
        <div className={`${!isMobile ? 'pl-[260px]' : ''} w-full min-h-screen`}>
          {/* Mobile Header */}
          {isMobile && (
            <div className="sticky top-0 z-10 py-2 px-3 flex items-center justify-between bg-background/80 backdrop-blur-md border-b border-white/10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-base font-semibold text-gradient">Admin Panel</h1>
              <div className="w-8"></div>
            </div>
          )}
          
          <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-6">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link to={to}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        size="sm"
        className="w-full justify-start text-sm h-9"
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

export default AdminLayout;
