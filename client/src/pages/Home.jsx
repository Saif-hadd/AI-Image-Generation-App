import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List, TrendingUp } from 'lucide-react';

import { AnimatedCard, ModernFormField, ModernLoader, HeroSection } from "../components";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {data.map((post, index) => (
          <AnimatedCard key={post._id} {...post} index={index} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
        <TrendingUp className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {title.includes("Search") 
          ? "Try adjusting your search terms or explore our trending creations below."
          : "Be the first to create and share amazing AI-generated art with our community!"
        }
      </p>
    </motion.div>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://dall-e-eokx.onrender.com/api/v1/post", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        if (e.target.value === "") {
          setSearchedResults([]);
        } else {
          const searchResult = allPosts.filter(
            (item) =>
              item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
              item.prompt.toLowerCase().includes(e.target.value.toLowerCase())
          );
          setSearchedResults(searchResult);
        }
      }, 300)
    );
  };

  const dataToRender = searchText ? searchedResults : allPosts;
  const noResultsMessage = searchText ? "No Search Results Found" : "No Posts Yet";

  return (
    <div className="max-w-7xl mx-auto">
      <HeroSection />

      {/* Search and filters section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <ModernFormField
                labelName=""
                type="text"
                name="search"
                placeholder="Search by prompt or creator name..."
                value={searchText}
                handleChange={handleSearchChange}
              />
            </div>
            
            <div className="flex items-center gap-4">
              {searchText && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {dataToRender.length} result{dataToRender.length !== 1 ? 's' : ''}
                </Badge>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {searchText && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Search Results for "{searchText}"
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <ModernLoader text="Discovering amazing creations..." />
          </div>
        ) : (
          <RenderCards data={dataToRender} title={noResultsMessage} />
        )}
      </motion.div>

      {/* Stats section */}
      {!loading && allPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-200/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Community Stats</h3>
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{allPosts.length}</div>
                <div className="text-sm text-gray-600">Creations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{new Set(allPosts.map(p => p.name)).size}</div>
                <div className="text-sm text-gray-600">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">∞</div>
                <div className="text-sm text-gray-600">Possibilities</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;