import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MinimalBadge } from "../ui/minimal-badge";
import { motion, AnimatePresence } from "framer-motion";
// Importing the AnimatedSSN component
import { BlurredSSN, UpgradePrompt } from "./BlurredSSN"; // New import
import { User } from "@/entities/User"; // New import
import { Link } from "react-router-dom"; // New import
import { createPageUrl } from "@/utils"; // New import
import { Sparkles, X } from "lucide-react"; // New imports

const stateAreaRanges = {
  'Alabama': { min: 416, max: 424 },
  'Alaska': { min: 574, max: 574 },
  'Arizona': { min: 526, max: 527 },
  'Arkansas': { min: 429, max: 432 },
  'California': { min: 545, max: 573 },
  'Colorado': { min: 521, max: 524 },
  'Connecticut': { min: 40, max: 49 },
  'Delaware': { min: 221, max: 222 },
  'Florida': { min: 261, max: 267 },
  'Georgia': { min: 252, max: 260 },
  'Hawaii': { min: 575, max: 576 },
  'Idaho': { min: 518, max: 519 },
  'Illinois': { min: 318, max: 361 },
  'Indiana': { min: 303, max: 317 },
  'Iowa': { min: 478, max: 485 },
  'Kansas': { min: 509, max: 515 },
  'Kentucky': { min: 400, max: 407 },
  'Louisiana': { min: 433, max: 439 },
  'Maine': { min: 4, max: 7 },
  'Maryland': { min: 212, max: 220 },
  'Massachusetts': { min: 10, max: 34 },
  'Michigan': { min: 362, max: 386 },
  'Minnesota': { min: 468, max: 477 },
  'Mississippi': { min: 425, max: 428 },
  'Missouri': { min: 486, max: 500 },
  'Montana': { min: 516, max: 517 },
  'Nebraska': { min: 505, max: 508 },
  'Nevada': { min: 530, max: 530 },
  'New Hampshire': { min: 1, max: 3 },
  'New Jersey': { min: 135, max: 158 },
  'New Mexico': { min: 525, max: 525 },
  'New York': { min: 50, max: 134 },
  'North Carolina': { min: 237, max: 246 },
  'North Dakota': { min: 501, max: 502 },
  'Ohio': { min: 268, max: 302 },
  'Oklahoma': { min: 440, max: 448 },
  'Oregon': { min: 540, max: 544 },
  'Pennsylvania': { min: 159, max: 211 },
  'Rhode Island': { min: 35, max: 39 },
  'South Carolina': { min: 247, max: 251 },
  'South Dakota': { min: 503, max: 504 },
  'Tennessee': { min: 408, max: 415 },
  'Texas': { min: 449, max: 467 },
  'Utah': { min: 528, max: 529 },
  'Vermont': { min: 8, max: 9 },
  'Virginia': { min: 223, max: 231 },
  'Washington': { min: 531, max: 539 },
  'West Virginia': { min: 232, max: 236 },
  'Wisconsin': { min: 387, max: 399 },
  'Wyoming': { min: 520, max: 520 },
  'District of Columbia': { min: 577, max: 579 },
  'Puerto Rico': { min: 581, max: 584 },
  'Virgin Islands': { min: 580, max: 580 }
};

export default function SSNGenerator({ onGenerate }) {
  const [age, setAge] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [generatedSSNs, setGeneratedSSNs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateSSN = () => {
    if (!age || !selectedState) return null;

    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - parseInt(age, 10);
    
    // If born after 2011, use randomized range
    if (birthYear >= 2011) {
      const area = String(Math.floor(Math.random() * (899 - 587 + 1)) + 587).padStart(3, '0');
      const group = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
      const serial = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      return `${area}-${group}-${serial}`;
    }
    
    // Pre-2011: use state-based allocation
    const stateRange = stateAreaRanges[selectedState];
    if (!stateRange) return null;

    const area = String(Math.floor(Math.random() * (stateRange.max - stateRange.min + 1)) + stateRange.min).padStart(3, '0');
    const group = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
    const serial = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    
    return `${area}-${group}-${serial}`;
  };

  const handleGenerate = async () => {
    if (!age || !selectedState) return;
    
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    
    const newSSNs = [];
    for (let i = 0; i < 5; i++) {
      const ssn = generateSSN();
      if (ssn) newSSNs.push(ssn);
    }
    
    setGeneratedSSNs(newSSNs);
    setIsGenerating(false);
  };

  const handleCopy = async (ssn, index) => {
    await navigator.clipboard.writeText(ssn);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAnalyze = (ssn) => {
    if (onGenerate) {
      onGenerate(ssn);
    }
  };

  const states = Object.keys(stateAreaRanges).sort();

  return (
    <>
      <Card
        className="rounded-lg border"
        style={{ background: 'var(--go-bg-card)', borderColor: 'var(--go-border)' }}
      >
        <CardHeader className="border-b pb-3" style={{ borderColor: 'var(--go-border)' }}>
          <CardTitle className="text-[13px] font-medium flex items-center gap-2" style={{ color: 'var(--go-text)' }}>
            SSN Generator
            <span className="ml-auto">
              <MinimalBadge variant="cyan" size="xs">
                Experimental
              </MinimalBadge>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium mb-1.5 block" style={{ color: 'var(--go-text-secondary)' }}>
                Age
              </label>
              <Input
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-8 text-[13px] rounded-md border focus-visible:ring-0"
                style={{
                  background: 'var(--go-input-bg)',
                  borderColor: 'var(--go-input-border)',
                  color: 'var(--go-input-text)',
                }}
                min="0"
                max="120"
              />
            </div>
            
            <div>
              <label className="text-[12px] font-medium mb-1.5 block" style={{ color: 'var(--go-text-secondary)' }}>
                State of Issuance
              </label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger
                  className="h-8 text-[13px] rounded-md border"
                  style={{
                    background: 'var(--go-input-bg)',
                    borderColor: 'var(--go-input-border)',
                    color: 'var(--go-input-text)',
                  }}
                >
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent
                  className="border"
                  style={{ background: 'var(--go-bg-elevated)', borderColor: 'var(--go-border)' }}
                >
                  {states.map(state => (
                    <SelectItem
                      key={state}
                      value={state}
                      className="text-[13px]"
                      style={{ color: 'var(--go-text)' }}
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerate}
              disabled={!age || !selectedState || isGenerating}
              className="flex-1 h-8 text-[13px] text-white border-0 disabled:opacity-50"
              style={{ background: 'var(--go-accent)' }}
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Numbers
                </>
              )}
            </Button>
            

          </div>

          <AnimatePresence mode="wait">
            {generatedSSNs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-2"
              >
                <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--go-text-muted)' }}>
                  Generated Numbers
                </div>
                {generatedSSNs.map((ssn, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg border transition-colors"
                    style={{
                      background: 'var(--go-bg-panel)',
                      borderColor: 'var(--go-border)',
                    }}
                  >
                    <div className="flex-1 font-mono text-[14px]" style={{ color: 'var(--go-text)' }}>
                      {ssn}
                    </div>
                        <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(ssn, index)}
                        className="h-8 text-[12px]"
                        style={{ color: 'var(--go-text-secondary)' }}
                      >
                        {copiedIndex === index ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAnalyze(ssn)}
                        className="h-8 text-[12px] border"
                        style={{
                          background: 'transparent',
                          color: 'var(--go-accent)',
                          borderColor: 'var(--go-accent-border)',
                        }}
                      >
                        Analyze
                      </Button>
                    </>
                  </motion.div>
                ))}

              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="text-[12px] rounded-lg border p-3"
            style={{
              color: 'var(--go-text-muted)',
              background: 'var(--go-bg-panel)',
              borderColor: 'var(--go-border)',
            }}
          >
            <span className="font-medium" style={{ color: 'var(--go-text-secondary)' }}>Note:</span> Generated numbers follow historical SSA allocation patterns based on age and state. Numbers are for educational and testing purposes only.
          </div>
        </CardContent>
      </Card>

    </>
  );
}
