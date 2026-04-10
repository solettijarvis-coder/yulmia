"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WalkScoresProps {
  scores: {
    transit: number;
    schools: number;
    grocery: number;
    medical: number;
    shopping: number;
    overall: number;
  };
}

function getScoreColor(value: number): string {
  if (value >= 70) return "#22C55E";
  if (value >= 50) return "#C8A960";
  return "#EF4444";
}

function getWalkLabel(score: number): string {
  if (score >= 90) return "Walker's Paradise";
  if (score >= 70) return "Very Walkable";
  if (score >= 50) return "Somewhat Walkable";
  return "Car-Dependent";
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function WalkScores({ scores }: WalkScoresProps) {
  const overallColor = getScoreColor(scores.overall);
  const walkLabel = getWalkLabel(scores.overall);

  const bars = [
    { label: "Transit", value: scores.transit },
    { label: "Schools", value: scores.schools },
    { label: "Grocery", value: scores.grocery },
    { label: "Medical", value: scores.medical },
    { label: "Shopping", value: scores.shopping },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-serif">Walk Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Overall score circle */}
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center border-4 flex-shrink-0"
            style={{ borderColor: overallColor }}
          >
            <span className="text-2xl font-serif font-bold text-foreground">{scores.overall}</span>
          </div>
          <div>
            <p className="font-serif font-semibold text-foreground">{walkLabel}</p>
            <p className="text-xs text-muted-foreground">Overall walkability score</p>
          </div>
        </div>

        {/* Score bars */}
        <div className="space-y-3">
          {bars.map((bar) => (
            <ScoreBar key={bar.label} label={bar.label} value={bar.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
