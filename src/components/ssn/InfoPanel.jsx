import React from 'react';

export default function InfoPanel() {
  const infoItems = [
    {
      title: "SSN Structure: Area-Group-Serial",
      description: "Every SSN has 9 digits divided into 3 parts: Area (XXX), Group (XX), and Serial (XXXX). The Area originally indicated the state, the Group represented a batch, and the Serial was a unique number within that batch."
    },
    {
      title: "How Area Numbers Work",
      description: "Before 2011, the first 3 digits (area number) indicated the state where the SSN was issued. For example, 001-003 were issued in New Hampshire, while 545-573 were issued in California. Since 2011, area numbers are randomly assigned for security."
    },
    {
      title: "Group Number Purpose",
      description: "The middle 2 digits (group number) break down each area into smaller batches. The SSA issued numbers in a specific order within each area, using groups to manage the allocation process systematically."
    },
    {
      title: "Serial Number Sequence",
      description: "The last 4 digits (serial number) run from 0001 to 9999 within each group. This creates up to 10,000 unique SSNs per group. Serial 0000 is never issued."
    },
    {
      title: "Modern Randomization",
      description: "Since June 25, 2011, the SSA randomizes all SSN assignments to extend the longevity of the 9-digit system and enhance security. Numbers issued after 2011 don't reveal geographic information."
    },
    {
      title: "Privacy & Security",
      description: "This tool is for educational purposes only. All analysis is performed with encryption. Never share your actual SSN online or use real SSNs for testing purposes."
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {infoItems.map((item, index) => (
        <div 
          key={item.title} 
          className="relative group space-y-2 pb-6 border-b border-white/5 last:border-0 last:pb-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 rounded-lg transition-all duration-500 -m-3 p-3" />
          <div className="relative">
            <h3 className="text-xs font-medium text-white mb-1">
              {item.title}
            </h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}