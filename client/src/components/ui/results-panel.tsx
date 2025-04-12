import { Link } from "wouter";
import { ArrowUpDown } from "lucide-react";
import { AlgorithmResult } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultsPanelProps {
  input: {
    numbers: number[];
    dataSize: string;
    dataOrder: string;
    length: number;
  };
  results: AlgorithmResult[];
}

export function ResultsPanel({ input, results }: ResultsPanelProps) {
  if (!results || results.length === 0) {
    return null;
  }

  // Format time to display with appropriate units
  const formatTime = (time: number) => {
    if (time < 1) {
      return `${(time * 1000).toFixed(4)} μs`;
    } else if (time < 1000) {
      return `${time.toFixed(4)} ms`;
    } else {
      return `${(time / 1000).toFixed(4)} s`;
    }
  };

  // Get appropriate description for the results
  const getPerformanceAnalysis = () => {
    const fastestAlgo = results[0].name;
    const slowestAlgo = results[results.length - 1].name;
    const isQuadraticFaster = results.find(r => r.timeComplexity === "O(n²)" && results.indexOf(r) < results.findIndex(r => r.timeComplexity === "O(n log n)"));
    
    const dataOrderDescription = (() => {
      switch(input.dataOrder) {
        case "random": return "random";
        case "nearly-sorted": return "nearly sorted";
        case "reverse": return "reverse sorted";
        case "sorted": return "already sorted";
        case "few-unique": return "few unique values";
        default: return input.dataOrder;
      }
    })();
    
    return (
      <ul className="list-disc pl-5 space-y-1">
        <li>{fastestAlgo} performed best for this dataset</li>
        {isQuadraticFaster ? 
          <li>Interestingly, an O(n²) algorithm ({isQuadraticFaster.name}) outperformed some O(n log n) algorithms, likely due to the {dataOrderDescription} data or small dataset size</li> : 
          <li>O(n log n) algorithms outperformed O(n²) algorithms as expected</li>
        }
        {input.dataOrder === "sorted" && 
          <li>With already sorted data, some algorithms like Bubble Sort can perform in O(n) time</li>
        }
        {input.dataOrder === "reverse" && 
          <li>Reverse sorted data is often a worst-case scenario for some algorithms</li>
        }
        <li>{slowestAlgo} was the slowest for this dataset</li>
      </ul>
    );
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sorting Results</CardTitle>
        <CardDescription>
          Comparison of sorting algorithm performance on your dataset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Input Data</h3>
          <div className="bg-gray-50 rounded-md p-3 mb-4 text-sm font-mono overflow-x-auto whitespace-nowrap">
            {input.numbers.join(", ")}
          </div>
          <div className="text-sm text-gray-500 mb-4">
            <span className="font-medium">Data size:</span> {input.length} elements |{" "}
            <span className="font-medium">Data order:</span> {input.dataOrder.replace(/-/g, " ")}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Algorithm</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Big O</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={result.algorithmId}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-800">
                        {index + 1}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{result.name}</TableCell>
                  <TableCell>{formatTime(result.executionTime)}</TableCell>
                  <TableCell>
                    <Badge variant={result.timeComplexity.includes("n²") ? "secondary" : "default"}>
                      {result.timeComplexity}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/algorithm/${result.algorithmId}`}
                      className="text-primary hover:text-primary-dark hover:underline"
                    >
                      Learn More
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analysis</h3>
          <div className="text-sm text-gray-600">
            <p className="mb-2">For your dataset size and initial order, the results show that:</p>
            {getPerformanceAnalysis()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
