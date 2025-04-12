import { useState } from "react";
import { InputForm } from "@/components/ui/input-form";
import { ResultsPanel } from "@/components/ui/results-panel";
import { AlgorithmCards } from "@/components/ui/algorithm-cards";

export default function Home() {
  const [sortResults, setSortResults] = useState<any>(null);

  const handleSortResults = (data: any) => {
    setSortResults(data);
    
    // Scroll to results with a small delay to ensure component is rendered
    setTimeout(() => {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Sorting Algorithm Analyzer
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 sm:mt-4">
          Compare the performance of different sorting algorithms on your custom dataset.
        </p>
      </div>

      <InputForm onSortResults={handleSortResults} />

      {sortResults && (
        <div id="results">
          <ResultsPanel
            input={sortResults.input}
            results={sortResults.results}
          />
        </div>
      )}

      <AlgorithmCards />
    </div>
  );
}
