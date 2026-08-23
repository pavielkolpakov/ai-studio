import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HomePage } from "@/pages/HomePage";
import { PricingPage } from "@/pages/PricingPage";
import { AboutPage } from "@/pages/AboutPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          {/* Retired pages — the Pricing page now covers all three services. */}
          {["/services", "/audit", "/implementation", "/optimization"].map((path) => (
            <Route key={path} path={path} element={<Navigate to="/pricing" replace />} />
          ))}
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
