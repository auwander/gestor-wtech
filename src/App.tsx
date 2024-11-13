import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Subscriptions from "./pages/Subscriptions";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, session }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/login",
      element: session ? <Navigate to="/" replace /> : <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute session={session}>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute session={session}>
          <Index />
        </ProtectedRoute>
      ),
    },
    {
      path: "/statistics",
      element: (
        <ProtectedRoute session={session}>
          <Statistics />
        </ProtectedRoute>
      ),
    },
    {
      path: "/subscriptions",
      element: (
        <ProtectedRoute session={session}>
          <Subscriptions />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-right" expand={true} richColors />
    </QueryClientProvider>
  );
}

export default App;