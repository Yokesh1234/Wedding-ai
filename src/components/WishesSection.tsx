import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { GuestWish } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Send, Heart, MessageSquare, AlertCircle, Sparkles } from "lucide-react";

export const WishesSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [wishes, setWishes] = useState<GuestWish[]>([]);
  
  // Form State
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Initial seeded placeholder database wishes so UI doesn't look empty
    const initialWishes: GuestWish[] = [
      {
        id: "wish-seed-1",
        name: "Sathish Kumar Achari",
        mobile: "9444390112",
        message: "Wishing my dear cousin Ramesh and Priyanka a gorgeous life ahead. May your family design be structured with pure love and devotion!",
        timestamp: "2026-06-05T18:30:00Z"
      },
      {
        id: "wish-seed-2",
        name: "Anjali Viswanathan",
        mobile: "9882201449",
        message: "மணமக்கள் இருவரும் இல்லறத்தில் இணைந்து எல்லா வளமும் நலமும் பெற்று, பதினாறும் பெற்று நூறாண்டு காலம் பெருமிதத்துடன் வாழ ஆசீர்வதிக்கிறேன்!",
        timestamp: "2026-06-06T02:15:00Z"
      },
      {
        id: "wish-seed-3",
        name: "Dr. Gopalan Sthapathy",
        mobile: "9155021949",
        message: "May Lord Vishwakarma protect your union and design a grand temple of wellness, harmony, and long-standing mutual respect.",
        timestamp: "2026-06-06T04:40:00Z"
      }
    ];

    const saved = localStorage.getItem("wedding_guest_wishes");
    if (saved) {
      try {
        setWishes(JSON.parse(saved));
      } catch (e) {
        setWishes(initialWishes);
      }
    } else {
      setWishes(initialWishes);
      localStorage.setItem("wedding_guest_wishes", JSON.stringify(initialWishes));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    // Assert Form Validation
    if (!name.trim() || !mobile.trim() || !message.trim()) {
      setErrorMsg(language === "en" ? "Kindly complete all fields to submit your blessings." : "வாழ்த்துக்களை சமர்ப்பிக்க அனைத்து விவரங்களையும் நிரப்பவும்.");
      return;
    }

    // Phone format check
    const cleanPhone = mobile.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg(language === "en" ? "Kindly enter a valid 10-digit mobile number." : "சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்.");
      return;
    }

    const newWish: GuestWish = {
      id: "wish-" + Date.now(),
      name: name.trim(),
      mobile: cleanPhone,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedWishes = [newWish, ...wishes];
    setWishes(updatedWishes);
    localStorage.setItem("wedding_guest_wishes", JSON.stringify(updatedWishes));

    setSuccess(true);
    setName("");
    setMobile("");
    setMessage("");

    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section className="py-24 px-4 bg-[#110103] text-white relative overflow-hidden" id="wishes-section">
      {/* Decorative floral backgrounds */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-gradient-to-b from-[#5c0612]/30 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center mb-16 space-y-3 relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 text-xs px-3.5 py-1.5 rounded-full font-mono uppercase tracking-widest font-semibold border border-amber-500/20 animate-pulse">
          <MessageSquare className="w-3.5 h-3.5" />
          {t("wishesTitle")}
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-400 tracking-tight">
          {t("wishesTitle")}
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
        <p className="text-amber-100/70 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          {t("wishesDesc")}
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Form: Blessing writer panel */}
        <div className="lg:col-span-5 bg-black/35 border border-amber-500/15 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative">
          <h3 className="font-serif font-extrabold text-xl text-amber-300 mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
            <Heart className="w-5 h-5 fill-current text-rose-500" />
            <span>{language === "en" ? "Leave A Blessed Note" : "வாழ்த்துப் பதிவேடு"}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4" id="blessing-submit-form">
            {/* Input Name */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-widest text-[#fadcd5]">
                {language === "en" ? "Your Full Name" : "தங்கள் முழு பெயர்"} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("guestNamePlaceholder")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:bg-white/10 focus:outline-none transition-all duration-300 font-serif font-semibold"
                id="form-wish-name"
              />
            </div>

            {/* Input Mobile */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-widest text-[#fadcd5]">
                {language === "en" ? "Mobile Number" : "கைபேசி எண்"} *
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder={t("guestMobilePlaceholder")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:bg-white/10 focus:outline-none transition-all duration-300 font-mono"
                id="form-wish-phone"
              />
            </div>

            {/* Input Message */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-mono tracking-widest text-[#fadcd5]">
                {language === "en" ? "Your Blessing Message" : "வாழ்த்துச் செய்தி"} *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("guestMessagePlaceholder")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:bg-white/10 focus:outline-none transition-all duration-300 font-serif leading-relaxed"
                id="form-wish-msg"
              />
            </div>

            {/* Display Error Message validation */}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-3 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Display Success Status notification */}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 text-xs text-justify">
                <p className="font-semibold flex items-center gap-1.5 uppercase font-mono tracking-wider mb-0.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Blessing Recorded!</span>
                </p>
                <p>{t("successWish")}</p>
              </div>
            )}

            {/* Trigger Button */}
            <button
              type="submit"
              className="w-full py-3 px-5 font-serif rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 shadow-md text-maroon-900 font-black text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-95 duration-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="form-wish-submit"
            >
              <Send className="w-4 h-4" />
              <span>{t("submitWish")}</span>
            </button>
          </form>
        </div>

        {/* Right Panel: Display entries list with slider feel */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-serif font-extrabold text-[#fadcd5]/80 text-xs uppercase tracking-widest font-mono pb-2 border-b border-white/5">
            {t("recentWishes")} ({wishes.length})
          </h3>

          <div 
            className="space-y-4 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent"
            id="wishes-display-feed-list"
          >
            <AnimatePresence initial={false}>
              {wishes.map((wish) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 duration-300 transition-colors relative group"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-serif text-sm font-bold shadow-inner">
                        {wish.name[0]}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-sm tracking-wide text-amber-300">
                          {wish.name}
                        </h4>
                        <p className="text-[10px] text-[#fadcd5]/40 font-mono tracking-wider">
                          {new Date(wish.timestamp).toLocaleDateString(language === "en" ? "en-US" : "ta-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                    </div>

                    <Heart className="w-4 h-4 fill-rose-500/20 hover:fill-rose-500 text-rose-500/40 cursor-pointer duration-300 transition-colors" />
                  </div>

                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed text-justify italic pl-10 pr-2">
                    "{wish.message}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
