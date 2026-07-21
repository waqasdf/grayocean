import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MinimalBadge } from "../ui/minimal-badge";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "./AnimatedSSN";
import { BlurredNumber, UpgradePrompt } from "./BlurredSSN"; // New import
import { User } from "@/entities/User"; // New import

export default function SSNBreakdown({ area, group, serial, state, onRegenerate }) {
  const [showInfo, setShowInfo] = useState(false);
  const isSubscribed = true; // Free for all users

  const parts = [
    {
      label: "Area",
      value: area,
      sublabel: "Geographic",
      explanation: "The first 3 digits originally indicated the state where the card was issued (pre-2011). Since 2011, area numbers are assigned randomly for enhanced security."
    },
    {
      label: "Group",
      value: group,
      sublabel: "Batch",
      explanation: "The middle 2 digits represent the group number, used to break down the large area numbers into smaller batches. The SSA issued numbers in a specific order within each area."
    },
    {
      label: "Serial",
      value: serial,
      sublabel: "Sequence",
      explanation: "The last 4 digits are the serial number, representing a straight numerical sequence from 0001-9999 within each group. This uniquely identifies each individual SSN.",
      shouldBlur: true // New property to indicate if this part should be blurred for non-subscribers
    }
  ];

  return (
    <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-xs font-semibold text-white">
              Breakdown
            </CardTitle>
            {state && (
              <MinimalBadge variant="info" size="xs">
                {state}
              </MinimalBadge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setShowInfo(!showInfo)}
              size="sm"
              variant="ghost"
              className="h-9 px-3 text-[11px] text-gray-400 hover:text-white"
            >
              {showInfo ? 'Hide Info' : 'Show Info'}
            </Button>
            {onRegenerate && (
              <Button
                onClick={onRegenerate}
                size="sm"
                className="h-9 border border-go-border bg-go-surface-elevated px-3 text-[11px] text-go-text hover:bg-white/[0.06]"
              >
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <h3 className="text-[10px] font-semibold text-white uppercase tracking-wider">Understanding SSN Structure</h3>
                <div className="space-y-3">
                  {parts.map((part, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 flex-shrink-0">
                        <span className="text-[10px] font-bold text-blue-400">{part.label}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-300 leading-relaxed">{part.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-white/10">
                  <p className="text-[10px] text-gray-400">
                    <span className="font-semibold text-gray-300">Example:</span> In SSN 123-45-6789, "123" is the area (geographic), "45" is the group (batch), and "6789" is the serial (unique identifier).
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {parts.map((part, index) => (
            <motion.div
              key={part.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white/5 border border-white/10 rounded-lg p-4 hover:border-blue-500/30 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-gray-500/0 group-hover:from-blue-500/5 group-hover:to-gray-500/5 transition-all duration-300" />
              <div className="relative">
                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">{part.label}</div>
                <div className="text-2xl font-bold font-mono text-white mb-1">
                  {part.shouldBlur ? ( // Conditionally render BlurredNumber if shouldBlur is true
                    <BlurredNumber
                      value={part.value}
                      isSubscribed={isSubscribed}
                      padLength={4}
                    />
                  ) : (
                    <AnimatedNumber
                      value={part.value}
                      padLength={part.label === "Area" ? 3 : part.label === "Group" ? 2 : 4}
                    />
                  )}
                </div>
                <div className="text-[10px] text-gray-600">{part.sublabel}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative flex items-center justify-center gap-2 p-4 bg-gradient-to-r from-blue-500/5 via-gray-500/5 to-blue-500/5 border border-white/10 rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-gray-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
          <span className="relative text-xl font-mono font-bold text-white">
            <AnimatedNumber value={area} padLength={3} />
          </span>
          <span className="relative text-gray-700">—</span>
          <span className="relative text-xl font-mono font-bold text-white">
            <AnimatedNumber value={group} padLength={2} />
          </span>
          <span className="relative text-gray-700">—</span>
          <span className="relative text-xl font-mono font-bold text-white">
            <BlurredNumber // Use BlurredNumber for the serial in the full SSN display
              value={serial}
              isSubscribed={isSubscribed}
              padLength={4}
            />
          </span>
        </motion.div>

      </CardContent>
    </Card>
  );
}