import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { RSVPData } from "../types";
import { WeddingMonogram } from "./WeddingMonogram";
import { motion, AnimatePresence } from "motion/react";
import { Check, Heart, MailOpen, AlertCircle, Sparkles, Users } from "lucide-react";

export const RSVPSection: React.FC = () => {
  const { t, language } = useLanguage();

  // Form State parameters
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [attendingReception, setAttendingReception] = useState<boolean>(true);
  const [attendingWedding, setAttendingWedding] = useState<boolean>(true);
  const [mealPreference, setMealPreference] = useState<"veg" | "non-veg" | "both">("veg");

  const [validationError, setValidationError] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setIsLogged(false);

    // Run validations
    if (!name.trim() || !phone.trim()) {
      setValidationError(
        language === "en" 
          ? "Please provide your name and phone number." 
          : "தங்கள் பெயர் மறுகோப்பை மற்றும் கைபேசி எண்ணை குறிப்பிடவும்."
      );
      return;
    }

    const cleanNum = phone.replace(/\D/g, "");
    if (cleanNum.length < 10) {
      setValidationError(
        language === "en" 
          ? "Kindly enter a valid 10-digit phone connection." 
          : "சரியான 10 இலக்க தொடர்பு எண்களைப் பதிவு செய்க."
      );
      return;
    }

    const submission: RSVPData = {
      name: name.trim(),
      phone: cleanNum,
      guestsCount,
      attendingReception,
      attendingWedding,
      mealPreference
    };

    // Store RSVP lists physically in localStorage for mock persistence ledger
    const existing = localStorage.getItem("wedding_rsvp_pool");
    let pool = [];
    if (existing) {
      try {
        pool = JSON.parse(existing);
      } catch (err) {
        pool = [];
      }
    }
    pool.push(submission);
    localStorage.setItem("wedding_rsvp_pool", JSON.stringify(pool));

    setIsLogged(true);

    // Reset simple values
    setName("");
    setPhone("");
    setGuestsCount(1);
    setAttendingReception(true);
    setAttendingWedding(true);
    setMealPreference("veg");
  };

  return (
    <section className="py-24 px-4 bg-stone-50 text-stone-900 overflow-hidden relative" id="rsvp-section">
      {/* Visual Corner kolam patterns overlay */}
      <div className="absolute top-0 left-0 w-32 h-32 border-b-2 border-r-2 border-amber-500/10 rounded-br-2xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center mb-10 space-y-3 relative z-10 flex flex-col items-center">
        <WeddingMonogram className="w-20 h-20 mb-4 opacity-80" />
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs px-3.5 py-1.5 rounded-full font-mono uppercase tracking-widest font-semibold border border-amber-200">
          <MailOpen className="w-3.5 h-3.5" />
          {t("rsvpTitle")}
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#5c0612] tracking-tight">
          {t("rsvpTitle")}
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
        <p className="text-stone-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          {t("rsvpDesc")}
        </p>
      </div>

      <div className="max-w-2xl mx-auto relative z-10 bg-white border border-stone-200/80 rounded-3xl p-6 sm:p-8 shadow-md">
        <AnimatePresence mode="wait">
          {!isLogged ? (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
              id="rsvp-form-block"
            >
              {/* Field: Name */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-widest text-[#5c0612] font-extrabold block">
                  {language === "en" ? "Full Name" : "தங்கள் முழு பெயர்"} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === "en" ? "e.g. Ravichandran Achari" : "எ.கா. ரவிச்சந்திரன் ஆச்சாரி"}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 text-sm focus:border-[#5c0612] focus:bg-white focus:outline-none transition-all duration-300 font-serif font-semibold shadow-inner"
                  id="rsvp-name-input"
                />
              </div>

              {/* Field: Phone */}
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-mono tracking-widest text-[#5c0612] font-extrabold block">
                  {language === "en" ? "Primary Mobile Number" : "கைபேசி எண்"} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 text-sm focus:border-[#5c0612] focus:bg-white focus:outline-none transition-all duration-300 font-mono shadow-inner"
                  id="rsvp-phone-input"
                />
              </div>

              {/* Grid 2 Elements: Attending switches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reception Switch */}
                <div onClick={() => setAttendingReception(!attendingReception)} className={`border cursor-pointer select-none rounded-2xl p-4 transition-all duration-300 flex items-center gap-3 ${
                  attendingReception 
                    ? "bg-[#5c0612]/5 border-[#5c0612] text-[#5c0612]" 
                    : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"
                }`}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    attendingReception ? "bg-[#5c0612] border-[#5c0612] text-white" : "border-stone-300"
                  }`}>
                    {attendingReception && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm font-serif font-bold text-justify leading-snug">
                    {t("attendReception")}
                  </span>
                </div>

                {/* Wedding Switch */}
                <div onClick={() => setAttendingWedding(!attendingWedding)} className={`border cursor-pointer select-none rounded-2xl p-4 transition-all duration-300 flex items-center gap-3 ${
                  attendingWedding 
                    ? "bg-[#5c0612]/5 border-[#5c0612] text-[#5c0612]" 
                    : "bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300"
                }`}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                    attendingWedding ? "bg-[#5c0612] border-[#5c0612] text-white" : "border-stone-300"
                  }`}>
                    {attendingWedding && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm font-serif font-bold text-justify leading-snug">
                    {t("attendWedding")}
                  </span>
                </div>
              </div>

              {/* Row with inputs: Guest count and Food Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Field: Guest count */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#5c0612] font-extrabold block">
                    {t("guestCount")}
                  </label>
                  <div className="relative">
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-8 text-stone-900 text-sm focus:border-[#5c0612] focus:bg-white focus:outline-none transition-all duration-300 font-serif font-bold"
                      id="rsvp-guests-select"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(cnt => (
                        <option key={cnt} value={cnt}>{cnt} {cnt === 1 ? (language === "en" ? "Guest" : "விருந்தினர்கள்") : (language === "en" ? "Guests" : "விருந்தினர்கள்")}</option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5c0612]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Field: Meal Preference */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase font-mono tracking-widest text-[#5c0612] font-extrabold block">
                    {t("mealPref")}
                  </label>
                  <div className="relative">
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value as any)}
                      className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-8 text-stone-900 text-sm focus:border-[#5c0612] focus:bg-white focus:outline-none transition-all duration-300 font-serif font-medium"
                      id="rsvp-meal-select"
                    >
                      <option value="veg">{t("mealVeg")}</option>
                      <option value="both">{t("mealBoth")}</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                      <Heart className="w-4 h-4 fill-current text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation alert */}
              {validationError && (
                <div className="flex items-center gap-2 bg-rose-500/5 text-rose-700 border border-rose-500/20 rounded-xl p-3 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit Trigger button */}
              <button
                type="submit"
                className="w-full py-4 px-6 font-serif rounded-xl bg-gradient-to-r from-[#5c0612] to-[#7a0d1d] text-white shadow-md shadow-maroon-950/10 font-bold text-sm tracking-widest uppercase hover:scale-[1.01] duration-300 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-amber-400"
                id="rsvp-submit-trigger"
              >
                <Heart className="w-4 h-4 fill-current text-white animate-pulse" />
                <span>{t("submitRSVP")}</span>
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 space-y-6"
              id="rsvp-success-block"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce">
                🎉
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-black text-2xl text-stone-950 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>{language === "en" ? "Attending Confirmed!" : "வருகை பதிவு செய்யப்பட்டது!"}</span>
                </h3>
                <p className="text-stone-600 font-medium text-xs sm:text-sm px-4 leading-relaxed">
                  {t("successRSVP")}
                </p>
              </div>

              <button
                onClick={() => setIsLogged(false)}
                className="px-5 py-2.5 font-serif rounded-lg border border-stone-200 text-stone-500 bg-white shadow-sm hover:border-stone-300 hover:text-stone-700 text-xs font-semibold cursor-pointer"
                id="rsvp-reset-trigger"
              >
                {language === "en" ? "Register another guest" : "மற்றொரு வருகைப் பதிவு செய்க"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
