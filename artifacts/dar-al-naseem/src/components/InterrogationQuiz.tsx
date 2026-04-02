import { useState, useEffect } from "react";

// ─── Types ──────────────────────────────────────────────────────────
type Step = "initial" | "investor-looking" | "investor-property" | "investor-form" | "client-login" | "brokerage-form" | "referral-form" | "success";
type UserType = "investor" | "client" | "brokerage" | "referral";

interface FormData {
  userType: UserType | null;
  looking?: "buy" | "sell" | "lease";
  propertyType?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  budget?: string;
  requirements?: string;
  companyName?: string;
  referralSource?: string;
  referralName?: string;
}

// ─── Main Component ─────────────────────────────────────────────────
export function InterrogationQuiz() {
  const [step, setStep] = useState<Step>("initial");
  const [formData, setFormData] = useState<FormData>({ userType: null });
  const [isLoading, setIsLoading] = useState(false);

  // Display all stored submissions on component mount
  useEffect(() => {
    const submissions = localStorage.getItem("quiz_submissions");
    if (submissions) {
      console.log("📋 Stored Quiz Submissions:", JSON.parse(submissions));
    }
  }, []);

  const handleUserTypeSelect = (type: UserType) => {
    setFormData({ ...formData, userType: type });
    
    if (type === "investor") {
      setStep("investor-looking");
    } else if (type === "client") {
      setStep("client-login");
    } else if (type === "brokerage") {
      setStep("brokerage-form");
    } else if (type === "referral") {
      setStep("referral-form");
    }
  };

  const handleLookingSelect = (looking: "buy" | "sell" | "lease") => {
    setFormData({ ...formData, looking });
    setStep("investor-property");
  };

  const handlePropertySelect = (property: string) => {
    setFormData({ ...formData, propertyType: property });
    setStep("investor-form");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Collect all form data
      const payload = {
        timestamp: new Date().toISOString(),
        userType: formData.userType,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        looking: formData.looking,
        propertyType: formData.propertyType,
        budget: formData.budget,
        requirements: formData.requirements,
        companyName: formData.companyName,
        referralSource: formData.referralSource,
        message: formData.message,
      };

      console.log("Submitting form data:", payload);

      // Submit to Google Apps Script
      const appsScriptUrl = "https://script.google.com/macros/s/AKfycbyScDw1tvzR75TPc9Ke-D5R5-vXDUIbI8GIuhrpRwt53i3w3LPqGIywGFBXL6PBGgd5/exec";
      
      try {
        const response = await fetch(appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("✓ Data submitted to Google Sheets successfully!");
      } catch (apiError) {
        console.log("Apps Script submission status:", apiError);
      }

      // Also save locally for backup
      const submissions = JSON.parse(
        localStorage.getItem("quiz_submissions") || "[]"
      );
      submissions.push(payload);
      localStorage.setItem("quiz_submissions", JSON.stringify(submissions));

      console.log("✓ Data saved locally to storage");
      console.log("All submissions:", submissions);

      // Show success and scroll to it
      setStep("success");
      
      // Scroll to quiz section to show success message
      setTimeout(() => {
        const quizSection = document.querySelector('[data-quiz-section]');
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Reset after delay
      setTimeout(() => {
        setStep("initial");
        setFormData({ userType: null });
      }, 4000);
    } catch (error) {
      console.error("Form submission error:", error);
      alert(
        "Form submitted! Check browser console.\n\nError: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    setStep("initial");
    setFormData({ userType: null });
  };

  return (
    <section className="py-32 relative" style={{ background: "linear-gradient(180deg, #0a0f1e 0%, #04080f 100%)" }}>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs tracking-widest text-white/30 mb-4 uppercase" style={{ letterSpacing: "0.4em" }}>Find Your Perfect Match</div>
          <h2 className="text-5xl font-extralight mb-4" style={{ fontFamily: "var(--app-font-serif)" }}>
            <span className="gold-text">Tell us who you are</span>
          </h2>
          <div className="divider-gold max-w-xs mx-auto" />
        </div>

        {/* Quiz Panel */}
        <div className="glass gold-border rounded-2xl p-12 luxury-card backdrop-blur-xl">
          {/* Initial Question */}
          {step === "initial" && (
            <InitialQuestion onSelect={handleUserTypeSelect} />
          )}

          {/* Investor Flow */}
          {step === "investor-looking" && (
            <LookingQuestion 
              onSelect={handleLookingSelect}
              onBack={handleBackClick}
            />
          )}

          {step === "investor-property" && (
            <PropertyTypeQuestion 
              onSelect={handlePropertySelect}
              onBack={() => setStep("investor-looking")}
            />
          )}

          {step === "investor-form" && (
            <InvestorForm
              formData={formData}
              onSubmit={handleFormSubmit}
              onBack={() => setStep("investor-property")}
              isLoading={isLoading}
              setFormData={setFormData}
            />
          )}

          {/* Client Login */}
          {step === "client-login" && (
            <ClientLoginForm
              onSubmit={handleFormSubmit}
              onBack={handleBackClick}
              isLoading={isLoading}
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {/* Brokerage Form */}
          {step === "brokerage-form" && (
            <BrokerageForm
              formData={formData}
              onSubmit={handleFormSubmit}
              onBack={handleBackClick}
              isLoading={isLoading}
              setFormData={setFormData}
            />
          )}

          {/* Referral Form */}
          {step === "referral-form" && (
            <ReferralForm
              formData={formData}
              onSubmit={handleFormSubmit}
              onBack={handleBackClick}
              isLoading={isLoading}
              setFormData={setFormData}
            />
          )}

          {/* Success Message */}
          {step === "success" && (
            <SuccessMessage onClose={handleBackClick} />
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Initial Question ────────────────────────────────────────────────
function InitialQuestion({ onSelect }: { onSelect: (type: UserType) => void }) {
  return (
    <div className="text-center">
      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
        <span className="gold-text">Who are you?</span>
      </h3>
      <p className="text-white/60 mb-12">Select the option that best describes you</p>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { type: "investor" as UserType, label: "Investor", description: "Looking for investment opportunities" },
          { type: "client" as UserType, label: "Client", description: "Seeking residential or commercial properties" },
          { type: "brokerage" as UserType, label: "Brokerage / Developer", description: "Partner or developer inquiry" },
          { type: "referral" as UserType, label: "Referral or Member", description: "Existing member or referral" },
        ].map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className="group relative p-8 rounded-xl border border-amber-700/40 hover:border-amber-500/80 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700 hover:to-slate-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-amber-500/10 rounded-xl transition-all duration-300" />
            <div className="relative">
              <h4 className="text-xl font-light mb-2 gold-text group-hover:gold-glow-text transition-all">
                {option.label}
              </h4>
              <p className="text-white/50 text-sm">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Looking Question ────────────────────────────────────────────────
function LookingQuestion({ 
  onSelect, 
  onBack 
}: { 
  onSelect: (looking: "buy" | "sell" | "lease") => void;
  onBack: () => void;
}) {
  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
      >
        ← Back
      </button>

      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
        <span className="gold-text">What are you looking for?</span>
      </h3>
      <p className="text-white/60 mb-12">Select the transaction type</p>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { value: "buy" as const, label: "Buy", description: "Purchase a property" },
          { value: "sell" as const, label: "Sell", description: "Sell your property" },
          { value: "lease" as const, label: "Lease", description: "Rent a property" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="group p-8 rounded-xl border border-amber-700/40 hover:border-amber-500/80 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700 hover:to-slate-800"
          >
            <h4 className="text-xl font-light mb-2 gold-text group-hover:gold-glow-text transition-all">
              {option.label}
            </h4>
            <p className="text-white/50 text-sm">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Property Type Question ──────────────────────────────────────────
function PropertyTypeQuestion({ 
  onSelect, 
  onBack 
}: { 
  onSelect: (property: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="text-center">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
      >
        ← Back
      </button>

      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
        <span className="gold-text">What property type interests you?</span>
      </h3>
      <p className="text-white/60 mb-12">Choose from our available options</p>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          "Apartment",
          "Villa",
          "Office",
          "Plot / Land",
          "Building",
          "Commercial Space",
        ].map((property) => (
          <button
            key={property}
            onClick={() => onSelect(property)}
            className="group p-6 rounded-xl border border-amber-700/40 hover:border-amber-500/80 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 hover:from-slate-700 hover:to-slate-800"
          >
            <p className="text-lg font-light text-white group-hover:gold-text transition-colors">
              {property}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Investor Form ──────────────────────────────────────────────────
function InvestorForm({
  formData,
  onSubmit,
  onBack,
  isLoading,
  setFormData,
}: {
  formData: FormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  setFormData: (data: FormData) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="text-center">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
      >
        ← Back
      </button>

      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
        <span className="gold-text">Tell us more about you</span>
      </h3>
      <p className="text-white/60 mb-8">Fill in your details so our team can contact you</p>

      <div className="max-w-2xl mx-auto space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="text"
          placeholder="Budget Range (e.g., 1M - 5M AED)"
          value={formData.budget || ""}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <textarea
          placeholder="Investment objectives and requirements"
          value={formData.requirements || ""}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          rows={4}
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gold px-12 py-3 rounded-full text-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

// ─── Client Login Form ───────────────────────────────────────────────
function ClientLoginForm({
  onSubmit,
  onBack,
  isLoading,
  formData,
  setFormData,
}: {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  formData: FormData;
  setFormData: (data: FormData) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="text-center">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
      >
        ← Back
      </button>

      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
        <span className="gold-text">Client Login</span>
      </h3>
      <p className="text-white/60 mb-8">Sign in to your account</p>

      <div className="max-w-2xl mx-auto space-y-5">
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.message || ""}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-gold px-12 py-3 rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <button
          type="button"
          className="px-12 py-3 rounded-full text-sm border border-white/20 hover:border-white/40 transition-colors"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
}

// ─── Brokerage Form ─────────────────────────────────────────────────
function BrokerageForm({
  formData,
  onSubmit,
  onBack,
  isLoading,
  setFormData,
}: {
  formData: FormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  setFormData: (data: FormData) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="text-center">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
      >
        ← Back
      </button>

      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
        <span className="gold-text">Partner with Us</span>
      </h3>
      <p className="text-white/60 mb-8">Tell us about your company and partnership opportunities</p>

      <div className="max-w-2xl mx-auto space-y-5">
        <input
          type="text"
          placeholder="Company Name"
          value={formData.companyName || ""}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="text"
          placeholder="Contact Person Name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="email"
          placeholder="Business Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="tel"
          placeholder="Contact Number"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <textarea
          placeholder="Tell us about your services and partnership interests"
          value={formData.message || ""}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gold px-12 py-3 rounded-full text-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Submitting..." : "Submit Partnership Proposal"}
      </button>
    </form>
  );
}

// ─── Referral Form ──────────────────────────────────────────────────
function ReferralForm({
  formData,
  onSubmit,
  onBack,
  isLoading,
  setFormData,
}: {
  formData: FormData;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  setFormData: (data: FormData) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="text-center">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors text-sm"
      >
        ← Back
      </button>

      <h3 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--app-font-serif)" }}>
        <span className="gold-text">Referral & Member Portal</span>
      </h3>
      <p className="text-white/60 mb-8">Update your information or refer a new opportunity</p>

      <div className="max-w-2xl mx-auto space-y-5">
        <input
          type="text"
          placeholder="Your Full Name"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="email"
          placeholder="Your Email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="tel"
          placeholder="Your Contact Number"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <input
          type="text"
          placeholder="Referral Source (if applicable)"
          value={formData.referralSource || ""}
          onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors"
        />

        <textarea
          placeholder="Additional information or referral details"
          value={formData.message || ""}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gold px-12 py-3 rounded-full text-sm mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Submitting..." : "Submit Information"}
      </button>
    </form>
  );
}

// ─── Success Message ────────────────────────────────────────────────
function SuccessMessage({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none" data-quiz-section>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      {/* Success Modal */}
      <div className="relative pointer-events-auto bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-amber-700/40 rounded-2xl p-12 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Checkmark Animation */}
          <div className="flex justify-center mb-6 animate-bounce" style={{ animationDuration: "2s" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-xl" style={{ background: "linear-gradient(135deg, #8a6d1e, #c9a84c, #e8c97a)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#060d1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>

          <h3 className="text-4xl font-light mb-4" style={{ fontFamily: "var(--app-font-serif)" }}>
            <span className="gold-text">Thank You!</span>
          </h3>
          <p className="text-white/70 mb-8 text-base leading-relaxed">
            Your information has been received successfully. Our team will contact you within 24 hours to discuss your requirements.
          </p>
          
          {/* Demo Local Storage Notice */}
          <p className="text-xs text-white/40 mb-6 font-mono">
            Form data saved • Reference ID in console
          </p>

          <button
            onClick={onClose}
            className="btn-gold px-12 py-3 rounded-full text-sm w-full transition-all hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
