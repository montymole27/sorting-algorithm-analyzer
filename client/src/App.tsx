import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/home";
import AlgorithmDetail from "@/pages/algorithm-detail";
import AlgorithmsPage from "@/pages/algorithms";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/ui/navbar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/algorithms" component={AlgorithmsPage} />
      <Route path="/algorithm/:id" component={AlgorithmDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex justify-center md:justify-start space-x-6">
                <a href="https://github.com/montymole27/sorting-algorithm-analyzer/about" className="text-sm text-gray-500 hover:text-gray-900">About</a>
                <a href="mailto:contact@montymole27.com" className="text-sm text-gray-500 hover:text-gray-900">Contact</a>
                <a href="https://github.com/montymole27/sorting-algorithm-analyzer" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-gray-900">GitHub</a>
              </div>
              <p className="mt-4 text-center md:mt-0 md:text-right text-sm text-gray-500">
                &copy; {new Date().getFullYear()} montymole27. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
