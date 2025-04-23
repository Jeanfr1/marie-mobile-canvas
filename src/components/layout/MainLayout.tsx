
/**
 * MainLayout component that provides the base structure for all pages
 */
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/toaster";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
