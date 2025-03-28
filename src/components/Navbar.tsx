
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlurContainer from './ui/BlurContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-1 neo-blur' : 'py-1 sm:py-2 bg-black/50'
      }`}
    >
      <div className="container mx-auto px-2 sm:px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-base sm:text-lg font-semibold color-changing-text glowing-text" style={{animationDuration: '3s'}}>Slay Donghua</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 sm:space-x-6">
          <NavLink to="/" label="Home" />
          <NavLink to="/explore" label="Explore" />
          <NavLink to="/recently-added" label="Recently Added" />
          <Link to="/admin/login">
            <Button variant="ghost" className="hover:bg-white/10 text-sm h-8 px-3">
              Admin
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-white/10 p-1 h-8 w-8"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <BlurContainer className="md:hidden mt-1 mx-2 animate-fade-in">
          <nav className="flex flex-col space-y-2 py-3 px-2">
            <NavLink to="/" label="Home" mobile />
            <NavLink to="/explore" label="Explore" mobile />
            <NavLink to="/recently-added" label="Recently Added" mobile />
            <Link to="/admin/login" className="block px-4 py-2 hover:bg-white/10 transition-colors rounded-md text-sm">
              Admin
            </Link>
          </nav>
        </BlurContainer>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  mobile?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, mobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${mobile ? 'block px-4 py-2 text-sm' : 'text-sm'} ${
        isActive
          ? 'text-primary font-medium'
          : 'text-foreground hover:text-primary transition-colors'
      } ${mobile ? 'hover:bg-white/10 rounded-md' : ''}`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
