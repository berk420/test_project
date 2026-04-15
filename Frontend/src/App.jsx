import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import CompareDrawer from "./components/CompareDrawer";
import AiChat from "./components/AiChat";

import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import ClinicDetailPage from "./pages/ClinicDetailPage";
import AdminPage from "./pages/AdminPage";
import OnboardingPage from "./pages/OnboardingPage";
import ComparePage from "./pages/ComparePage";
import UserPanelPage from "./pages/UserPanelPage";
import { BlogListPage, BlogPostPage } from "./pages/BlogPage";
import { LoginPage, RegisterPage } from "./pages/LoginPage";
import ClinicPanelPage from "./pages/ClinicPanelPage";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clinics" element={<ListingPage />} />
          <Route path="/clinic/:slug" element={<ClinicDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/panel" element={<UserPanelPage />} />
          <Route path="/clinic-panel/:clinicId" element={<ClinicPanelPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <CompareDrawer />
        <AiChat />
      </BrowserRouter>
    </AppProvider>
  );
}
