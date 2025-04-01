import { TimelapseNavbar } from '@/components/TimelapseNavbar';
import { TimelapseFooter } from '@/components/TimelapseFooter';

export function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <TimelapseNavbar />
      
      <div className="container mx-auto px-4 pt-4 pb-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Welcome to TimeLapse. By using our application, you agree to these Terms of Service.
              Please read them carefully. If you do not agree with these terms, please do not use the application.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use of the Service</h2>
            <p>
              TimeLapse provides a time tracking and goal visualization service. You may use our service only as permitted by law and according to these Terms. 
              We may suspend or stop providing our services to you if you do not comply with our terms or policies.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your TimeLapse Account</h2>
            <p>
              You may need to create an account to use some features of our service. You are responsible for safeguarding your account and for any activity that happens through your account.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
            <p>
              Our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> explains how we handle your personal data and protect your privacy when you use our Service. 
              By using our Service, you agree that we can use such data in accordance with our privacy policy.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Content</h2>
            <p>
              Our Service allows you to create, store and share information, including text, graphics, and other materials (your "Content"). 
              You retain ownership of any intellectual property rights that you hold in that Content.
            </p>
            <p className="mt-2">
              When you upload or otherwise submit Content to our Service, you give us a license to use that Content for the sole purpose of operating, promoting, and improving our Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Software in Our Service</h2>
            <p>
              When a Service requires or includes downloadable software, this software may update automatically on your device once a new version or feature is available.
              We grant you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software provided to you as part of the Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Modifying and Terminating Our Service</h2>
            <p>
              We are constantly changing and improving our Service. We may add or remove functionalities or features, and we may suspend or stop a Service altogether.
            </p>
            <p className="mt-2">
              You can stop using our Services at any time. We may also stop providing Services to you, or add or create new limits to our Services at any time.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Warranties and Disclaimers</h2>
            <p>
              We provide our Service using a commercially reasonable level of skill and care and we hope that you will enjoy using them. 
              But there are certain things that we don't promise about our Services.
            </p>
            <p className="mt-2">
              OTHER THAN AS EXPRESSLY SET OUT IN THESE TERMS OR ADDITIONAL TERMS, NEITHER THE DEVELOPER NOR ITS SUPPLIERS OR DISTRIBUTORS MAKE ANY SPECIFIC PROMISES ABOUT THE SERVICE. 
              FOR EXAMPLE, WE DON'T MAKE ANY COMMITMENTS ABOUT THE CONTENT WITHIN THE SERVICES, THE SPECIFIC FUNCTIONS OF THE SERVICES, OR THEIR RELIABILITY, AVAILABILITY, OR ABILITY TO MEET YOUR NEEDS. 
              WE PROVIDE THE SERVICE "AS IS".
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Liability for our Services</h2>
            <p>
              TO THE EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF THE DEVELOPER, AND ITS SUPPLIERS AND DISTRIBUTORS, FOR ANY CLAIMS UNDER THESE TERMS, INCLUDING FOR ANY IMPLIED WARRANTIES, 
              IS LIMITED TO THE AMOUNT YOU PAID US TO USE THE SERVICE (OR, IF WE CHOOSE, TO SUPPLYING YOU THE SERVICES AGAIN).
            </p>
            <p className="mt-2">
              IN ALL CASES, THE DEVELOPER, AND ITS SUPPLIERS AND DISTRIBUTORS, WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE THAT IS NOT REASONABLY FORESEEABLE.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to These Terms</h2>
            <p>
              We may modify these terms or any additional terms that apply to a Service to, for example, reflect changes to the law or changes to our Services.
              You should look at the terms regularly. We'll post notice of modifications to these terms on this page.
            </p>
            <p className="mt-2">
              If you do not agree to the modified terms for a Service, you should discontinue your use of that Service.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> terms@wanamenzy.me
            </p>
          </section>
        </div>
      </div>
      
      <TimelapseFooter />
    </div>
  );
} 