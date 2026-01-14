"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, Lock, AlertCircle } from "lucide-react";

const TOS_ACCEPTED_KEY = "alecci_tos_accepted";

interface TosPopupProps {
  onAccept?: () => void;
}

export function TosPopup({ onAccept }: TosPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if ToS has been accepted
    const accepted = localStorage.getItem(TOS_ACCEPTED_KEY);
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (!isChecked) return;

    localStorage.setItem(TOS_ACCEPTED_KEY, new Date().toISOString());
    setIsOpen(false);
    onAccept?.();
  };

  if (!mounted || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop - soft blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-100/80 backdrop-blur-md"
          />

          {/* Modal - Bright premium design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl shadow-neutral-300/50 border border-neutral-200"
          >
            {/* Red accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />

            {/* Header */}
            <div className="p-6 pb-4 border-b border-neutral-100 bg-gradient-to-b from-neutral-50 to-white">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2.5 rounded-xl bg-red-50 border border-red-100"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Shield className="size-6 text-red-500" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Terms of Service</h2>
                  <p className="text-sm text-neutral-500">Please review and accept to continue</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="h-[400px] p-6 bg-white">
              <div className="space-y-6 text-sm">
                {/* Key Points */}
                <section className="space-y-4">
                  <motion.div
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <FileText className="size-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-1">Service Description</h3>
                      <p className="text-neutral-600 leading-relaxed">
                        Alecci Media provides AI-powered strategic consulting through virtual executives
                        (Alexandria & Kim). Our service includes AI consulting, document generation,
                        voice interaction, and strategy templates.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Lock className="size-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-1">Data & Privacy</h3>
                      <p className="text-neutral-600 leading-relaxed">
                        Your conversations and data are stored securely. We use industry-standard
                        encryption and never share your personal information with third parties
                        without your consent.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <AlertCircle className="size-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-1">AI-Generated Content</h3>
                      <p className="text-neutral-600 leading-relaxed">
                        Content generated by our AI executives is for informational purposes only.
                        While our AI provides strategic insights, you retain full ownership of
                        generated content and are responsible for verifying its accuracy.
                      </p>
                    </div>
                  </motion.div>
                </section>

                {/* Full Terms Summary */}
                <section className="space-y-3">
                  <h3 className="font-medium text-neutral-900">Terms Summary</h3>
                  <ul className="space-y-2.5 text-neutral-600">
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-500 mt-0.5 font-bold">•</span>
                      You must be at least 18 years old to use this service
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-500 mt-0.5 font-bold">•</span>
                      You agree to use the service for lawful purposes only
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-500 mt-0.5 font-bold">•</span>
                      We may update these terms with notice to users
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-500 mt-0.5 font-bold">•</span>
                      AI recommendations should not replace professional advice
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-red-500 mt-0.5 font-bold">•</span>
                      You can request data deletion at any time
                    </li>
                  </ul>
                </section>

                <p className="text-xs text-neutral-400">
                  By accepting these terms, you acknowledge that you have read and understood our
                  full Terms of Service and Privacy Policy available on our website.
                </p>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-neutral-100 bg-gradient-to-t from-neutral-50 to-white space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(checked === true)}
                  className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                />
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  I have read and agree to the Terms of Service and Privacy Policy
                </span>
              </label>

              <Button
                onClick={handleAccept}
                disabled={!isChecked}
                className="w-full shadow-lg shadow-red-200/50 hover:shadow-red-300/50 transition-shadow"
                size="lg"
              >
                Accept & Continue
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useTosAccepted() {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const value = localStorage.getItem(TOS_ACCEPTED_KEY);
    setAccepted(!!value);
  }, []);

  return accepted;
}
