import { algorithms, type Algorithm, type InsertAlgorithm, results, type Result, type InsertResult, users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Algorithm operations
  getAlgorithm(id: number): Promise<Algorithm | undefined>;
  getAlgorithmByName(name: string): Promise<Algorithm | undefined>;
  getAllAlgorithms(): Promise<Algorithm[]>;
  createAlgorithm(algorithm: InsertAlgorithm): Promise<Algorithm>;
  
  // Result operations
  saveResult(result: InsertResult): Promise<Result>;
  getResultById(id: number): Promise<Result | undefined>;
  getRecentResults(limit: number): Promise<Result[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async getAlgorithm(id: number): Promise<Algorithm | undefined> {
    const [algorithm] = await db.select().from(algorithms).where(eq(algorithms.id, id));
    return algorithm || undefined;
  }
  
  async getAlgorithmByName(name: string): Promise<Algorithm | undefined> {
    const [algorithm] = await db
      .select()
      .from(algorithms)
      .where(eq(algorithms.name, name));
    return algorithm || undefined;
  }
  
  async getAllAlgorithms(): Promise<Algorithm[]> {
    return await db.select().from(algorithms);
  }
  
  async createAlgorithm(insertAlgorithm: InsertAlgorithm): Promise<Algorithm> {
    const [algorithm] = await db
      .insert(algorithms)
      .values(insertAlgorithm)
      .returning();
    return algorithm;
  }
  
  async saveResult(insertResult: InsertResult): Promise<Result> {
    const [result] = await db
      .insert(results)
      .values(insertResult)
      .returning();
    return result;
  }
  
  async getResultById(id: number): Promise<Result | undefined> {
    const [result] = await db.select().from(results).where(eq(results.id, id));
    return result || undefined;
  }
  
  async getRecentResults(limit: number): Promise<Result[]> {
    return await db
      .select()
      .from(results)
      .orderBy(({ asc, desc }) => [desc(results.id)])
      .limit(limit);
  }
  
  async initializeAlgorithms(): Promise<void> {
    // Check if algorithms already exist
    const existingAlgorithms = await db.select().from(algorithms);
    if (existingAlgorithms.length > 0) {
      console.log("Algorithms already exist in database. Skipping initialization.");
      return;
    }
    
    const defaultAlgorithms: InsertAlgorithm[] = [
      {
        name: "Bubble Sort",
        description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order.",
        timeComplexityBest: "O(n)",
        timeComplexityAverage: "O(n²)",
        timeComplexityWorst: "O(n²)",
        spaceComplexity: "O(1)",
        code: `function bubbleSort(arr) {
  const len = arr.length;
  let swapped;
  
  for (let i = 0; i < len; i++) {
    swapped = false;
    
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`,
        useCases: "Educational purposes, small datasets, nearly sorted arrays",
        avoidCases: "Large datasets, performance-critical applications"
      },
      {
        name: "Quick Sort",
        description: "A divide-and-conquer algorithm that works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.",
        timeComplexityBest: "O(n log n)",
        timeComplexityAverage: "O(n log n)",
        timeComplexityWorst: "O(n²)",
        spaceComplexity: "O(log n)",
        code: `function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    
    // Sort the elements on the left of pivot
    quickSort(arr, left, pivotIndex - 1);
    
    // Sort the elements on the right of pivot
    quickSort(arr, pivotIndex + 1, right);
  }
  
  return arr;
}

function partition(arr, left, right) {
  // Choose the rightmost element as pivot
  const pivot = arr[right];
  let i = left - 1;
  
  // Move all elements smaller than pivot to the left
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place the pivot in its final position
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  
  return i + 1;
}`,
        useCases: "Large datasets, general-purpose sorting, when average-case performance matters",
        avoidCases: "Sorted or nearly sorted arrays, when stability is required"
      },
      {
        name: "Merge Sort",
        description: "A divide-and-conquer algorithm that divides the input array into two halves, recursively sorts them, and then merges the sorted halves.",
        timeComplexityBest: "O(n log n)",
        timeComplexityAverage: "O(n log n)",
        timeComplexityWorst: "O(n log n)",
        spaceComplexity: "O(n)",
        code: `function mergeSort(arr) {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr;
  
  // Split the array into two halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves and merge them
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements and merge them in sorted order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements
  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}`,
        useCases: "When stable sorting is needed, linked lists, external sorting",
        avoidCases: "Memory-constrained environments, small arrays"
      },
      {
        name: "Insertion Sort",
        description: "Builds the sorted array one item at a time by comparing each element with the previous elements and inserting it into its correct position.",
        timeComplexityBest: "O(n)",
        timeComplexityAverage: "O(n²)",
        timeComplexityWorst: "O(n²)",
        spaceComplexity: "O(1)",
        code: `function insertionSort(arr) {
  const len = arr.length;
  
  for (let i = 1; i < len; i++) {
    // Store the current element
    const current = arr[i];
    let j = i - 1;
    
    // Move elements greater than current to one position ahead
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    // Place current in its correct position
    arr[j + 1] = current;
  }
  
  return arr;
}`,
        useCases: "Small datasets, nearly sorted arrays, online algorithms (sorting as data arrives)",
        avoidCases: "Large unsorted datasets"
      },
      {
        name: "Selection Sort",
        description: "Repeatedly finds the minimum element from the unsorted part of the array and puts it at the beginning.",
        timeComplexityBest: "O(n²)",
        timeComplexityAverage: "O(n²)",
        timeComplexityWorst: "O(n²)",
        spaceComplexity: "O(1)",
        code: `function selectionSort(arr) {
  const len = arr.length;
  
  for (let i = 0; i < len - 1; i++) {
    // Find the minimum element in the unsorted part
    let minIndex = i;
    
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap minimum element with first element of unsorted part
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`,
        useCases: "Small datasets, when memory writes are expensive",
        avoidCases: "Large datasets, performance-critical applications"
      },
      {
        name: "Heap Sort",
        description: "Builds a max-heap from the data and repeatedly extracts the maximum element to sort the array.",
        timeComplexityBest: "O(n log n)",
        timeComplexityAverage: "O(n log n)",
        timeComplexityWorst: "O(n log n)",
        spaceComplexity: "O(1)",
        code: `function heapSort(arr) {
  const len = arr.length;
  
  // Build max heap
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, len, i);
  }
  
  // Extract elements from heap one by one
  for (let i = len - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  // Check if left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // Check if right child is larger than root or left child
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}`,
        useCases: "When guaranteed O(n log n) time is needed, priority queues",
        avoidCases: "When cache performance is critical, when stability is required"
      }
    ];
    
    console.log("Initializing algorithms in database...");
    for (const algorithm of defaultAlgorithms) {
      await db.insert(algorithms).values(algorithm);
    }
    console.log("Algorithm initialization complete!");
  }
}

// Create and initialize the database storage
export const storage = new DatabaseStorage();
