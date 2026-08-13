import { Routes, Route } from "react-router-dom";

import Landing from "../pages/landing/Landing";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import NotFound from "../pages/not-found/NotFound";
import InterviewResult from "../pages/dashboard/InterviewResult";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Interview from "../pages/dashboard/Interview";
import DashboardHome from "../pages/dashboard/DashboardHome";
import AIChat from "../pages/dashboard/AIChat";
import Projects from "../pages/dashboard/Projects";
import ProjectDetails from "../pages/dashboard/ProjectDetails";
import ProjectDocuments from "../pages/dashboard/ProjectDocuments";
import GitHub from "../pages/dashboard/GitHub";
import KnowledgeBase from "../pages/dashboard/KnowledgeBase";
import PromptLibrary from "../pages/dashboard/PromptLibrary";
import Workflows from "../pages/dashboard/Workflows";
import Profile from "../pages/dashboard/Profile";
import Settings from "../pages/dashboard/Settings";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />
         <Route
  path="/dashboard/interviews/:id/result"
  element={<InterviewResult />}
/>
<Route
  path="/dashboard/projects/:id/github"
  element={<GitHub />}
/>

      {/* ================= DASHBOARD ================= */}

      <Route
        path="/dashboard"
        element={<DashboardLayout />}
      >

        {/* /dashboard */}
        <Route
          index
          element={<DashboardHome />}
        />
      
        {/* /dashboard/chat */}
        <Route
          path="chat"
          element={<AIChat />}
        />

        {/* /dashboard/projects */}
        <Route
          path="projects"
          element={<Projects />}
        />

        {/* /dashboard/projects/:id */}
        <Route
          path="projects/:id"
          element={<ProjectDetails />}
        />

        {/* /dashboard/projects/:id/documents */}
        <Route
          path="projects/:id/documents"
          element={<ProjectDocuments />}
        />

        {/* /dashboard/projects/:id/chat */}
        <Route
          path="projects/:id/chat"
          element={<AIChat />}
        />

        {/* /dashboard/projects/:id/interview */}
        <Route
          path="projects/:id/interview"
          element={<Interview />}
        />

        {/* /dashboard/knowledge-base */}
        <Route
          path="knowledge-base"
          element={<KnowledgeBase />}
        />

        {/* /dashboard/prompts */}
        <Route
          path="prompts"
          element={<PromptLibrary />}
        />

        {/* /dashboard/workflows */}
        <Route
          path="workflows"
          element={<Workflows />}
        />

        {/* /dashboard/profile */}
        <Route
          path="profile"
          element={<Profile />}
        />

        {/* /dashboard/settings */}
        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>


      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
};

export default AppRoutes;