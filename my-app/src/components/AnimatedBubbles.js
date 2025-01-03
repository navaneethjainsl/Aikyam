import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBubbles = () => {
  const bubbles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble}
          className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{
            width: `${Math.random() * 200 + 200}px`,
            height: `${Math.random() * 200 + 200}px`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBubbles;

