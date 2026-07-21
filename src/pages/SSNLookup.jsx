import React, { useState } from "react";
import { db } from "@/api/db";
import { AnimatePresence, motion } from "framer-motion";

import SSNBreakdown from "../components/ssn/SSNBreakdown";
import IssuanceInfo from "../components/ssn/IssuanceInfo";
import AIInsights from "../components/ssn/AIInsights";
import GeoMap, { stateCoordinates } from "../components/ssn/GeoMap";
import RiskAnalysis from "../components/ssn/RiskAnalysis";
import SSNGenerator from "../components/ssn/SSNGenerator";
import DeceasedCheck from "../components/ssn/DeceasedCheck";
import VerdictBanner from "../components/ssn/VerdictBanner";
import LoadingStatus from "../components/ssn/LoadingStatus";
import { MinimalBadge } from "../components/ui/minimal-badge";
import {
  SearchForm,
  FeatureCard,
  ExampleChips,
  HowItWorks,
} from "@/components/dashboard";
import { Map, Flag, Shield } from "lucide-react";

export default function SSNLookupPage() {
  const [ssn, setSSN] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [processingTime, setProcessingTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [riskScore, setRiskScore] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [deceasedData, setDeceasedData] = useState(null);
  const [isLoadingDeceased, setIsLoadingDeceased] = useState(false);
  const isSubscribed = true; // Free for all users

  const getStateFromArea = (area) => {
    const areaNum = parseInt(area);
    
    if (areaNum >= 1 && areaNum <= 3) return 'New Hampshire';
    if (areaNum >= 4 && areaNum <= 7) return 'Maine';
    if (areaNum >= 8 && areaNum <= 9) return 'Vermont';
    if (areaNum >= 10 && areaNum <= 34) return 'Massachusetts';
    if (areaNum >= 35 && areaNum <= 39) return 'Rhode Island';
    if (areaNum >= 40 && areaNum <= 49) return 'Connecticut';
    if (areaNum >= 50 && areaNum <= 134) return 'New York';
    if (areaNum >= 135 && areaNum <= 158) return 'New Jersey';
    if (areaNum >= 159 && areaNum <= 211) return 'Pennsylvania';
    if (areaNum >= 212 && areaNum <= 220) return 'Maryland';
    if (areaNum >= 221 && areaNum <= 222) return 'Delaware';
    if (areaNum >= 223 && areaNum <= 231) return 'Virginia';
    if (areaNum >= 232 && areaNum <= 236) return 'West Virginia';
    if (areaNum >= 237 && areaNum <= 246) return 'North Carolina';
    if (areaNum >= 247 && areaNum <= 251) return 'South Carolina';
    if (areaNum >= 252 && areaNum <= 260) return 'Georgia';
    if (areaNum >= 261 && areaNum <= 267) return 'Florida';
    if (areaNum >= 268 && areaNum <= 302) return 'Ohio';
    if (areaNum >= 303 && areaNum <= 317) return 'Indiana';
    if (areaNum >= 318 && areaNum <= 361) return 'Illinois';
    if (areaNum >= 362 && areaNum <= 386) return 'Michigan';
    if (areaNum >= 387 && areaNum <= 399) return 'Wisconsin';
    if (areaNum >= 400 && areaNum <= 407) return 'Kentucky';
    if (areaNum >= 408 && areaNum <= 415) return 'Tennessee';
    if (areaNum >= 416 && areaNum <= 424) return 'Alabama';
    if (areaNum >= 425 && areaNum <= 428) return 'Mississippi';
    if (areaNum >= 429 && areaNum <= 432) return 'Arkansas';
    if (areaNum >= 433 && areaNum <= 439) return 'Louisiana';
    if (areaNum >= 440 && areaNum <= 448) return 'Oklahoma';
    if (areaNum >= 449 && areaNum <= 467) return 'Texas';
    if (areaNum >= 468 && areaNum <= 477) return 'Minnesota';
    if (areaNum >= 478 && areaNum <= 485) return 'Iowa';
    if (areaNum >= 486 && areaNum <= 500) return 'Missouri';
    if (areaNum >= 501 && areaNum <= 502) return 'North Dakota';
    if (areaNum >= 503 && areaNum <= 504) return 'South Dakota';
    if (areaNum >= 505 && areaNum <= 508) return 'Nebraska';
    if (areaNum >= 509 && areaNum <= 515) return 'Kansas';
    if (areaNum >= 516 && areaNum <= 517) return 'Montana';
    if (areaNum >= 518 && areaNum <= 519) return 'Idaho';
    if (areaNum === 520) return 'Wyoming';
    if (areaNum >= 521 && areaNum <= 524) return 'Colorado';
    if (areaNum === 525) return 'New Mexico';
    if (areaNum >= 526 && areaNum <= 527) return 'Arizona';
    if (areaNum >= 528 && areaNum <= 529) return 'Utah';
    if (areaNum === 530) return 'Nevada';
    if (areaNum >= 531 && areaNum <= 539) return 'Washington';
    if (areaNum >= 540 && areaNum <= 544) return 'Oregon';
    if (areaNum >= 545 && areaNum <= 573) return 'California';
    if (areaNum === 574) return 'Alaska';
    if (areaNum >= 575 && areaNum <= 576) return 'Hawaii';
    if (areaNum >= 577 && areaNum <= 579) return 'District of Columbia';
    if (areaNum === 580) return 'Virgin Islands';
    if (areaNum >= 581 && areaNum <= 584) return 'Puerto Rico';
    if (areaNum === 585) return 'New Mexico';
    if (areaNum === 586) return 'Guam/American Samoa/Northern Mariana Islands/Philippine Islands';
    
    if (areaNum >= 587 && areaNum <= 599) return 'Randomized (Post-2011)';
    if (areaNum >= 600 && areaNum <= 626) return 'Randomized (Post-2011)';
    if (areaNum >= 627 && areaNum <= 645) return 'Randomized (Post-2011)';
    if (areaNum >= 646 && areaNum <= 647) return 'Randomized (Post-2011)';
    if (areaNum >= 648 && areaNum <= 649) return 'Randomized (Post-2011)';
    if (areaNum >= 650 && areaNum <= 665) return 'Randomized (Post-2011)';
    if (areaNum >= 667 && areaNum <= 899) return 'Randomized (Post-2011)';

    return 'Unknown/Invalid';
  };

  const getGroupIssuanceOrder = (groupNum) => {
    // SSA issued group numbers in a specific pattern, not sequentially
    // Pattern: Odd 01-09, Even 10-98, Even 02-08, Odd 11-99
    const group = parseInt(groupNum);
    
    // Odd numbers 01-09 (first issued)
    if (group % 2 === 1 && group <= 9) return group / 2; // 0-4 (5 groups)
    // Even numbers 10-98 (second batch)
    if (group % 2 === 0 && group >= 10 && group <= 98) return 5 + (group - 10) / 2; // 5-49 (45 groups)
    // Even numbers 02-08 (third batch)
    if (group % 2 === 0 && group <= 8) return 50 + group / 2 - 1; // 50-53 (4 groups)
    // Odd numbers 11-99 (last batch)
    if (group % 2 === 1 && group >= 11) return 54 + (group - 11) / 2; // 54-98 (45 groups)
    
    return 50; // Default to middle if can't determine
  };

  const estimateAgeFromYearRange = (yearRange, groupNumber) => {
    if (!yearRange || yearRange.includes('Unknown') || yearRange.includes('Invalid')) {
      return null;
    }
    
    const currentYear = new Date().getFullYear();
    
    if (yearRange.includes('Present')) {
      // Post-2011 randomized numbers - group doesn't indicate sequence
      return { min: 0, max: currentYear - 2011 };
    }
    
    // Parse year range like "1936-2011"
    const years = yearRange.split('-').map(y => parseInt(y.trim()));
    if (years.length === 2 && groupNumber) {
      const startYear = years[0];
      const endYear = years[1];
      const totalYears = endYear - startYear;
      
      // Get position in issuance sequence (0-98)
      const groupOrder = getGroupIssuanceOrder(groupNumber);
      const percentComplete = groupOrder / 99;
      
      // Estimate the year this group was being issued
      const estimatedIssueYear = Math.round(startYear + (totalYears * percentComplete));
      
      // Add some margin of error (±3 years)
      const margin = 3;
      
      return {
        min: currentYear - (estimatedIssueYear + margin),
        max: currentYear - (estimatedIssueYear - margin)
      };
    }
    
    // Fallback to full range if no group provided
    if (years.length === 2) {
      return {
        min: currentYear - years[1],
        max: currentYear - years[0]
      };
    }
    
    return null;
  };

  const getYearRange = (area) => {
    const areaNum = parseInt(area);
    
    if (areaNum >= 1 && areaNum <= 9) return '1936-1972';
    if (areaNum >= 10 && areaNum <= 49) return '1936-1980';
    if (areaNum >= 50 && areaNum <= 134) return '1936-2011';
    if (areaNum >= 135 && areaNum <= 211) return '1936-2011';
    if (areaNum >= 212 && areaNum <= 220) return '1936-1999';
    if (areaNum >= 221 && areaNum <= 222) return '1936-1996';
    if (areaNum >= 223 && areaNum <= 231) return '1936-2005';
    if (areaNum >= 232 && areaNum <= 236) return '1936-1988';
    if (areaNum >= 237 && areaNum <= 246) return '1936-2009';
    if (areaNum >= 247 && areaNum <= 251) return '1936-1992';
    if (areaNum >= 252 && areaNum <= 260) return '1936-2010';
    if (areaNum >= 261 && areaNum <= 267) return '1936-2011';
    if (areaNum >= 268 && areaNum <= 302) return '1936-2011';
    if (areaNum >= 303 && areaNum <= 317) return '1936-2004';
    if (areaNum >= 318 && areaNum <= 361) return '1936-2011';
    if (areaNum >= 362 && areaNum <= 386) return '1936-2011';
    if (areaNum >= 387 && areaNum <= 399) return '1936-2007';
    if (areaNum >= 400 && areaNum <= 407) return '1936-1999';
    if (areaNum >= 408 && areaNum <= 415) return '1936-2006';
    if (areaNum >= 416 && areaNum <= 424) return '1936-2003';
    if (areaNum >= 425 && areaNum <= 428) return '1936-1991';
    if (areaNum >= 429 && areaNum <= 432) return '1936-1994';
    if (areaNum >= 433 && areaNum <= 439) return '1936-2001';
    if (areaNum >= 440 && areaNum <= 448) return '1936-2000';
    if (areaNum >= 449 && areaNum <= 467) return '1936-2011';
    if (areaNum >= 468 && areaNum <= 477) return '1936-2008';
    if (areaNum >= 478 && areaNum <= 485) return '1936-1997';
    if (areaNum >= 486 && areaNum <= 500) return '1936-2010';
    if (areaNum >= 501 && areaNum <= 502) return '1936-1974';
    if (areaNum >= 503 && areaNum <= 504) return '1936-1975';
    if (areaNum >= 505 && areaNum <= 508) return '1936-1989';
    if (areaNum >= 509 && areaNum <= 515) return '1936-1998';
    if (areaNum >= 516 && areaNum <= 517) return '1936-1985';
    if (areaNum >= 518 && areaNum <= 519) return '1936-1990';
    if (areaNum === 520) return '1936-1973';
    if (areaNum >= 521 && areaNum <= 524) return '1936-2002';
    if (areaNum === 525) return '1936-1986';
    if (areaNum >= 526 && areaNum <= 527) return '1936-2008';
    if (areaNum >= 528 && areaNum <= 529) return '1936-1995';
    if (areaNum === 530) return '1936-1993';
    if (areaNum >= 531 && areaNum <= 539) return '1936-2011';
    if (areaNum >= 540 && areaNum <= 544) return '1936-2004';
    if (areaNum >= 545 && areaNum <= 573) return '1936-2011';
    if (areaNum === 574) return '1959-2007';
    if (areaNum >= 575 && areaNum <= 576) return '1959-2007';
    if (areaNum >= 577 && areaNum <= 579) return '1936-2007';
    if (areaNum === 580) return '1965-2007';
    if (areaNum >= 581 && areaNum <= 584) return '1936-2007';
    if (areaNum === 585) return '1965-1971';
    if (areaNum === 586) return '1936-1974';
    
    if (areaNum >= 587 && areaNum <= 899 && areaNum !== 666) return '2011-Present';
    
    if (areaNum === 666) return 'Reserved/Invalid';
    if (areaNum >= 900) return 'Invalid (IRS/ITIN)';
    
    return 'Unknown';
  };

  const performAdvancedValidation = (area, group, serial) => {
    const areaNum = parseInt(area);
    const groupNum = parseInt(group);
    const serialNum = parseInt(serial);
    const validationIssues = [];
    let isValid = true;

    if (areaNum === 0) {
      isValid = false;
      validationIssues.push('Area number 000 has never been issued by the SSA.');
    }
    if (areaNum === 666) {
      isValid = false;
      validationIssues.push('Area number 666 is reserved and never issued (religious sensitivity).');
    }
    if (areaNum >= 900 && areaNum <= 999) {
      isValid = false;
      validationIssues.push('Area numbers 900-999 are reserved for IRS Individual Taxpayer Identification Numbers (ITINs), not SSNs.');
    }
    
    if (areaNum === 734) {
      isValid = false;
      validationIssues.push('Area number 734 was never allocated by the SSA.');
    }

    if (groupNum === 0) {
      isValid = false;
      validationIssues.push('Group number 00 is never issued by the SSA.');
    }

    if (serialNum === 0) {
      isValid = false;
      validationIssues.push('Serial number 0000 is never issued by the SSA.');
    }

    const invalidSSNs = [
      '078-05-1120',
      '123-45-6789',
      '111-11-1111',
      '222-22-2222',
      '333-33-3333',
      '444-44-4444',
      '555-55-5555',
      '666-66-6666',
      '777-77-7777',
      '888-88-8888',
      '999-99-9999',
      '000-00-0000',
      '123-00-0000',
      '000-12-3456',
      '987-65-4320',
      '987-65-4321',
      '219-09-9999',
    ];

    const currentSSN = `${area}-${group}-${serial}`;
    if (invalidSSNs.includes(currentSSN)) {
      isValid = false;
      validationIssues.push('This is a known invalid, test, or widely publicized SSN that was never legitimately issued.');
    }

    if (areaNum === 78 && groupNum === 5 && serialNum >= 1120 && serialNum <= 1130) {
      isValid = false;
      validationIssues.push('This SSN was invalidated after the 1962 Woolworth wallet incident where it was mistakenly used by thousands of people.');
    }

    const allDigits = area + group + serial;
    
    if (allDigits.split('').every(d => d === allDigits[0])) {
      isValid = false;
      validationIssues.push('All identical digits detected - this pattern is never issued by the SSA.');
    }

    let isSequentialAsc = true;
    for (let i = 1; i < allDigits.length; i++) {
      if (parseInt(allDigits[i]) !== parseInt(allDigits[i-1]) + 1) {
        isSequentialAsc = false;
        break;
      }
    }
    if (isSequentialAsc) {
      isValid = false;
      validationIssues.push('Sequential ascending digits detected - this pattern is never issued by the SSA.');
    }

    let isSequentialDesc = true;
    for (let i = 1; i < allDigits.length; i++) {
      if (parseInt(allDigits[i]) !== parseInt(allDigits[i-1]) - 1) {
        isSequentialDesc = false;
        break;
      }
    }
    if (isSequentialDesc) {
      isValid = false;
      validationIssues.push('Sequential descending digits detected - this pattern is never issued by the SSA.');
    }

    if (areaNum >= 700 && areaNum <= 728) {
      validationIssues.push('This area range (700-728) was allocated to railroad workers under the Railroad Retirement Board before 1965, then reassigned for regular use.');
    }

    return {
      isValid,
      validationIssues
    };
  };

  const calculateRiskScore = (resultData) => {
    let score = 0;
    let flags = [];
    
    const areaNum = parseInt(resultData.area_number);
    const groupNum = parseInt(resultData.group_number);
    const serialNum = parseInt(resultData.serial_number);
    
    if (!resultData.is_valid) {
      score += 85;
      flags.push({ level: 'critical', message: 'Invalid SSN format or pattern detected.' });
      if (resultData.validationIssues && resultData.validationIssues.length > 0) {
        resultData.validationIssues.forEach(issue => flags.push({ level: 'critical', message: issue }));
      }
    }
    
    if (areaNum === 0 || areaNum === 666 || areaNum >= 900 || groupNum === 0 || serialNum === 0) {
      score += 95;
      if (!resultData.validationIssues.some(issue => issue.includes('reserved') || issue.includes('issued'))) {
        flags.push({ level: 'critical', message: 'Reserved or test number range/component detected.' });
      }
    }
    
    const testSSNs = ['123-45-6789', '111-11-1111', '000-00-0000', '078-05-1120'];
    if (testSSNs.includes(resultData.ssn)) {
      score += 100;
      if (!resultData.validationIssues.some(issue => issue.includes('known test'))) {
        flags.push({ level: 'critical', message: 'Known example/test/invalidated SSN.' });
      }
    }
    
    const serial = resultData.serial_number;
    const allDigits = resultData.area_number + resultData.group_number + serial;
    
    if (allDigits.split('').every(char => char === allDigits[0])) {
      score += 90;
      if (!resultData.validationIssues.some(issue => issue.includes('identical digits'))) {
        flags.push({ level: 'critical', message: 'All identical digits pattern detected.' });
      }
    }
    
    if (serial === '1234' || serial === '0000' || serial === '9999' || serial === '4321' || serial === '5678') {
      score += 60;
      flags.push({ level: 'high', message: 'Sequential or repeated pattern in serial number.' });
    }
    
    const group = resultData.group_number;
    if (group === '11' || group === '22' || group === '33' || group === '44' || 
        group === '55' || group === '66' || group === '77' || group === '88' || group === '99' ||
        group === '01' || group === '10' || group === '12' || group === '21') {
      score += 25;
      flags.push({ level: 'medium', message: 'Repeated or simple sequential pattern in group number.' });
    }
    
    if (resultData.year_range.includes('1936') && areaNum < 100) {
      score += 20;
      flags.push({ level: 'medium', message: 'Very early issuance period (higher likelihood of public exposure or pre-modern security).'});
    }

    if (resultData.year_range.includes('1936') && !resultData.year_range.includes('2011')) {
        const endYear = parseInt(resultData.year_range.split('-')[1]);
        if (endYear <= 1972) {
            score += 10;
            flags.push({ level: 'low', message: 'Issued before 1972 (pre-computerization era).' });
        }
    }
    
    if (resultData.year_range.includes('2011-Present')) {
      score = Math.max(0, score - 25);
      flags.push({ level: 'info', message: 'Post-2011 randomized format (enhanced security by design).' });
    }
    
    const highFreqAreas = [
      { start: 50, end: 134, state: 'NY' },
      { start: 545, end: 573, state: 'CA' },
      { start: 261, end: 267, state: 'FL' },
      { start: 449, end: 467, state: 'TX' },
      { start: 159, end: 211, state: 'PA' },
      { start: 268, end: 302, state: 'OH' }
    ];
    
    for (const range of highFreqAreas) {
      if (areaNum >= range.start && areaNum <= range.end) {
        score += 5;
        flags.push({ level: 'info', message: `Issued in a high-population state (${range.state}), indicating higher volume.` });
        break;
      }
    }
    
    
    score = Math.min(100, Math.max(0, score));
    
    return {
      score,
      risk_level: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
      flags,
      confidence: resultData.is_valid ? 95 : 45,
      is_smart_match: !resultData.is_valid && 
                      score <= 25 && 
                      !flags.some(f => f.level === 'critical') &&
                      !flags.some(f => f.message.includes('Death Master File')) &&
                      resultData.state && 
                      !resultData.state.includes('Unknown') && 
                      !resultData.state.includes('Invalid') && 
                      !resultData.state.includes('Randomized') &&
                      resultData.year_range && 
                      !resultData.year_range.includes('Unknown')
    };
  };

  const checkDeathRecords = async (resultData) => {
    // Only run for pre-2011 SSNs — post-2011 randomized SSNs can't be in the pre-2014 SSDI
    if (resultData.year_range.includes('2011-Present') || resultData.year_range.includes('Invalid') || resultData.year_range.includes('Unknown')) {
      setDeceasedData({
        deceased_match: null,
        summary: 'Death record check not applicable for post-2011 randomized SSNs or invalid numbers.',
        details: []
      });
      return;
    }

    setIsLoadingDeceased(true);
    try {
      const prompt = `You are a forensic researcher with access to public Social Security Death Index (SSDI) records.

A user is checking whether a Social Security Number may belong to a deceased individual.

SSN Details:
- Area Number: ${resultData.area_number}
- State of Issuance: ${resultData.state}
- Issuance Period: ${resultData.year_range}
- Format Valid: ${resultData.is_valid}

Based on publicly available SSDI data (deaths reported to SSA through 2014), historical genealogy databases, and public death records:

1. Is there any indication this SSN area/group combination appears in known deceased records?
2. What is the likelihood this number belongs to a deceased person based on the issuance era?
3. Any notable patterns in this area/era associated with deceased identity fraud?

Return a structured assessment. Be factual and conservative — only flag if there is genuine signal. Do NOT fabricate specific person data.`;

      const response = await db.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            deceased_match: { type: "boolean" },
            summary: { type: "string" },
            details: { type: "array", items: { type: "string" } }
          }
        }
      });

      setDeceasedData(response);
    } catch (error) {
      setDeceasedData({
        deceased_match: null,
        summary: 'Death record check unavailable at this time.',
        details: []
      });
    } finally {
      setIsLoadingDeceased(false);
    }
  };

  const generateAIInsights = async (resultData, risk) => {
    setIsLoadingInsights(true);
    
    // Determine masked components for the AI prompt if not subscribed
    // Area number is generally less sensitive and often linked to state.
    // Group and Serial numbers are highly sensitive.
    const groupForAI = !isSubscribed ? 'XX' : resultData.group_number;
    const serialForAI = !isSubscribed ? 'XXXX' : resultData.serial_number;

    try {
      const prompt = `You are an expert forensic analyst specializing in Social Security Number verification and historical records analysis.

Analyze this SSN information and provide detailed, intelligent insights:

SSN Components:
- Area Number: ${resultData.area_number}
- Group Number: ${groupForAI}
- Serial Number: ${serialForAI}
- Issuance State/Region: ${resultData.state}
- Issuance Period: ${resultData.year_range}
- Format Validity: ${resultData.is_valid ? 'Valid' : 'Invalid'}
- Risk Level: ${risk.risk_level} (Score: ${risk.score}/100)

${resultData.validationIssues && resultData.validationIssues.length > 0 ? `
Validation Issues Detected:
${resultData.validationIssues.map(issue => `- ${issue}`).join('\n')}
` : ''}

Risk Flags:
${risk.flags.map(flag => `- [${flag.level.toUpperCase()}] ${flag.message}`).join('\n')}

Provide a comprehensive forensic analysis with:
1. A brief executive summary (2-3 sentences)
2. Historical context about this SSN's issuance period and location
3. Pattern analysis - any notable patterns or anomalies in the number sequence
4. Security considerations - what this means from a security/fraud perspective
5. 2-3 key recommendations or observations

Be technical but clear. Focus on facts and historical data. Make it feel like advanced forensic analysis.`;

      const response = await db.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            historical_context: { type: "string" },
            pattern_analysis: { type: "string" },
            security_notes: { type: "string" },
            recommendations: { 
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      setAiInsights(response);
    } catch (error) {
      console.error('Error generating insights:', error);
      // Set a fallback message instead of showing error
      setAiInsights({
        summary: "AI analysis temporarily unavailable. The SSN analysis results above provide comprehensive information about this number.",
        historical_context: `This SSN was issued in ${resultData.state} during the period ${resultData.year_range}.`,
        pattern_analysis: "Manual pattern analysis available in the Risk Analysis section above.",
        security_notes: `This SSN has a risk score of ${risk.score}/100, classified as ${risk.risk_level} risk.`,
        recommendations: [
          "Review the Risk Analysis section for detailed security assessment",
          "Check the Validation Issues for specific concerns",
          "Consider the issuance period and location context"
        ]
      });
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const validateSSN = async (ssnValue) => {
    const startTime = performance.now();
    setIsProcessing(true);
    setRiskScore(null);
    setError('');
    setAiInsights(null);
    setDeceasedData(null);
    setShowHomeGenerator(false);

    await new Promise(resolve => setTimeout(resolve, 300));

    const numbers = ssnValue.replace(/\D/g, '');
    
    if (numbers.length !== 9) {
      setError('SSN must be 9 digits');
      setIsValid(false);
      setResults(null);
      setIsProcessing(false);
      return;
    }

    const area = numbers.substring(0, 3);
    const group = numbers.substring(3, 5);
    const serial = numbers.substring(5, 9);

    const validation = performAdvancedValidation(area, group, serial);

    const endTime = performance.now();
    setProcessingTime(Math.round(endTime - startTime));
    
    setIsValid(validation.isValid);
    
    const state = getStateFromArea(area);
    const yearRange = getYearRange(area);

    const resultData = {
      ssn: ssnValue,
      area_number: area,
      group_number: group,
      serial_number: serial,
      state,
      year_range: yearRange,
      is_valid: validation.isValid,
      validationIssues: validation.validationIssues
    };

    setResults(resultData);
    
    const risk = calculateRiskScore(resultData);
    setRiskScore(risk);

    setIsProcessing(false);

    generateAIInsights(resultData, risk);
    checkDeathRecords(resultData);

    const coordinates = stateCoordinates[state];
    if (coordinates) {
      const newSearch = {
        state,
        coordinates,
        isValid: validation.isValid,
        riskLevel: risk.risk_level,
        riskScore: risk.score,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      const updatedHistory = [...searchHistory, newSearch].slice(-10);
      setSearchHistory(updatedHistory);
    }

    // Skip saving for free version
    // Analytics disabled for public access
  };

  const handleSSNChange = (value) => {
    setSSN(value);
    if (value.length === 11) {
      validateSSN(value);
    } else {
      setResults(null);
      setError('');
      setIsValid(false);
      setProcessingTime(null);
      setIsProcessing(false);
      setRiskScore(null);
      setAiInsights(null);
      setIsLoadingInsights(false);
      setDeceasedData(null);
      setIsLoadingDeceased(false);
    }
  };

  const handleGeneratedSSN = (generatedSSN) => {
    setSSN(generatedSSN);
    validateSSN(generatedSSN);
  };

  const generateRandomSSN = () => {
    const useHistorical = Math.random() > 0.3;
    
    if (useHistorical) {
      const commonStates = [
        { state: 'California', min: 545, max: 573 },
        { state: 'New York', min: 50, max: 134 },
        { state: 'Texas', min: 449, max: 467 },
        { state: 'Florida', min: 261, max: 267 },
        { state: 'Pennsylvania', min: 159, max: 211 },
        { state: 'Illinois', min: 318, max: 361 },
        { state: 'Ohio', min: 268, max: 302 },
        { state: 'Georgia', min: 252, max: 260 },
        { state: 'North Carolina', min: 237, max: 246 },
        { state: 'Michigan', min: 362, max: 386 },
        { state: 'New Jersey', min: 135, max: 158 },
        { state: 'Virginia', min: 223, max: 231 },
        { state: 'Washington', min: 531, max: 539 },
        { state: 'Arizona', min: 526, max: 527 },
        { state: 'Massachusetts', min: 10, max: 34 },
        { state: 'Tennessee', min: 408, max: 415 },
        { state: 'Indiana', min: 303, max: 317 },
        { state: 'Missouri', min: 486, max: 500 },
        { state: 'Maryland', min: 212, max: 220 },
        { state: 'Wisconsin', min: 387, max: 399 },
        { state: 'Colorado', min: 521, max: 524 },
        { state: 'Minnesota', min: 468, max: 477 },
        { state: 'South Carolina', min: 247, max: 251 },
        { state: 'Alabama', min: 416, max: 424 },
        { state: 'Louisiana', min: 433, max: 439 },
        { state: 'Kentucky', min: 400, max: 407 },
        { state: 'Oregon', min: 540, max: 544 },
        { state: 'Oklahoma', min: 440, max: 448 },
        { state: 'Connecticut', min: 40, max: 49 },
        { state: 'Iowa', min: 478, max: 485 }
      ];
      
      const randomState = commonStates[Math.floor(Math.random() * commonStates.length)];
      const area = String(Math.floor(Math.random() * (randomState.max - randomState.min + 1)) + randomState.min).padStart(3, '0');
      const group = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
      const serial = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      return `${area}-${group}-${serial}`;
    } else {
      const area = String(Math.floor(Math.random() * (899 - 587 + 1)) + 587).padStart(3, '0');
      const group = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
      const serial = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      return `${area}-${group}-${serial}`;
    }
  };

  const handleRegenerate = () => {
    const newSSN = generateRandomSSN();
    setSSN(newSSN);
    validateSSN(newSSN);
  };

  const displaySSN = ssn;

  const handleLookup = (formatted) => {
    const next = formatted || ssn;
    setSSN(next);
    if (String(next).replace(/\D/g, "").length === 9) {
      validateSSN(next);
    }
  };

  return (
    <div className="min-h-full bg-go-bg">
      <div className="mx-auto w-full max-w-[900px] px-3 pb-16 pt-8 sm:px-6 sm:pt-10 md:px-8 md:pt-14">
        <div className="mb-8 sm:mb-10">
          <h2 className="text-[24px] font-semibold tracking-tight text-go-text sm:text-[28px] md:text-[32px]">
            SSN Lookup
          </h2>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-go-text-secondary">
            Fast, accurate identity intelligence &amp; SSN verification
          </p>
        </div>

        <div className="mb-10">
          <SearchForm
            value={displaySSN}
            onChange={handleSSNChange}
            onLookup={handleLookup}
            isProcessing={isProcessing}
            error={error}
          />

          {processingTime && !isProcessing && (
            <div className="mt-3">
              <MinimalBadge variant="neutral" size="sm">
                Verified in {processingTime}ms
              </MinimalBadge>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {results && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="mb-10 space-y-4"
            >
              <VerdictBanner results={results} riskScore={riskScore} />

              <LoadingStatus
                isLoadingDeceased={isLoadingDeceased}
                isLoadingInsights={isLoadingInsights}
                hasDeceased={!!deceasedData}
                hasInsights={!!aiInsights}
              />

              <SSNBreakdown
                area={results.area_number}
                group={results.group_number}
                serial={results.serial_number}
                state={results.state}
                onRegenerate={handleRegenerate}
              />

              {riskScore && <RiskAnalysis riskData={riskScore} />}

              {(deceasedData || isLoadingDeceased) && (
                <DeceasedCheck data={deceasedData} isLoading={isLoadingDeceased} />
              )}

              {(aiInsights || isLoadingInsights) && (
                <AIInsights
                  insights={aiInsights}
                  isLoading={isLoadingInsights}
                  isSubscribed={isSubscribed}
                  ssnData={results}
                />
              )}

              <IssuanceInfo
                state={results.state}
                yearRange={results.year_range}
                estimatedAge={estimateAgeFromYearRange(
                  results.year_range,
                  results.group_number
                )}
                isValid={results.is_valid}
                validationIssues={results.validationIssues}
                fullData={{
                  ssn: results.ssn,
                  area_number: results.area_number,
                  group_number: results.group_number,
                  serial_number: results.serial_number,
                  risk_score: riskScore?.score,
                }}
              />

              {searchHistory.length > 0 && (
                <GeoMap searches={searchHistory} />
              )}

              <SSNGenerator onGenerate={handleGeneratedSSN} />
            </motion.div>
          )}
        </AnimatePresence>

        {!results && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FeatureCard
                icon={Map}
                title="State & Era"
                description="Identify the issuing state and time period."
              />
              <FeatureCard
                icon={Flag}
                title="Risk Scoring"
                description="Detect invalid, test, or suspicious patterns."
              />
              <FeatureCard
                icon={Shield}
                title="Death Check"
                description="Cross-reference SSDI for deceased identity signals."
              />
            </div>

            <ExampleChips
              onSelect={(ex) => {
                setSSN(ex);
                validateSSN(ex);
              }}
            />

            <HowItWorks />
          </div>
        )}
      </div>
    </div>
  );
}