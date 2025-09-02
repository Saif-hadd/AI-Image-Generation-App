import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Palette } from 'lucide-react';

const HeroSection = () => {
  const features = [
    { icon: Sparkles, text: "AI-Powered" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Palette, text: "Creative Freedom" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center mb-16 relative"
    >
      {/* Background particles */}
      <div className="particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient leading-tight">
          DALL-E Studio
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Transform your imagination into stunning visual art with the power of AI. 
          Create, share, and discover extraordinary images.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-center gap-8 mb-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
            >
              <feature.icon className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;