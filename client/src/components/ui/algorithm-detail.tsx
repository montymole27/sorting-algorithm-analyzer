import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Copy, Download, Info } from "lucide-react";
import { Algorithm } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CodeImage } from "@/components/ui/code-image";

interface AlgorithmDetailProps {
  algorithm: Algorithm;
  algorithms: Algorithm[];
}

export function AlgorithmDetail({ algorithm, algorithms }: AlgorithmDetailProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [codeImage, setCodeImage] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);

  // Find the previous and next algorithm for navigation
  const currentIndex = algorithms.findIndex(a => a.id === algorithm.id);
  const prevAlgorithm = currentIndex > 0 ? algorithms[currentIndex - 1] : null;
  const nextAlgorithm = currentIndex < algorithms.length - 1 ? algorithms[currentIndex + 1] : null;

  const copyCode = () => {
    navigator.clipboard.writeText(algorithm.code);
    setCopied(true);
    toast({
      title: "Code copied to clipboard",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCodeImageGenerated = (imageUrl: string) => {
    setCodeImage(imageUrl);
  };
  
  const downloadCodeImage = () => {
    if (!codeImage) return;
    
    const link = document.createElement('a');
    link.href = codeImage;
    link.download = `${algorithm.name.toLowerCase().replace(/\s+/g, '-')}-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Code image downloaded",
      duration: 2000,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <Link href="/algorithms" className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Algorithms
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{algorithm.name}</h1>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          {prevAlgorithm && (
            <Button variant="outline" asChild>
              <Link href={`/algorithm/${prevAlgorithm.id}`}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Previous
              </Link>
            </Button>
          )}
          {nextAlgorithm && (
            <Button variant="outline" asChild>
              <Link href={`/algorithm/${nextAlgorithm.id}`}>
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-200 bg-muted/30">
          <div className="flex flex-wrap items-center justify-between">
            <CardTitle>Algorithm Details</CardTitle>
            <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
              <Badge>
                {algorithm.timeComplexityBest} best case
              </Badge>
              <Badge>
                {algorithm.timeComplexityAverage} average case
              </Badge>
              <Badge variant="secondary">
                {algorithm.timeComplexityWorst} worst case
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  How It Works
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {algorithm.description}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Performance Characteristics
                </h4>
                <div className="overflow-hidden bg-white border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Case
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Complexity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Space Complexity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Best Case
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {algorithm.timeComplexityBest}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {algorithm.spaceComplexity}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Average Case
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {algorithm.timeComplexityAverage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {algorithm.spaceComplexity}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Worst Case
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {algorithm.timeComplexityWorst}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {algorithm.spaceComplexity}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  When to Use {algorithm.name}
                </h4>
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-blue-800">Usage Guidelines</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2">
                      <p className="font-medium">This algorithm is ideal when:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {algorithm.useCases.split(",").map((useCase, index) => (
                          <li key={index}>{useCase.trim()}</li>
                        ))}
                      </ul>
                      
                      <p className="mt-2 font-medium">Avoid using this algorithm when:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {algorithm.avoidCases.split(",").map((avoidCase, index) => (
                          <li key={index}>{avoidCase.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Implementation
              </h4>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium text-gray-700">
                    JavaScript Implementation
                  </h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowImage(!showImage)}
                    >
                      {showImage ? "Show Code" : "Show as Image"}
                    </Button>
                    {codeImage && showImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadCodeImage}
                      >
                        <Download className="h-4 w-4 mr-1" /> Download
                      </Button>
                    )}
                  </div>
                </div>
                
                {showImage ? (
                  <div className="bg-gray-800 rounded-md overflow-hidden shadow-sm">
                    {codeImage ? (
                      <div className="overflow-auto" style={{ maxHeight: "500px" }}>
                        <img 
                          src={codeImage} 
                          alt={`${algorithm.name} implementation code`} 
                          className="w-full"
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-400">
                        Generating code image...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-md overflow-hidden shadow-sm">
                    <div className="px-4 py-2 bg-gray-900 text-gray-200 text-sm flex justify-between items-center">
                      <span>JavaScript Implementation</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-white"
                        onClick={copyCode}
                      >
                        {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="p-4 text-sm text-gray-300 overflow-x-auto" style={{ maxHeight: "400px" }}>
                      <code>{algorithm.code}</code>
                    </pre>
                  </div>
                )}
                
                {/* Hidden component to generate the code image */}
                <CodeImage 
                  code={algorithm.code} 
                  language="JavaScript" 
                  onImageGenerated={handleCodeImageGenerated} 
                />
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Additional Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href={`https://en.wikipedia.org/wiki/${algorithm.name.replace(/\s+/g, '_')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      Wikipedia: {algorithm.name} <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://visualgo.net/en/sorting" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      Visualgo: Sorting Visualizations <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
