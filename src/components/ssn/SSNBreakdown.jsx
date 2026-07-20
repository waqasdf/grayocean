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
    <Card
      className="rounded-lg border"
      style={{ background: 'var(--go-bg-card)', borderColor: 'var(--go-border)' }}
    >
      <CardHeader className="border-b pb-3" style={{ borderColor: 'var(--go-border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-[13px] font-medium" style={{ color: 'var(--go-text)' }}>
              Breakdown
            </CardTitle>
            {state && (
              <MinimalBadge variant="info" size="xs">
                {state}
              </MinimalBadge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowInfo(!showInfo)}
              size="sm"
              variant="ghost"
              className="h-8 px-2.5 text-[12px]"
              style={{ color: 'var(--go-text-secondary)' }}
            >
              {showInfo ? 'Hide Info' : 'Show Info'}
            </Button>
            {onRegenerate && (
              <Button
                onClick={onRegenerate}
                size="sm"
                className="h-8 text-[12px] border"
                style={{
                  background: 'transparent',
                  color: 'var(--go-accent)',
                  borderColor: 'var(--go-accent-border)',
                }}
              >
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-lg border p-4 space-y-3"
                style={{
                  background: 'var(--go-accent-soft)',
                  borderColor: 'var(--go-accent-border)',
                }}
              >
                <h3 className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--go-text-muted)' }}>Understanding SSN Structure</h3>
                <div className="space-y-3">
                  {parts.map((part, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-16 flex-shrink-0">
                        <span className="text-[12px] font-medium" style={{ color: 'var(--go-accent)' }}>{part.label}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--go-text-secondary)' }}>{part.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t" style={{ borderColor: 'var(--go-border)' }}>
                  <p className="text-[12px]" style={{ color: 'var(--go-text-muted)' }}>
                    <span className="font-medium" style={{ color: 'var(--go-text-secondary)' }}>Example:</span> In SSN 123-45-6789, "123" is the area (geographic), "45" is the group (batch), and "6789" is the serial (unique identifier).
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {parts.map((part, index) => (
            <motion.div
              key={part.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative rounded-lg border p-4 transition-colors"
              style={{
                background: 'var(--go-bg-panel)',
                borderColor: 'var(--go-border)',
              }}
            >
              <div className="relative">
                <div className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--go-text-muted)' }}>{part.label}</div>
                <div className="text-2xl font-semibold font-mono mb-1" style={{ color: 'var(--go-text)' }}>
                  {part.shouldBlur ? (
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
                <div className="text-[12px]" style={{ color: 'var(--go-text-muted)' }}>{part.sublabel}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative flex items-center justify-center gap-2 p-4 rounded-lg border"
          style={{
            background: 'var(--go-bg-panel)',
            borderColor: 'var(--go-border)',
          }}
        >
          <span className="relative text-xl font-mono font-semibold" style={{ color: 'var(--go-text)' }}>
            <AnimatedNumber value={area} padLength={3} />
          </span>
          <span className="relative" style={{ color: 'var(--go-text-muted)' }}>—</span>
          <span className="relative text-xl font-mono font-semibold" style={{ color: 'var(--go-text)' }}>
            <AnimatedNumber value={group} padLength={2} />
          </span>
          <span className="relative" style={{ color: 'var(--go-text-muted)' }}>—</span>
          <span className="relative text-xl font-mono font-semibold" style={{ color: 'var(--go-text)' }}>
            <BlurredNumber
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
