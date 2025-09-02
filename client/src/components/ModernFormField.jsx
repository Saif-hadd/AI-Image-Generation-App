import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

const ModernFormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium text-gray-700">
          {labelName}
        </Label>
        {isSurpriseMe && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSurpriseMe}
            className="h-8 px-3 text-xs bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100 text-purple-700 hover:text-purple-800"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Surprise me
          </Button>
        )}
      </div>
      
      <div className="relative">
        <Input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="w-full bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 placeholder:text-gray-400"
          required
        />
        {value && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ModernFormField;