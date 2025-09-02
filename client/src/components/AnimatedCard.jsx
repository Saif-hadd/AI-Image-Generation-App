import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Heart, Share2, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { downloadImage } from '../utils';

const AnimatedCard = ({ _id, name, prompt, photo, index }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-0 relative">
          <div className="relative overflow-hidden rounded-t-lg">
            <motion.img
              src={photo}
              alt={prompt}
              className="w-full h-64 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Action buttons */}
            <motion.div 
              className="absolute top-3 right-3 flex gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                scale: isHovered ? 1 : 0.8 
              }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white shadow-lg"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart 
                  className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white shadow-lg"
                onClick={() => downloadImage(_id, photo)}
              >
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
            </motion.div>

            {/* View count badge */}
            <motion.div 
              className="absolute bottom-3 left-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                y: isHovered ? 0 : 10 
              }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Badge variant="secondary" className="bg-white/90 text-gray-700">
                <Eye className="h-3 w-3 mr-1" />
                {Math.floor(Math.random() * 1000) + 100}
              </Badge>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{name}</p>
                <p className="text-xs text-gray-500">Creator</p>
              </div>
            </motion.div>

            <motion.p 
              className="text-gray-700 text-sm leading-relaxed line-clamp-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {prompt}
            </motion.p>

            {/* Action bar */}
            <motion.div 
              className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {Math.floor(Math.random() * 50) + 10}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-gray-600 hover:text-blue-600"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={() => downloadImage(_id, photo)}
              >
                <Download className="h-4 w-4 mr-1" />
                Save
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;