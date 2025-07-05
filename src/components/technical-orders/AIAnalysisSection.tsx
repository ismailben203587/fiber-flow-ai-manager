
import { AlertTriangle, CheckCircle } from "lucide-react";
import { AIAnalysis } from './types';

interface AIAnalysisSectionProps {
  aiAnalysis: AIAnalysis | null;
}

export const AIAnalysisSection = ({ aiAnalysis }: AIAnalysisSectionProps) => {
  if (!aiAnalysis) return null;

  return (
    <div className="mt-4 p-3 bg-slate-600/30 rounded border border-slate-500/30">
      <h4 className="font-medium text-blue-200 mb-2">Analyse IA</h4>
      
      {aiAnalysis.factors && aiAnalysis.factors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-yellow-200 mb-1">Facteurs identifiés:</p>
          <ul className="space-y-1">
            {aiAnalysis.factors.map((factor: string, index: number) => (
              <li key={index} className="text-xs text-yellow-300 flex items-start gap-1">
                <AlertTriangle className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
        <div>
          <p className="text-xs font-medium text-green-200 mb-1">Recommandations:</p>
          <ul className="space-y-1">
            {aiAnalysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-xs text-green-300 flex items-start gap-1">
                <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
