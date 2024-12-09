import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1733748330558-0d56cdd25dce?q=80&w=2187&auto=format&fit=crop&q=80"
          
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white"
        >
          <h1 className="text-6xl font-bold mb-6">Maraji</h1>
          <p className="text-xl mb-8">
            Digital Creator | Lifestyle Influencer | Brand Ambassador
          </p>

          <div className="flex justify-center gap-6 mb-12">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-white hover:text-pink-400 transition-colors"
            >
              <Instagram size={32} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-white hover:text-blue-400 transition-colors"
            >
              <Twitter size={32} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-white hover:text-red-500 transition-colors"
            >
              <Youtube size={32} />
            </motion.a>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <a
              href="#contact"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Work With Me
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
