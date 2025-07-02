
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DashboardNavigationProps {
  onGoHome: () => void;
  title: string;
}

const DashboardNavigation = ({ onGoHome, title }: DashboardNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        onClick={onGoHome}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'accueil
      </Button>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <div></div> {/* Spacer for centering */}
    </div>
  );
};

export default DashboardNavigation;
