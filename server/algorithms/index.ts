import { bubbleSort } from "./bubble-sort";
import { quickSort } from "./quick-sort";
import { mergeSort } from "./merge-sort";
import { insertionSort } from "./insertion-sort";
import { selectionSort } from "./selection-sort";
import { heapSort } from "./heap-sort";

export interface SortResult {
  time: number;
  sorted: number[];
}

export interface SortAlgorithm {
  id: number;
  name: string;
  sort: (arr: number[]) => SortResult;
  timeComplexity: string;
}

// Generate a random array based on size and order
export function generateArray(size: number, order: string): number[] {
  const arr: number[] = [];
  
  switch (order) {
    case "random":
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * size * 10));
      }
      break;
    case "nearly-sorted":
      for (let i = 0; i < size; i++) {
        arr.push(i);
      }
      // Swap a few elements to make it nearly sorted
      for (let i = 0; i < size * 0.1; i++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
      }
      break;
    case "reverse":
      for (let i = 0; i < size; i++) {
        arr.push(size - i);
      }
      break;
    case "sorted":
      for (let i = 0; i < size; i++) {
        arr.push(i);
      }
      break;
    case "few-unique":
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 10)); // Only 10 possible values
      }
      break;
    default:
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * size * 10));
      }
  }
  
  return arr;
}

// Determine array size based on the selected option
export function getSizeByOption(option: string): number {
  switch (option) {
    case "small": return Math.floor(Math.random() * 11) + 10; // 10-20 elements
    case "medium": return Math.floor(Math.random() * 51) + 50; // 50-100 elements
    case "large": return Math.floor(Math.random() * 501) + 500; // 500-1000 elements
    case "xlarge": return Math.floor(Math.random() * 5001) + 5000; // 5000-10000 elements
    default: return 20; // Default to small
  }
}

// Algorithm mapping
export const algorithms: SortAlgorithm[] = [
  {
    id: 1,
    name: "Bubble Sort",
    sort: bubbleSort,
    timeComplexity: "O(n²)"
  },
  {
    id: 2,
    name: "Quick Sort",
    sort: quickSort,
    timeComplexity: "O(n log n)"
  },
  {
    id: 3,
    name: "Merge Sort",
    sort: mergeSort,
    timeComplexity: "O(n log n)"
  },
  {
    id: 4,
    name: "Insertion Sort",
    sort: insertionSort,
    timeComplexity: "O(n²)"
  },
  {
    id: 5,
    name: "Selection Sort",
    sort: selectionSort,
    timeComplexity: "O(n²)"
  },
  {
    id: 6,
    name: "Heap Sort",
    sort: heapSort,
    timeComplexity: "O(n log n)"
  }
];
