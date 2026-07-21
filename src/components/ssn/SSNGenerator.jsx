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
      <Card className="border border-white/10 bg-white/[0.03] backdrop-blur-sm">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-xs font-semibold text-white flex items-center gap-2">
            SSN Generator
            <span className="ml-auto">
              <MinimalBadge variant="cyan" size="xs">
                Experimental
              </MinimalBadge>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                Age
              </label>
              <Input
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-xs"
                min="0"
                max="120"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                State of Issuance
              </label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(0,0%,12%)] border-white/10">
                  {states.map(state => (
                    <SelectItem key={state} value={state} className="text-white hover:bg-white/10 text-xs">
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
              className="flex-1 bg-gradient-to-r from-blue-500 to-gray-600 hover:from-blue-600 hover:to-gray-700 text-white border-0 disabled:opacity-50 text-xs"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="text-[10px] font-semibold text-white uppercase tracking-wider">
                  Generated Numbers
                </div>
                {generatedSSNs.map((ssn, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-gray-500/5 transition-all group"
                  >
                    <div className="flex-1 font-mono text-base text-white">
                      {ssn}
                    </div>
                        <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(ssn, index)}
                        className="text-gray-400 hover:text-white text-xs"
                      >
                        {copiedIndex === index ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAnalyze(ssn)}
                        className="bg-gradient-to-r from-blue-500/20 to-gray-500/20 hover:from-blue-500/30 hover:to-gray-500/30 text-white border border-white/10 text-xs"
                      >
                        Analyze
                      </Button>
                    </>
                  </motion.div>
                ))}

              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-[10px] text-gray-500 bg-white/5 border border-white/10 rounded-lg p-3">
            <span className="font-medium text-gray-400">Note:</span> Generated numbers follow historical SSA allocation patterns based on age and state. Numbers are for educational and testing purposes only.
          </div>
        </CardContent>
      </Card>

    </>
  );
}