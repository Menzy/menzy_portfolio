import { motion } from "motion/react";
import { useState } from "react";
import { joinWaitlist } from "@/api/waitlist";
import { Link } from "react-router-dom";

export function EchoFooter() {
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

  return (
    <footer className="bg-white dark:bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Ready To Write 4x Faster?
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300">
            Now Available On Mac.
          </h3>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto"
        >
          Try EchoNote to write your next email, document, or creative piece with AI. It's free to get started.
        </motion.p>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16 max-w-md mx-auto"
        >
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your work email"
              disabled={isLoading}
              className="w-full px-4 py-3 pr-32 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-neutral-400 disabled:opacity-50"
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
          
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 text-sm text-center ${
                isSuccess 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}
            >
              {message}
            </motion.p>
          )}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <nav className="flex flex-wrap justify-center gap-8 text-gray-600 dark:text-gray-400">
            <button
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
            >
              Features
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('use-cases');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
            >
              Use Cases
            </button>
            <Link
              to="/privacy"
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </nav>
        </motion.div>

        {/* EchoNote Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Link to="/echo" className="inline-block">
            <div className="text-2xl font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
              EchoNote
            </div>
          </Link>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-gray-500 dark:text-gray-500 text-sm"
        >
          © {new Date().getFullYear()}. All rights reserved
        </motion.div>
      </div>
    </footer>
  );
}