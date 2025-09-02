import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wand2, Share2, Sparkles, ImageIcon, User, ArrowLeft } from 'lucide-react';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { ModernFormField, ModernLoader } from '../components';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (!form.prompt) {
      alert("Please provide a creative prompt to generate your image");
      return;
    }

    try {
      setGeneratingImg(true);

      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      const data = await response.json();

      if (!data.photo) {
        alert(data.message || "Error generating image. Please try again.");
        return;
      }

      setForm({ ...form, photo: data.photo });

    } catch (err) {
      console.error(err);
      alert("Error generating image. Please check your connection and try again.");
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Your creation has been shared with the community! 🎉');
        navigate('/');
      } catch (err) {
        alert('Error sharing your creation. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image before sharing with the community');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gallery
        </Button>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create AI Art
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your imagination into stunning visual art. Describe your vision and watch AI bring it to life.
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="w-5 h-5 text-blue-600" />
                  Creator Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ModernFormField
                  labelName="Your Name"
                  type="text"
                  name="name"
                  placeholder="Enter your artist name..."
                  value={form.name}
                  handleChange={handleChange}
                />

                <ModernFormField
                  labelName="Creative Prompt"
                  type="text"
                  name="prompt"
                  placeholder="Describe your vision in detail..."
                  value={form.prompt}
                  handleChange={handleChange}
                  isSurpriseMe
                  handleSurpriseMe={handleSurpriseMe}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    onClick={generateImage}
                    disabled={generatingImg || !form.prompt}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    {generatingImg ? (
                      <>
                        <ModernLoader />
                        <span className="ml-2">Creating your masterpiece...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate Image
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <ImageIcon className="w-5 h-5 text-purple-600" />
                  Preview
                  {form.photo && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Ready to share
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 h-80 flex items-center justify-center overflow-hidden">
                  {form.photo ? (
                    <motion.img
                      src={form.photo}
                      alt={form.prompt}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <motion.div
                      className="text-center"
                      animate={{ opacity: generatingImg ? 0.5 : 1 }}
                    >
                      <img
                        src={preview}
                        alt="preview"
                        className="w-24 h-24 object-contain opacity-40 mx-auto mb-4"
                      />
                      <p className="text-gray-500 text-sm">
                        Your generated image will appear here
                      </p>
                    </motion.div>
                  )}

                  {generatingImg && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl"
                    >
                      <ModernLoader text="Generating your unique artwork..." />
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-4 text-sm text-gray-600 text-center max-w-xs"
                      >
                        This usually takes 10-30 seconds. Creating something amazing for you!
                      </motion.p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Share Section */}
        {form.photo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Ready to Share Your Creation?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Share your AI-generated masterpiece with our creative community and inspire others!
                </p>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={loading || !form.name || !form.photo}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <ModernLoader />
                        <span className="ml-2">Sharing with community...</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 mr-2" />
                        Share with Community
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default CreatePost;