import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Algorithm } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function AlgorithmCards() {
  const { data: algorithms, isLoading, error } = useQuery<Algorithm[]>({
    queryKey: ["/api/algorithms"],
  });

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Explore Sorting Algorithms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !algorithms) {
    return (
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Algorithms</h2>
        <p className="text-gray-600">Unable to load algorithm information. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="mt-10" id="algorithms">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Explore Sorting Algorithms
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {algorithms.map((algorithm) => (
          <Card key={algorithm.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary-50 border-b border-primary-100 pb-2">
              <CardTitle className="text-lg font-semibold text-primary-900">{algorithm.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-3">
                {algorithm.description.length > 100 
                  ? algorithm.description.substring(0, 100) + "..." 
                  : algorithm.description}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2">
              <Badge variant={algorithm.timeComplexityWorst.includes("n²") ? "secondary" : "default"}>
                {algorithm.timeComplexityAverage}
              </Badge>
              <Link href={`/algorithm/${algorithm.id}`} className="text-primary hover:text-primary-dark font-medium text-sm group flex items-center">
                Learn More 
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
