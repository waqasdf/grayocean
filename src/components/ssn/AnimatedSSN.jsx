import React, { useState, useEffect } from 'react';

export default function AnimatedSSN({ ssn, className = "" }) {
  const [displaySSN, setDisplaySSN] = useState('000-00-0000');
  
  useEffect(() => {
    if (!ssn || ssn === '000-00-0000') {
      setDisplaySSN(ssn);
      return;
    }

    const parts = ssn.split('-');
    const area = parseInt(parts[0]);
    const group = parseInt(parts[1]);
    const serial = parseInt(parts[2]);
    
    let currentArea = 0;
    let currentGroup = 0;
    let currentSerial = 0;
    
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      
      currentArea = Math.floor(area * progress);
      currentGroup = Math.floor(group * progress);
      currentSerial = Math.floor(serial * progress);
      
      const formattedArea = String(currentArea).padStart(3, '0');
      const formattedGroup = String(currentGroup).padStart(2, '0');
      const formattedSerial = String(currentSerial).padStart(4, '0');
      
      setDisplaySSN(`${formattedArea}-${formattedGroup}-${formattedSerial}`);
      
      if (step >= steps) {
        clearInterval(interval);
        setDisplaySSN(ssn);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [ssn]);
  
  return <span className={className}>{displaySSN}</span>;
}

export function AnimatedNumber({ value, className = "", padLength = 0 }) {
  const [displayValue, setDisplayValue] = useState('0'.repeat(padLength || value.toString().length));
  
  useEffect(() => {
    if (!value) {
      setDisplayValue('0'.repeat(padLength));
      return;
    }

    const targetValue = parseInt(value);
    let currentValue = 0;
    
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      
      currentValue = Math.floor(targetValue * progress);
      
      const formatted = padLength 
        ? String(currentValue).padStart(padLength, '0')
        : String(currentValue);
      
      setDisplayValue(formatted);
      
      if (step >= steps) {
        clearInterval(interval);
        setDisplayValue(padLength 
          ? String(targetValue).padStart(padLength, '0')
          : String(targetValue));
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [value, padLength]);
  
  return <span className={className}>{displayValue}</span>;
}