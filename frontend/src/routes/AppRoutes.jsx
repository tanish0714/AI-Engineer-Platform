import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/landing/Landing";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import DashboardHome from "../pages/dashboard/DashboardHome";
import NotFound from "../pages/not-found/NotFound";
import AIChat from "../pages/dashboard/AIChat";
import Projects from "../pages/dashboard/Projects";
import KnowledgeBase from "../pages/dashboard/KnowledgeBase";
import PromptLibrary from "../pages/dashboard/PromptLibrary";
import Workflows from "../pages/dashboard/Workflows";
import Profile from "../pages/dashboard/Profile";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/knowledge-base" element={<KnowledgeBase />}/>
        <Route path="/dashboard/profile" element={<Profile />}/>
        <Route path="/dashboard/prompts" element={<PromptLibrary />}/>
        <Route path="/dashboard/workflows" element={<Workflows />}/>
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard" element={<DashboardHome />} />
<Route path="/dashboard/chat" element={<AIChat />} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;