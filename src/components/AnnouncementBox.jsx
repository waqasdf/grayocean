import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function AnnouncementBox() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("announcement-dismissed-v3");
    if (!dismissed) {
      const t = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-dismissed-v3", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 w-auto max-w-sm rounded-[10px] border border-go-border bg-go-surface-elevated p-4 shadow-go-sm pb-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-5 sm:left-auto sm:right-5 sm:w-72"
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-1.5 top-1.5 inline-flex size-10 items-center justify-center rounded-[8px] text-go-text-muted go-transition hover:bg-white/[0.04] hover:text-go-text"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="space-y-3 pr-8">
            <div>
              <div className="mb-1 text-[12px] font-medium text-go-text">Prepaid credits</div>
              <p className="text-[13px] leading-relaxed text-go-text-secondary">
                Lookups use your credit balance. Fund with USDC on Base — minimum initial
                purchase $100.
              </p>
            </div>
            <Link
              to={createPageUrl("Pricing")}
              onClick={handleClose}
              className="inline-flex min-h-10 items-center text-[13px] font-medium text-go-primary hover:text-go-primary-hover"
            >
              View pricing
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
