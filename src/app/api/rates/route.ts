import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24 hours caching

const baselineRates = {
  INR: { silver: 95, gold: 7600 },
  USD: { silver: 1.10, gold: 88 },
  AED: { silver: 4.05, gold: 325 },
  GBP: { silver: 0.85, gold: 69 },
  EUR: { silver: 1.00, gold: 81 }
};

export async function GET() {
  try {
    // In a real production app, we would fetch live spot prices here.
    // e.g. const res = await fetch('https://api.metals.live/v1/spot');
    // For now, we safely return the calibrated baseline matrix.
    
    return NextResponse.json({
      success: true,
      rates: baselineRates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Fallback safely on network failure
    return NextResponse.json({
      success: true,
      rates: baselineRates,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}
