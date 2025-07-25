import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { SocialSidebar } from "@/components/SocialSidebar";
import { Loader } from "@/components/Loader";
import { HomePage } from "@/pages/HomePage";
import { ShopPage } from "@/pages/ShopPage";
import { ProductPage } from "@/pages/ProductPage";
import { TimelapseAppPage } from "@/pages/TimelapseAppPage";
import { TimelapseSupportPage } from "@/pages/TimelapseSupportPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { EchoPage } from "@/pages/EchoPage";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isLoading ? (
        <Loader onLoadingComplete={handleLoadingComplete} />
      ) : (
        <Router>
          <SocialSidebar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:slug" element={<ProductPage />} />
            <Route path="/timelapse" element={<TimelapseAppPage />} />
            <Route path="/timelapse/support" element={<TimelapseSupportPage />} />
            <Route path="/echo" element={<EchoPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
          </Routes>
          <Toaster />
          <Analytics />
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
