import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Heart, Award } from 'lucide-react';

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "1.2M+",
      label: "Followers",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      value: "15M+",
      label: "Likes",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "50+",
      label: "Brand Collaborations",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 py-20">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg"
            >
              <div className="text-purple-500 mb-4">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;