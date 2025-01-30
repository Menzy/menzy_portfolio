import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

const projectTypes = [
  { id: 'commercial', label: 'Commercial' },
  { id: 'documentary', label: 'Documentary' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'event', label: 'Event Coverage' },
  { id: 'music-video', label: 'Music Video' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'social', label: 'Social Media' },
  { id: 'other', label: 'Other' },
];

type FormData = {
  name: string;
  email: string;
  projectType: string;
  description: string;
};

const initialFormData: FormData = {
  name: '',
  email: '',
  projectType: '',
  description: '',
};

export function Contact() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showSuccess, setShowSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNext = () => {
    if (step === 1 && !formData.name) {
      setShowSuccess(true);
      return;
    }
    if (step === 2 && !formData.email) {
      setShowSuccess(true);
      return;
    }
    if (step === 3 && !formData.projectType) {
      setShowSuccess(true);
      return;
    }
    if (step === 4) {
      if (!formData.description) {
        setShowSuccess(true);
        return;
      }
      setShowSuccess(true);
      // Scroll to top of the section
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    setStep(step + 1);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (step === 4) {
      setFormData(initialFormData);
      setStep(1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold">What's your name?</h2>
            <Input
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-lg py-6"
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold">What's your email?</h2>
            <Input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="text-lg py-6"
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold">What type of project is this?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, projectType: type.id })}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-200 hover:border-primary",
                    formData.projectType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-muted"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold">Tell us about your project</h2>
            <Textarea
              placeholder="Describe your vision, goals, and any specific requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[200px] text-lg resize-none"
            />
          </div>
        );
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="min-h-screen flex items-center justify-center bg-orange-400 m-4 rounded-2xl text-white">
      <div className="container max-w-2xl mx-auto m-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Let's Work Together</h2>
          <p className="text-lg text-white/80">
            Tell us about your project and we'll get back to you shortly
          </p>
        </div>

        <div ref={contentRef} className="opacity-0">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full flex-1 transition-colors duration-500",
                  i <= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Form Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button
              className={cn("ml-auto")}
              onClick={handleNext}
            >
              {step === 4 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={handleSuccessClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === 4 ? "Message Sent" : "Required Field"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center p-4">
            {step === 4 ? (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-muted-foreground">
                  We'll get back to you soon about your project.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  {step === 1 && "Please enter your name to continue."}
                  {step === 2 && "Please enter your email to continue."}
                  {step === 3 && "Please select a project type to continue."}
                  {step === 4 && "Please describe your project to continue."}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}