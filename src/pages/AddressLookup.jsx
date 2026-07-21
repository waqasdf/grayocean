import React, { useState, useEffect, useRef } from "react";
import { Address } from "@/entities/Address";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { InvokeLLM } from "@/integrations/Core";
import AddressMap from "../components/address/AddressMap";
import DemographicCharts from "../components/address/DemographicCharts";
import SaveAddressButton from "../components/address/SaveAddressButton";
import AdditionalIntelligence from "../components/address/AdditionalIntelligence";
import { MinimalBadge } from "../components/ui/minimal-badge";
import LenderApprovalAlert from "../components/address/LenderApprovalAlert";
import {
  WorkspacePage,
  WorkspacePanel,
  PrimaryButton,
  GhostButton,
} from "@/components/dashboard";
import { LookupCostHint } from "@/components/shared/LookupCostHint";

export default function AddressLookupPage() {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState('');
  const [rateLimitCooldown, setRateLimitCooldown] = useState(0);
  
  // Auto-complete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const debounceTimer = useRef(null);
  const suggestionsRef = useRef(null);

  const calculateNeighborhoodScore = (data) => {
    let score = 0;
    
    const incomeScore = Math.min(30, (data.median_household_income / 150000) * 30);
    score += incomeScore;
    
    const educationScore = Math.min(20, (data.education_bachelor_plus / 50) * 20);
    score += educationScore;
    
    const homeValueScore = Math.min(20, (data.median_home_value / 500000) * 20);
    score += homeValueScore;
    
    const densityScore = data.population_density > 10000 ? 7.5 : 
                        data.population_density > 5000 ? 15 : 
                        data.population_density > 1000 ? 12 : 7.5;
    score += densityScore;
    
    const povertyScore = Math.min(15, ((30 - data.poverty_rate) / 30) * 15);
    score += povertyScore;
    
    return Math.round(Math.min(100, score));
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return { label: 'Elite', color: 'text-go-primary', gradient: 'from-go-primary to-go-text-muted' };
    if (score >= 80) return { label: 'Excellent', color: 'text-go-primary', gradient: 'from-go-primary to-go-border-strong' };
    if (score >= 70) return { label: 'Very Good', color: 'text-go-text', gradient: 'from-go-text-secondary to-go-primary' };
    if (score >= 60) return { label: 'Good', color: 'text-go-text-secondary', gradient: 'from-go-text-muted to-go-border-strong' };
    if (score >= 50) return { label: 'Average', color: 'text-go-text-muted', gradient: 'from-go-text-muted to-go-border' };
    return { label: 'Below Average', color: 'text-go-text-muted', gradient: 'from-go-border-strong to-go-border' };
  };

  const getIncomeBracket = (income) => {
    if (income < 35000) return { label: 'Low Income', color: 'text-go-text-muted', bg: 'bg-go-surface-muted', border: 'border-go-border' };
    if (income < 60000) return { label: 'Below Average', color: 'text-go-text-secondary', bg: 'bg-go-surface-muted', border: 'border-go-border' };
    if (income < 90000) return { label: 'Average', color: 'text-go-text', bg: 'bg-go-surface-muted', border: 'border-go-border' };
    if (income < 120000) return { label: 'Above Average', color: 'text-go-primary', bg: 'bg-go-surface-muted', border: 'border-go-border' };
    if (income < 150000) return { label: 'High Income', color: 'text-go-primary', bg: 'bg-go-surface-muted', border: 'border-go-border' };
    return { label: 'Very High Income', color: 'text-go-primary', bg: 'bg-go-surface-muted', border: 'border-go-border' };
  };

  const fetchAddressSuggestions = async (inputValue) => {
    if (!inputValue || inputValue.length < 3 || autocompleteDisabled) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);

    try {
      const prompt = `You are a US address autocomplete system. Suggest 5 complete, realistic US addresses that match: "${inputValue}"

Format each as: Street Address, City, State ZIP

Examples of common patterns:
- 123 Main Street, New York, NY 10001
- 456 Oak Avenue, Los Angeles, CA 90001
- 789 Elm Drive, Chicago, IL 60601

Return ONLY 5 addresses matching the input pattern, one per line.`;

      const response = await InvokeLLM({
        prompt: prompt,
      });

      const addressLines = response.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && line.includes(','))
        .slice(0, 5);

      const parsedSuggestions = addressLines.map(line => {
        const parts = line.replace(/^[-\d]+[.)\s]+/, '').split(',').map(p => p.trim());
        if (parts.length >= 3) {
          const street = parts[0];
          const city = parts[1];
          const stateZip = parts[2].split(' ');
          const state = stateZip[0];
          const zip = stateZip[1] || '';
          
          return {
            street,
            city,
            state,
            zip,
            full: line.replace(/^[-\d]+[.)\s]+/, '')
          };
        }
        return null;
      }).filter(Boolean);

      setSuggestions(parsedSuggestions);
      setShowSuggestions(parsedSuggestions.length > 0);
    } catch (err) {
      console.error('Suggestion error:', err);
      
      if (err.message && (err.message.includes('429') || err.message.includes('Network'))) {
        setAutocompleteDisabled(true);
        setTimeout(() => setAutocompleteDisabled(false), 60000);
      }
      
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleStreetChange = (value) => {
    setAddress({...address, street: value});
    setSelectedSuggestionIndex(-1);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    if (autocompleteDisabled) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    if (value.length >= 3) {
      debounceTimer.current = setTimeout(() => {
        fetchAddressSuggestions(value);
      }, 800);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setAddress({
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zip: suggestion.zip
    });
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateInputs = () => {
    if (!address.street.trim()) {
      setError('Street address is required');
      return false;
    }
    if (!address.city.trim()) {
      setError('City is required');
      return false;
    }
    if (!address.state.trim()) {
      setError('State is required');
      return false;
    }
    if (address.state.length !== 2) {
      setError('State must be 2 letters (e.g., NY, CA)');
      return false;
    }
    if (address.zip && (address.zip.length !== 5 || !/^\d+$/.test(address.zip))) {
      setError('ZIP code must be 5 digits');
      return false;
    }
    setError('');
    return true;
  };

  const checkDuplicateSearch = () => {
    const searchKey = `${address.street}-${address.city}-${address.state}-${address.zip || ''}`.toLowerCase();
    const existingResult = searchHistory.find(item =>
      `${item.street_address}-${item.city}-${item.state}-${item.zip_code === "Not provided" ? '' : item.zip_code}`.toLowerCase() === searchKey
    );
    return existingResult;
  };

  const handleSearch = async () => {
    if (!validateInputs()) return;

    const cachedResult = checkDuplicateSearch();
    if (cachedResult) {
      setResults(cachedResult);
      setError('');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (rateLimitCooldown > 0) {
      setError(`Please wait ${rateLimitCooldown} seconds before searching again`);
      return;
    }

    setIsSearching(true);
    setError('');
    setSuggestions([]);
    setShowSuggestions(false);

    try {
      const fullAddress = `${address.street}, ${address.city}, ${address.state}${address.zip ? ' ' + address.zip : ''}`;

      const prompt = `You are an address validation and comprehensive real estate intelligence expert with access to US Census Bureau data, school ratings, crime statistics, and local amenity information.

Analyze this address: ${fullAddress}

Provide COMPREHENSIVE data:

1. Address Validation:
   - Is this a real, deliverable address?
   - Geographic coordinates (latitude/longitude)
   - County name

2. Demographics (ZIP code area):
   - Median household income
   - Median home value
   - Population density (people per sq mi)
   - Poverty rate (percentage)
   - Percentage with bachelor's degree or higher
   - Area type (urban/suburban/rural)

3. Neighborhood Intelligence:
   - National income percentile ranking
   - Comparable areas (similar neighborhoods)
   - Growth trajectory analysis
   - Business suitability recommendations
   - Notable characteristics

4. Schools & Education:
   - Nearby highly-rated schools (within 2 miles)
   - School district quality summary
   - Average test scores if available

5. Safety & Crime:
   - Crime rate comparison to national average
   - Specific crime statistics if available
   - Safety rating summary

6. Walkability & Transit:
   - Walk Score equivalent (0-100)
   - Public transit availability
   - Bike-friendliness
   - Commute time estimates to major employment centers

7. Local Amenities:
   - Nearby parks, shopping, restaurants
   - Healthcare facilities
   - Entertainment options

Use real data sources when possible. Provide specific, actionable intelligence.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            is_valid: { type: "boolean" },
            validation_notes: { type: "string" },
            latitude: { type: "number" },
            longitude: { type: "number" },
            county: { type: "string" },
            median_household_income: { type: "number" },
            income_bracket: {
              type: "string",
              enum: ["low", "below_average", "average", "above_average", "high", "very_high"]
            },
            median_home_value: { type: "number" },
            population_density: { type: "number" },
            poverty_rate: { type: "number" },
            education_bachelor_plus: { type: "number" },
            area_type: { type: "string", enum: ["urban", "suburban", "rural"] },
            demographic_summary: { type: "string" },
            national_percentile: { type: "string" },
            comparable_areas: { type: "array", items: { type: "string" } },
            growth_trajectory: { type: "string" },
            business_suitability: { type: "array", items: { type: "string" } },
            notable_characteristics: { type: "array", items: { type: "string" } },
            schools: { type: "array", items: { type: "string" } },
            crime: { type: "array", items: { type: "string" } },
            walkability: { type: "array", items: { type: "string" } },
            amenities: { type: "array", items: { type: "string" } }
          }
        }
      });

      const neighborhoodScore = calculateNeighborhoodScore(response);

      const resultData = {
        street_address: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zip || "Not provided",
        is_valid: response.is_valid,
        latitude: response.latitude,
        longitude: response.longitude,
        county: response.county,
        median_household_income: response.median_household_income,
        income_bracket: response.income_bracket,
        median_home_value: response.median_home_value,
        population_density: response.population_density,
        poverty_rate: response.poverty_rate,
        education_bachelor_plus: response.education_bachelor_plus,
        area_type: response.area_type,
        validation_notes: response.validation_notes,
        demographic_summary: response.demographic_summary,
        neighborhood_score: neighborhoodScore,
        national_percentile: response.national_percentile,
        comparable_areas: response.comparable_areas || [],
        growth_trajectory: response.growth_trajectory,
        business_suitability: response.business_suitability || [],
        notable_characteristics: response.notable_characteristics || [],
        additional_intelligence: {
          schools: response.schools || [],
          crime: response.crime || [],
          walkability: response.walkability || [],
          amenities: response.amenities || []
        }
      };

      setResults(resultData);

      await Address.create(resultData);

      setSearchHistory([resultData, ...searchHistory].slice(0, 10));
    } catch (err) {
      console.error('Search error:', err);

      if (err.response && err.response.status === 429) {
        setError('Rate limit reached. Please wait 30 seconds and try again.');

        setRateLimitCooldown(30);
        const countdown = setInterval(() => {
          setRateLimitCooldown(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else if (err.message && err.message.includes('429')) {
        setError('Too many requests. Please wait 30 seconds before searching again.');

        setRateLimitCooldown(30);
        const countdown = setInterval(() => {
          setRateLimitCooldown(prev => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError('Failed to analyze address. Please check the address and try again.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setAddress({ street: '', city: '', state: '', zip: '' });
    setResults(null);
    setError('');
    setRateLimitCooldown(0);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  return (
    <WorkspacePage
      title="Address Intelligence"
      description="Comprehensive demographic analysis and market research"
      maxWidth="max-w-[900px]"
    >
      <WorkspacePanel className="mb-8">
        <div className="space-y-4">
          <div className="relative" ref={suggestionsRef}>
            <Input
              placeholder="Enter street address"
              value={address.street}
              onChange={(e) => handleStreetChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyDown={(e) => e.key === 'Enter' && !showSuggestions && handleSearch()}
              onFocus={() => address.street.length >= 3 && suggestions.length > 0 && setShowSuggestions(true)}
              disabled={isSearching || rateLimitCooldown > 0}
            />

            {isLoadingSuggestions && (
              <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-go-border border-t-go-text" />
              </div>
            )}

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-2 w-full overflow-hidden rounded-[10px] border border-go-border bg-go-surface-elevated shadow-go-sm"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                        index === selectedSuggestionIndex
                          ? 'bg-go-surface-muted text-go-text'
                          : 'text-go-text-secondary hover:bg-go-surface-muted hover:text-go-text'
                      } ${index !== suggestions.length - 1 ? 'border-b border-go-border' : ''}`}
                    >
                      <div className="font-medium text-go-text">{suggestion.street}</div>
                      <div className="mt-0.5 text-xs text-go-text-muted">
                        {suggestion.city}, {suggestion.state} {suggestion.zip}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isSearching || rateLimitCooldown > 0}
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[5rem_1fr]">
              <Input
                placeholder="ST"
                value={address.state}
                onChange={(e) => setAddress({...address, state: e.target.value.toUpperCase()})}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching || rateLimitCooldown > 0}
                maxLength={2}
                className="uppercase"
              />
              <Input
                placeholder="ZIP"
                value={address.zip}
                onChange={(e) => setAddress({...address, zip: e.target.value.replace(/\D/g, '')})}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isSearching || rateLimitCooldown > 0}
                maxLength={5}
              />
            </div>
          </div>
        </div>

        {!address.street && !error && (
          <p className="mt-6 text-center text-[13px] text-go-text-muted">
            Enter an address to analyze demographics and market data
          </p>
        )}

        {error && (
          <div className={`mt-4 rounded-[10px] border p-3 ${
            error.includes('Rate limit') || error.includes('Too many')
              ? 'border-go-border bg-go-surface-muted'
              : 'border-go-danger/30 bg-go-danger-muted'
          }`}>
            <p className={`text-center text-[13px] ${
              error.includes('Rate limit') || error.includes('Too many')
                ? 'text-go-text-secondary'
                : 'text-go-danger'
            }`}>
              {error}
            </p>
            {rateLimitCooldown > 0 && (
              <div className="mt-2">
                <div className="mb-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-go-surface-muted">
                    <div
                      className="h-full bg-go-primary transition-all duration-1000"
                      style={{ width: `${(rateLimitCooldown / 30) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-go-primary">{rateLimitCooldown}s</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3">
          <LookupCostHint label="Address enrichment" costCents={15} className="mt-0" />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <PrimaryButton
              onClick={handleSearch}
              disabled={isSearching || rateLimitCooldown > 0 || !address.street || !address.city || !address.state}
              className="w-full gap-2 sm:w-auto"
            >
              {isSearching ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing...
                </>
              ) : rateLimitCooldown > 0 ? (
                `Wait ${rateLimitCooldown}s`
              ) : (
                'Analyze Address'
              )}
            </PrimaryButton>
            {(address.street || address.city || address.state) && !isSearching && (
              <GhostButton onClick={handleClear} className="w-full sm:w-auto">
                Clear
              </GhostButton>
            )}
          </div>
        </div>
      </WorkspacePanel>

      <AnimatePresence mode="wait">
        {results && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              <MinimalBadge variant={results.is_valid ? 'info' : 'neutral'} size="sm">
                {results.is_valid ? 'Verified' : 'Unverified'}
              </MinimalBadge>
              <span className="text-go-text-muted">•</span>
              <span className="text-[13px] text-go-text-secondary">
                {results.city}, {results.state} {results.zip_code !== "Not provided" && results.zip_code}
                {results.county && `, ${results.county} County`}
              </span>
              {results.area_type && (
                <>
                  <span className="text-go-text-muted">•</span>
                  <MinimalBadge variant="neutral" size="xs">
                    {results.area_type}
                  </MinimalBadge>
                </>
              )}
            </div>

            {!results.is_valid && results.validation_notes && (
              <WorkspacePanel title="Validation Alert" className="border-go-danger/30">
                <p className="text-center text-[13px] leading-relaxed text-go-danger">
                  {results.validation_notes}
                </p>
              </WorkspacePanel>
            )}

            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <SaveAddressButton addressData={results} />
              </div>
            </div>

            <LenderApprovalAlert addressData={results} />

            {results.neighborhood_score && (
              <WorkspacePanel>
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 h-40 w-40">
                    <svg className="h-full w-full -rotate-90 transform">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        className="text-go-border"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#addrScoreGradient)"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${(results.neighborhood_score / 100) * 439.82} 439.82`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="addrScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={results.neighborhood_score >= 60 ? '#4358a5' : '#6b7280'} />
                          <stop offset="100%" stopColor={results.neighborhood_score >= 60 ? '#5a6fb8' : '#4b5563'} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className={`text-5xl font-semibold ${getScoreGrade(results.neighborhood_score).color}`}>
                        {results.neighborhood_score}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wider text-go-text-muted">
                        / 100
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <MinimalBadge
                      variant={results.neighborhood_score >= 60 ? 'info' : 'neutral'}
                      size="md"
                    >
                      {getScoreGrade(results.neighborhood_score).label}
                    </MinimalBadge>
                  </div>

                  {results.national_percentile && (
                    <div className="text-[13px] text-go-primary">
                      {results.national_percentile}
                    </div>
                  )}
                </div>
              </WorkspacePanel>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <AddressMap
                latitude={results.latitude}
                longitude={results.longitude}
                address={`${results.street_address}, ${results.city}, ${results.state}`}
                neighborhoodScore={results.neighborhood_score}
              />

              <DemographicCharts data={results} />
            </div>

            {results.additional_intelligence && (
              <AdditionalIntelligence insights={results.additional_intelligence} />
            )}

            {(results.comparable_areas?.length > 0 || results.business_suitability?.length > 0 || results.notable_characteristics?.length > 0 || results.growth_trajectory) && (
              <WorkspacePanel title="Market Intelligence">
                <div className="space-y-6">
                  {results.growth_trajectory && (
                    <div className="text-center">
                      <div className="mb-2 flex items-center justify-center gap-2">
                        <MinimalBadge variant="info" size="xs">
                          Growth Trajectory
                        </MinimalBadge>
                      </div>
                      <p className="mx-auto max-w-2xl text-[13px] leading-relaxed text-go-text-secondary">
                        {results.growth_trajectory}
                      </p>
                    </div>
                  )}

                  {results.comparable_areas?.length > 0 && (
                    <div className="text-center">
                      <div className="mb-3 flex items-center justify-center gap-2">
                        <MinimalBadge variant="neutral" size="xs">
                          Comparable Areas
                        </MinimalBadge>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {results.comparable_areas.map((area, index) => (
                          <span key={index} className="rounded-[8px] border border-go-border bg-go-surface-muted px-2 py-1 text-xs text-go-text-secondary">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.business_suitability?.length > 0 && (
                    <div className="text-center">
                      <div className="mb-3 flex items-center justify-center gap-2">
                        <MinimalBadge variant="success" size="xs">
                          Ideal For
                        </MinimalBadge>
                      </div>
                      <div className="mx-auto max-w-2xl space-y-2">
                        {results.business_suitability.map((business, index) => (
                          <div key={index} className="rounded-[10px] border border-go-border bg-go-surface-muted p-3 text-[13px] text-go-text-secondary">
                            {business}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.notable_characteristics?.length > 0 && (
                    <div className="text-center">
                      <div className="mb-3 flex items-center justify-center gap-2">
                        <MinimalBadge variant="neutral" size="xs">
                          Key Characteristics
                        </MinimalBadge>
                      </div>
                      <div className="mx-auto max-w-2xl space-y-2">
                        {results.notable_characteristics.map((characteristic, index) => (
                          <div key={index} className="rounded-[10px] border border-go-border bg-go-surface-muted p-3 text-[13px] text-go-text-secondary">
                            {characteristic}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </WorkspacePanel>
            )}

            {results.median_household_income && (
              <WorkspacePanel title="Demographics">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mb-3 flex items-center justify-center gap-2">
                      <MinimalBadge
                        variant={results.median_household_income >= 90000 ? 'info' : 'neutral'}
                        size="sm"
                      >
                        {getIncomeBracket(results.median_household_income).label}
                      </MinimalBadge>
                    </div>
                    <div className={`mb-1 text-3xl font-semibold ${getIncomeBracket(results.median_household_income).color}`}>
                      ${results.median_household_income.toLocaleString()}
                    </div>
                    <div className="text-[12px] text-go-text-muted">Median household income</div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {results.median_home_value && (
                      <div className="rounded-[10px] border border-go-border bg-go-surface-muted p-4 text-center">
                        <div className="mb-1 text-lg font-semibold text-go-text">
                          ${(results.median_home_value / 1000).toFixed(0)}k
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-go-text-muted">
                          Home Value
                        </div>
                      </div>
                    )}

                    {results.population_density && (
                      <div className="rounded-[10px] border border-go-border bg-go-surface-muted p-4 text-center">
                        <div className="mb-1 text-lg font-semibold text-go-text">
                          {(results.population_density / 1000).toFixed(1)}k
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-go-text-muted">
                          per sq mi
                        </div>
                      </div>
                    )}

                    {results.poverty_rate !== null && results.poverty_rate !== undefined && (
                      <div className="rounded-[10px] border border-go-border bg-go-surface-muted p-4 text-center">
                        <div className="mb-1 text-lg font-semibold text-go-text">
                          {results.poverty_rate.toFixed(1)}%
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-go-text-muted">
                          Poverty
                        </div>
                      </div>
                    )}

                    {results.education_bachelor_plus !== null && results.education_bachelor_plus !== undefined && (
                      <div className="rounded-[10px] border border-go-border bg-go-surface-muted p-4 text-center">
                        <div className="mb-1 text-lg font-semibold text-go-text">
                          {results.education_bachelor_plus.toFixed(1)}%
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-go-text-muted">
                          Bachelor+
                        </div>
                      </div>
                    )}
                  </div>

                  {results.demographic_summary && (
                    <div className="rounded-[10px] border border-go-border bg-go-surface-muted p-4 text-center">
                      <p className="mx-auto max-w-2xl text-[13px] leading-relaxed text-go-text-secondary">
                        {results.demographic_summary}
                      </p>
                    </div>
                  )}
                </div>
              </WorkspacePanel>
            )}

            <p className="mx-auto max-w-2xl text-center text-[12px] text-go-text-muted">
              <span className="font-medium text-go-text-secondary">Data Sources:</span> Analysis derived from US Census Bureau data, public records, and AI-assisted intelligence. For critical decisions, verify with official sources.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </WorkspacePage>
  );
}