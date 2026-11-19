import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CompareFloatingBar } from './components/layout/CompareFloatingBar';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui/ToastContainer';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AboutPilotPage } from './pages/AboutPilotPage';
import { AdminPage } from './pages/AdminPage';
import { ComingSoonPage } from './pages/ComingSoonPage';
import { ComparePage } from './pages/ComparePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { HomePage } from './pages/HomePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { ListingsPage } from './pages/ListingsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OperatorsPage } from './pages/OperatorsPage';
import { PilotPage } from './pages/PilotPage';
import { ShortlistPage } from './pages/ShortlistPage';
import { ToolsPage } from './pages/ToolsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/shortlist" element={<ShortlistPage />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} />
                <Route path="/pilot" element={<PilotPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/operators" element={<OperatorsPage />} />
                <Route path="/tools" element={<ToolsPage />} />
                <Route path="/about" element={<AboutPilotPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <CompareFloatingBar />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
