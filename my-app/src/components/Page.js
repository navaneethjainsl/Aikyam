import React from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import AnimatedBubbles from '../components/AnimatedBubbles';
import ErrorBoundary from '../components/ErrorBoundary';

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: 'spring',
      stiffness: 120,
      damping: 10,
    },
  }),
};

const LetterAnimation: React.FC<{ text: string }> = ({ text }) => {
  return (
    <motion.h1 
      className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500"
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={letterVariants}
          custom={index}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default function LandingPage() {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.8 },
    }));
  }, [controls]);

  return (
    <ErrorBoundary>
      <div className=" min-h-screen overflow-hidden bg-gradient-to-br from-black via-purple-900 to-indigo-900">
        <AnimatedBubbles />
        <div className=" z-10">
          <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <LetterAnimation text="Aikyam" />
              <motion.p 
                className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                custom={1}
              >
                Unleash the power of AI to create an inclusive digital world. 
                Experience personalized assistance that adapts to your unique needs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 15 }}
              >
                <a href="/signup" className="inline-block group">
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-pink-500/25 transform hover:-translate-y-1">
                    <span className="mr-2">Embark on Your AI Journey</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              custom={2}
              className="mt-16 w-full max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                {[
                  { title: "Speech Recognition", description: "Experience seamless communication with our advanced AI models" },
                  { title: "Visual Assistance", description: "See the world through AI-enhanced perception and understanding" },
                  { title: "Personalized Learning", description: "Grow with an AI companion that evolves alongside you" }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="text-center p-6 bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl shadow-xl backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={controls}
                    custom={index + 3}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(167, 139, 250, 0.3)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    <h3 className="font-bold text-xl text-pink-300 mb-3">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

