import { motion, AnimatePresence } from "motion/react";
import { EchoNavbar } from "@/components/EchoNavbar";
import { EchoFooter } from "@/components/EchoFooter";
import { useState } from "react";
import { joinWaitlist } from "@/api/waitlist";

// Hero Section Component
function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black pt-20">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            <motion.span
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0,
                type: "spring",
                stiffness: 150,
                damping: 25,
              }}
              className="inline-block text-transparent bg-clip-text 
                          bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                          dark:from-white dark:to-white/80"
            >
              EchoNote
            </motion.span>
          </h1>

          <div className="flex flex-col items-center relative z-20">
            <EchoNoteComponent />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      title: "Instant Transcription",
      description: "Press Fn and speak. Your words become text instantly with AI-powered accuracy.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      title: "Privacy First",
      description: "Audio is processed locally and immediately discarded. Your voice never leaves your device.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Lightning Fast",
      description: "From speech to text in milliseconds. Seamlessly paste anywhere you need it.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Universal Integration",
      description: "Works in any macOS application. Email, documents, chat - everywhere you type.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="py-32 bg-white dark:bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Speak at the speed of thought
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              EchoNote transforms your voice into perfect text with unprecedented speed and privacy.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative p-8 h-full">
                <div className="mb-6 text-gray-900 dark:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Use Cases Section Component
function UseCasesSection() {
  const useCases = [
    {
      title: "Content Creation",
      description: "Draft articles, blog posts, and creative writing by speaking your ideas naturally.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: "Meeting Notes",
      description: "Capture key points and action items during calls without breaking focus.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Email & Messages",
      description: "Compose emails and messages faster than typing, with perfect formatting.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Documentation",
      description: "Create technical docs and specifications by explaining concepts aloud.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <section id="use-cases" className="py-32 bg-white dark:bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Built for how you work
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether you're writing, documenting, or communicating, EchoNote adapts to your workflow.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-300"></div>
              <div className="relative p-10 flex items-start space-x-6">
                <div className="flex-shrink-0 text-gray-900 dark:text-white">
                  {useCase.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                    {useCase.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASection() {
  return (
    <section id="download" className="py-32 bg-gradient-to-b from-neutral-900 via-neutral-900 to-black dark:from-neutral-900 dark:via-neutral-900 dark:to-black">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Download EchoNote Today
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Transform your writing workflow with AI-powered assistance. Available now for Mac.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <button className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all duration-200 hover:scale-105 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                width="24"
                height="24"
                viewBox="0 0 814 1000"
                className="fill-current"
              >
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
              </svg>
              Download for Mac
            </button>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-sm mt-6"
          >
            Free to download • macOS 11.0 or later
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}



function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: i % 2 === 0 ? '#00FFA6' : '#012728',
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// EchoNote Component
function EchoNoteComponent() {
  const [activeTab, setActiveTab] = useState('about');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleJoinWaitlist = async () => {
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await joinWaitlist(email);
      
      if (result.success) {
        setMessage('Successfully joined the waitlist! Check your email for confirmation.');
        setIsSuccess(true);
        setEmail('');
      } else {
        setMessage(result.error || 'Failed to join waitlist. Please try again.');
        setIsSuccess(false);
      }
    } catch {
      setMessage('Failed to join waitlist. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const aboutContent = (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo and Title */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#012728'}}>
            <img src="/assets/logos/echo.svg" alt="EchoNote" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(60%) sepia(100%) saturate(500%) hue-rotate(90deg) brightness(120%) contrast(100%)'}} />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Transform speech into perfect text.
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm text-left leading-relaxed">
          EchoNote converts your voice into accurate, formatted text with AI-powered transcription. Perfect for notes, documents, and creative writing.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm text-left leading-relaxed mt-4">Join our waitlist and be the first to get in.</p>
      </div>

      {/* Email Input with Inline Button */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your work email"
            disabled={isLoading}
            className="w-full px-4 py-3 pr-32 bg-transparent border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-50"
            onKeyPress={(e) => e.key === 'Enter' && handleJoinWaitlist()}
          />
          <button
            onClick={handleJoinWaitlist}
            disabled={isLoading}
            className="absolute right-1 top-1 bottom-1 bg-black dark:bg-white text-white dark:text-black px-6 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Joining...' : 'Join waitlist'}
          </button>
        </div>
        
        {/* Status Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-sm text-center ${
              isSuccess 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {message}
          </motion.p>
        )}
      </div>
    </motion.div>
  );

  const visionContent = (
    <motion.div
      key="vision"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo and Title */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#012728'}}>
            <img src="/assets/logos/echo.svg" alt="EchoNote" className="w-5 h-5" style={{filter: 'brightness(0) saturate(100%) invert(60%) sepia(100%) saturate(500%) hue-rotate(90deg) brightness(120%) contrast(100%)'}} />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Thought to text at the speed of speech
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-left">
          At EchoNote, we believe your ideas deserve to flow freely and privately. We've engineered a macOS solution that empowers you to transcend the keyboard with unprecedented speed.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-left mt-4">
          With a single hotkey "Fn" EchoNote instantly transforms your spoken words into clean, accurate text. The process is remarkably swift, and your audio is used for immediate transcription only, never lingering beyond its purpose. The result is automatically copied and seamlessly pasted where you need it, in any application.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-left mt-4">
          EchoNote empowers those who demand excellence and intelligent data management from their tools. Join the waitlist. Experience unchained productivity.
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="relative z-20 w-full max-w-md mx-auto">
      {/* Tab Navigation - Fixed Position */}
      <div className="flex justify-center mb-6">
        <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
          {/* Animated Background Pill */}
          <motion.div
            className="absolute top-1 bottom-1 bg-black dark:bg-white rounded-full"
            animate={{
              left: activeTab === 'about' ? '4px' : '88px',
              width: activeTab === 'about' ? '80px' : '120px'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
          />
          
          <button
            onClick={() => setActiveTab('about')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'about'
                ? 'text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'vision'
                ? 'text-white dark:text-black'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            The Vision
          </button>
        </div>
      </div>

      {/* Animated Card Container - Expands downward only */}
      <motion.div 
        layout="position"
        className="bg-white dark:bg-black/80 dark:bg-black/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 origin-top"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ transformOrigin: 'top center' }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'about' ? aboutContent : visionContent}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function EchoPage() {
  return (
    <div className="bg-white dark:bg-black">
      <EchoNavbar />
      <HeroSection />
      <FeaturesSection />
      <UseCasesSection />
      <CTASection />
      <EchoFooter />
    </div>
  );
}