import React from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Plus, Home as HomeIcon, Sparkles } from 'lucide-react';

import { Home, CreatePost } from './pages';
import { Button } from './components/ui/button';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Home />
            </motion.div>
          } 
        />
        <Route 
          path="/create-post" 
          element={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CreatePost />
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm"
        >
          <div className="container mx-auto px-4 sm:px-8">
            <div className="flex justify-between items-center py-4">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Palette className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    DALL-E Studio
                  </h1>
                  <p className="text-xs text-gray-500">AI Art Generator</p>
                </div>
              </Link>

              <nav className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4" />
                    Gallery
                  </Button>
                </Link>
                <Link to="/create-post">
                  <Button variant="gradient" size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Art
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="container mx-auto px-4 sm:px-8 py-8">
          <AnimatedRoutes />
        </main>

        {/* Background decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;