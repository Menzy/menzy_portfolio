import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { PageTransition } from "@/components/PageTransition";
import { HomePage } from "@/pages/HomePage";
import { ShopPage } from "@/pages/ShopPage";
import { ProductPage } from "@/pages/ProductPage";
import { TimelapseAppPage } from "@/pages/TimelapseAppPage";
import { TimelapseSupportPage } from "@/pages/TimelapseSupportPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { EchoPage } from "@/pages/EchoPage";
import { EchoAuthCallbackPage } from "@/pages/EchoAuthCallbackPage";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Router>
        <Routes>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
          <Route path="/shop/:slug" element={<PageTransition><ProductPage /></PageTransition>} />
          <Route path="/timelapse" element={<PageTransition><TimelapseAppPage /></PageTransition>} />
          <Route path="/timelapse/support" element={<PageTransition><TimelapseSupportPage /></PageTransition>} />
          <Route path="/echo" element={<PageTransition><EchoPage /></PageTransition>} />
          <Route path="/echo/auth/callback" element={<PageTransition><EchoAuthCallbackPage /></PageTransition>} />
          <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><TermsOfServicePage /></PageTransition>} />
        </Routes>
        <Toaster />
        <Analytics />
      </Router>
    </ThemeProvider>
  );
}

export default App;
