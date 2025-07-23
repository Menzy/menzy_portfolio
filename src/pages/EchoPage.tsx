import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { joinWaitlist } from "@/api/waitlist";

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
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
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
    } catch (error) {
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
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
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
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 origin-top"
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

function BackgroundPaths({
  title = "Echo",
}: {
  title?: string;
}) {
  const words = title.split(" ");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center pt-40">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                                        dark:from-white dark:to-white/80"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <div className="flex flex-col items-center relative z-20">
            <EchoNoteComponent />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function EchoPage() {
  return (
    <>
      <Navbar />
      <BackgroundPaths title="EchoNote" />
    </>
  );
}