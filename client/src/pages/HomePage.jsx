import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function HomePage() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: 'reverse',
          duration: 3,
          ease: 'easeInOut'
        }
      }
    }
  };

  return (
    <div className="relative h-[calc(100vh-60px)] overflow-hidden">
      {/* Background with high-quality rural image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://www.treebo.com/blog/wp-content/uploads/2018/06/The-16-Most-Beautiful-Villages-In-India.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Animated overlay */}
        <motion.div
          className="absolute inset-0 bg-black opacity-40"
          animate={{
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-yellow-300 opacity-20"
        animate="float"
        variants={floatingVariants}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-green-300 opacity-20"
        animate="float"
        variants={floatingVariants}
        style={{ animationDelay: '0.5s' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full bg-blue-300 opacity-20"
        animate="float"
        variants={floatingVariants}
        style={{ animationDelay: '1s' }}
      />

      {/* Main content */}
      <motion.div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 text-shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            Welcome to <span className="text-yellow-300">GramSeva</span> Portal
          </motion.h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <motion.p
            className="text-xl md:text-2xl text-shadow mb-8 max-w-2xl leading-relaxed"
            whileHover={{ scale: 1.01 }}
          >
            Empowering rural communities through digital connectivity and sustainable development initiatives.
          </motion.p>
        </motion.div>

        {/* Village statistics cards - Updated with better contrast */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <motion.div 
            className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-30"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-yellow-400">150+</div>
            <div className="text-sm font-medium text-black">Villages Connected</div>
          </motion.div>
          <motion.div 
            className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-30"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-green-400">5K+</div>
            <div className="text-sm font-medium text-black">Families Benefited</div>
          </motion.div>
          <motion.div 
            className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-30"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-blue-400">24/7</div>
            <div className="text-sm font-medium text-black">Support Available</div>
          </motion.div>
          <motion.div 
            className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-lg border border-white border-opacity-30"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl font-bold text-purple-400">100%</div>
            <div className="text-sm font-medium text-black">Transparent Process</div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;