import React from 'react';
import { motion } from 'framer-motion';

const Brands = () => {
  const brands = [
    {
      name: "Nike",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      name: "Apple",
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      name: "Samsung",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      name: "Adidas",
      image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=300&h=300",
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Brands I've Worked With
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="aspect-square rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {brand.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;