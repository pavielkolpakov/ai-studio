import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteLayout } from "@/components/site/SiteLayout";
import { HomePage } from "@/pages/HomePage";
import { AuditPage } from "@/pages/AuditPage";
import { ImplementationPage } from "@/pages/ImplementationPage";
import { OptimizationPage } from "@/pages/OptimizationPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { AboutPage } from "@/pages/AboutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/implementation" element={<ImplementationPage />} />
          <Route path="/optimization" element={<OptimizationPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
