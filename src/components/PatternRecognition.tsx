import React, { useMemo } from 'react';
import { detectAllPatterns, type CandleData, type PatternResult } from "../utils/patternDetection";

interface PatternRecognitionProps {
  priceData: CandleData[];
}

const PatternRecognition: React.FC<PatternRecognitionProps> = ({ priceData }) => {
  const patterns: PatternResult[] = useMemo(
    () => detectAllPatterns(priceData as CandleData[]),
    [priceData]
  );

  return (
    <div className="pattern-list">
      {patterns.length === 0 && (
        <div className="no-patterns">No patterns detected in this range.</div>
      )}

      {patterns.map((p, idx) => (
        <div key={idx} className="pattern-card">
          <div className="pattern-name">{p.name}</div>
          <div className="pattern-direction">{p.direction}</div>
          <div className="pattern-confidence">
            Confidence: {p.confidence.toFixed(1)}%
          </div>
          <div className="pattern-target">
            Target: {p.target.toFixed(2)} | Stop: {p.stopLoss.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatternRecognition;