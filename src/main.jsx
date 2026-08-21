import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LandingPage from './LandingPage.jsx'
import { EarlyWarningPage, MetabolicStressPage, HighRiskPage } from './BucketPage.jsx'
import ApplicationPage from './ApplicationPage.jsx'
import CarbsPage from './CarbsPage.jsx'
import InsulinPage from './InsulinPage.jsx'
import SleepPage from './SleepPage.jsx'
import VisceralFatPage from './VisceralFatPage.jsx'
import LandingSalesPage from './LandingSalesPage.jsx'
import MetabolicPage from './MetabolicPage.jsx'
import BuyPage from './BuyPage.jsx'
import PostCallPage from './PostCallPage.jsx'
import KitPage from './KitPage.jsx'
import BodyCompPage from './BodyCompPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<MetabolicPage />} />
        <Route path="/quiz" element={<App />} />
        <Route path="/early" element={<EarlyWarningPage />} />
        <Route path="/stress" element={<MetabolicStressPage />} />
        <Route path="/high" element={<HighRiskPage />} />
        <Route path="/apply" element={<ApplicationPage />} />
        <Route path="/carbs" element={<CarbsPage />} />
        <Route path="/insulin" element={<InsulinPage />} />
        <Route path="/sleep" element={<SleepPage />} />
        <Route path="/visceralfat" element={<VisceralFatPage />} />
        <Route path="/landing" element={<LandingSalesPage />} />
        <Route path="/metabolic" element={<LandingPage />} />
        <Route path="/buy" element={<BuyPage />} />
        <Route path="/kit" element={<KitPage />} />
        <Route path="/bodycomp" element={<BodyCompPage />} />
        <Route path="/booked" element={<PostCallPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
