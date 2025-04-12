import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AlgorithmDetail } from "@/components/ui/algorithm-detail";
import { Algorithm } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AlgorithmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  const algorithmId = parseInt(id);
  
  const { data: algorithm, isLoading: isLoadingAlgorithm, error: algorithmError } = useQuery<Algorithm>({
    queryKey: [`/api/algorithms/${algorithmId}`],
    enabled: !isNaN(algorithmId),
  });
  
  const { data: algorithms, isLoading: isLoadingAll } = useQuery<Algorithm[]>({
    queryKey: ["/api/algorithms"],
  });
  
  if (isNaN(algorithmId)) {
    navigate("/not-found");
    return null;
  }
  
  if (isLoadingAlgorithm || isLoadingAll) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    );
  }
  
  if (algorithmError || !algorithm || !algorithms) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {algorithmError instanceof Error 
              ? algorithmError.message 
              : "Failed to load algorithm details. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return <AlgorithmDetail algorithm={algorithm} algorithms={algorithms} />;
}
