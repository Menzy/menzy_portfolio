import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section 
      id="contact" 
      className="min-h-screen md:h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-6 py-20 md:py-0"
    >
      <div className="max-w-7xl w-full flex flex-col items-start gap-[120px]">
        {/* Header Section */}
        <h1 className="text-8xl lg:text-9xl font-bold text-black dark:text-white leading-[0.8] tracking-tighter">
          Get in touch.
        </h1>

        {/* Content Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
              <span className="font-semibold text-black dark:text-white">Have a project in mind?</span> Reach
              out to us, and we'll discuss the best way
              to move forward.
            </p>
            
            {/* Contact Person */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-black">
              </div>
              <div>
                <p className="font-medium text-black dark:text-white text-lg">Wan Menzy</p>
                <p className="text-gray-500 dark:text-gray-400">Team lead</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Your name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-4 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none bg-transparent placeholder:text-gray-500 text-lg"
                  required
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-0 py-4 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none bg-transparent placeholder:text-gray-500 text-lg"
                  required
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Your message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-0 py-4 border-0 border-b border-gray-300 dark:border-gray-600 rounded-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none bg-transparent min-h-[120px] resize-none placeholder:text-gray-500 text-lg"
                  rows={4}
                />
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-3 rounded-full font-medium transition-colors text-lg"
                >
                  Submit
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
                By submitting, you agree to our{' '}
                <a href="#" className="underline hover:text-black dark:hover:text-white">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="underline hover:text-black dark:hover:text-white">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}