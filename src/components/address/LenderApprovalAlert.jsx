import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MinimalBadge } from "../ui/minimal-badge";
import { motion } from 'framer-motion';

export default function LenderApprovalAlert({ addressData }) {
  if (!addressData) return null;

  const getLenderInsights = (data) => {
    const score = data.neighborhood_score || 0;
    
    if (score >= 90) {
      return {
        level: 'excellent',
        variant: 'purple',
        title: 'Excellent Lending Profile',
        message: 'This address demonstrates exceptional lending characteristics. Properties in this area typically receive favorable loan terms, lower interest rates, and streamlined approval processes. High-income demographics and strong home values indicate minimal default risk.',
        factors: [
          'Prime lending territory',
          'Favorable loan-to-value ratios expected',
          'Minimal documentation requirements likely',
          'Competitive interest rate qualification'
        ]
      };
    }
    
    if (score >= 80) {
      return {
        level: 'very-good',
        variant: 'blue',
        title: 'Strong Lending Potential',
        message: 'This address shows very favorable lending characteristics. Above-average income levels and home values suggest strong borrower qualification potential and reliable property valuations for collateral assessment.',
        factors: [
          'Above-average approval likelihood',
          'Favorable appraisal conditions',
          'Strong collateral positioning',
          'Competitive rate environment'
        ]
      };
    }
    
    if (score >= 70) {
      return {
        level: 'good',
        variant: 'cyan',
        title: 'Good Lending Conditions',
        message: 'This address is in a stable lending environment. Standard approval processes apply with good qualification potential for borrowers meeting typical credit and income requirements.',
        factors: [
          'Standard approval processes',
          'Reliable property valuations',
          'Stable market conditions',
          'Conventional loan programs accessible'
        ]
      };
    }
    
    if (score >= 60) {
      return {
        level: 'moderate',
        variant: 'info',
        title: 'Moderate Lending Environment',
        message: 'This address falls in a moderate lending category. Borrowers may need to demonstrate stronger financial profiles or provide additional documentation. Property valuations should be carefully verified.',
        factors: [
          'Enhanced documentation may be required',
          'Careful income verification recommended',
          'Property appraisal critical',
          'Consider government-backed programs'
        ]
      };
    }
    
    if (score >= 50) {
      return {
        level: 'fair',
        variant: 'neutral',
        title: 'Fair Lending Conditions',
        message: 'This address is in a fair lending environment. Lenders may apply more stringent criteria. Borrowers should expect thorough verification processes and potentially higher down payment requirements.',
        factors: [
          'Comprehensive documentation required',
          'Higher down payments may be expected',
          'Detailed income verification necessary',
          'FHA or VA programs may be advantageous'
        ]
      };
    }
    
    return {
      level: 'challenging',
      variant: 'neutral',
      title: 'Challenging Lending Environment',
      message: 'This address is in an area that may present lending challenges. Borrowers should prepare for rigorous underwriting, higher down payment requirements, and potentially limited conventional financing options. Alternative lending programs may be necessary.',
      factors: [
        'Extensive documentation required',
        'Significant down payment likely needed',
        'Limited conventional loan options',
        'Consider alternative lending programs',
        'Manual underwriting may be required'
      ]
    };
  };

  const insights = getLenderInsights(addressData);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3 className="text-[14px] font-medium text-go-text">{insights.title}</h3>
            <MinimalBadge variant={insights.variant} size="xs">
              Lending assessment
            </MinimalBadge>
          </div>

          <p className="mb-4 text-[13px] leading-relaxed text-go-text-secondary">
            {insights.message}
          </p>

          <div className="space-y-2">
            <div className="text-[12px] font-medium text-go-text-muted">Key factors</div>
            {insights.factors.map((factor, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-go-primary" />
                <span className="text-[13px] leading-relaxed text-go-text-secondary">
                  {factor}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-go-border pt-4">
            <p className="text-[12px] text-go-text-muted">
              <span className="font-medium text-go-text-secondary">Disclaimer:</span> This
              assessment is based on demographic and economic data analysis. Actual lending
              decisions depend on individual borrower qualifications, credit history,
              debt-to-income ratios, and lender-specific criteria. Consult with licensed
              mortgage professionals for definitive lending guidance.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}