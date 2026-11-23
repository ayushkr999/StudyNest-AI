import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { ValueStrip } from '../components/landing/ValueStrip';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { RAGShowcase } from '../components/landing/RAGShowcase';
import { AICapabilities } from '../components/landing/AICapabilities';
import { CollaborationSection } from '../components/landing/CollaborationSection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF7] dark:bg-[#0D1117] text-brand-text dark:text-neutral-100 font-sans selection:bg-brand-accent selection:text-brand-primary">
      <Navbar />
      <main>
        <HeroSection />
        <ValueStrip />
        <FeaturesSection />
        <HowItWorks />
        <RAGShowcase />
        <AICapabilities />
        <CollaborationSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
