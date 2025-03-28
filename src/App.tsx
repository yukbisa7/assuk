
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Anime from "./pages/Anime";
import Watch from "./pages/Watch";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageAnime from "./pages/admin/ManageAnime";
import ManageEpisodes from "./pages/admin/ManageEpisodes";
import EditEpisode from "./pages/admin/EditEpisode";
import NewAnime from "./pages/admin/NewAnime";
import NewEpisode from "./pages/admin/NewEpisode";
import EditAnime from "./pages/admin/EditAnime";
import AdminLayout from "./components/layouts/AdminLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/anime/:id" element={<Anime />} />
            <Route path="/watch/:id" element={<Watch />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="anime" element={<ManageAnime />} />
              <Route path="anime/new" element={<NewAnime />} />
              <Route path="anime/:animeId/edit" element={<EditAnime />} />
              <Route path="anime/:animeId/episodes" element={<ManageEpisodes />} />
              <Route path="anime/:animeId/episodes/new" element={<NewEpisode />} />
              <Route path="anime/:animeId/episodes/:episodeId/edit" element={<EditEpisode />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
