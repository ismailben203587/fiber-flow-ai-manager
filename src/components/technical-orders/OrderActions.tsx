
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  isUpdating: boolean;
}

export const OrderActions = ({ orderId, onApprove, onReject, isUpdating }: OrderActionsProps) => {
  return (
    <div className="flex items-center gap-3 pt-4 border-t border-slate-600/50">
      <Button
        variant="outline"
        size="sm"
        className="border-blue-600/20 text-blue-200 hover:bg-blue-600/20"
      >
        <Eye className="h-4 w-4 mr-2" />
        Voir détails
      </Button>
      
      <Button
        onClick={() => onApprove(orderId)}
        disabled={isUpdating}
        size="sm"
        className="bg-green-600/20 hover:bg-green-600/30 text-green-200 border-green-600/20"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Approuver
      </Button>
      
      <Button
        onClick={() => onReject(orderId)}
        disabled={isUpdating}
        variant="destructive"
        size="sm"
        className="bg-red-600/20 hover:bg-red-600/30 text-red-200 border-red-600/20"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Rejeter
      </Button>
    </div>
  );
};
