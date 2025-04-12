import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Algorithm } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AlgorithmsPage() {
  const { data: algorithms, isLoading, error } = useQuery<Algorithm[]>({
    queryKey: ["/api/algorithms"],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-2 text-sm text-red-700">
            Failed to load algorithms. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Sorting Algorithms
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Explore different sorting algorithms and understand their complexity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {algorithms?.map((algorithm) => (
          <Link key={algorithm.id} href={`/algorithm/${algorithm.id}`}>
            <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{algorithm.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {algorithm.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Time Complexity</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Best: {algorithm.timeComplexityBest}</Badge>
                      <Badge variant="outline">Average: {algorithm.timeComplexityAverage}</Badge>
                      <Badge variant="outline">Worst: {algorithm.timeComplexityWorst}</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Space Complexity</h4>
                    <Badge variant="outline">{algorithm.spaceComplexity}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full text-sm text-muted-foreground">
                  <span>Best for: {algorithm.useCases.split(',')[0]}</span>
                  <span className="text-primary font-medium">View Details →</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}