var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  algorithmResultSchema: () => algorithmResultSchema,
  algorithms: () => algorithms,
  insertAlgorithmSchema: () => insertAlgorithmSchema,
  insertResultSchema: () => insertResultSchema,
  insertUserSchema: () => insertUserSchema,
  results: () => results,
  sortInputSchema: () => sortInputSchema,
  users: () => users
});
import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var algorithms = pgTable("algorithms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  timeComplexityBest: text("time_complexity_best").notNull(),
  timeComplexityAverage: text("time_complexity_average").notNull(),
  timeComplexityWorst: text("time_complexity_worst").notNull(),
  spaceComplexity: text("space_complexity").notNull(),
  code: text("code").notNull(),
  useCases: text("use_cases").notNull(),
  avoidCases: text("avoid_cases").notNull()
});
var insertAlgorithmSchema = createInsertSchema(algorithms).omit({
  id: true
});
var results = pgTable("results", {
  id: serial("id").primaryKey(),
  input: text("input").notNull(),
  results: jsonb("results").notNull(),
  timestamp: text("timestamp").notNull()
});
var insertResultSchema = createInsertSchema(results).omit({
  id: true
});
var sortInputSchema = z.object({
  numbers: z.string().min(1, "Please enter at least one number"),
  dataSize: z.enum(["small", "medium", "large", "xlarge"]),
  dataOrder: z.enum(["random", "nearly-sorted", "reverse", "sorted", "few-unique"])
});
var algorithmResultSchema = z.object({
  algorithmId: z.number(),
  name: z.string(),
  executionTime: z.number(),
  timeComplexity: z.string()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getAlgorithm(id) {
    const [algorithm] = await db.select().from(algorithms).where(eq(algorithms.id, id));
    return algorithm || void 0;
  }
  async getAlgorithmByName(name) {
    const [algorithm] = await db.select().from(algorithms).where(eq(algorithms.name, name));
    return algorithm || void 0;
  }
  async getAllAlgorithms() {
    return await db.select().from(algorithms);
  }
  async createAlgorithm(insertAlgorithm) {
    const [algorithm] = await db.insert(algorithms).values(insertAlgorithm).returning();
    return algorithm;
  }
  async saveResult(insertResult) {
    const [result] = await db.insert(results).values(insertResult).returning();
    return result;
  }
  async getResultById(id) {
    const [result] = await db.select().from(results).where(eq(results.id, id));
    return result || void 0;
  }
  async getRecentResults(limit) {
    return await db.select().from(results).orderBy(results.id).limit(limit);
  }
  async initializeAlgorithms() {
    let existingAlgorithms = await db.select().from(algorithms);
    const algorithmCount = existingAlgorithms.length;
    if (algorithmCount === 6) {
      console.log("Adding new Shell Sort algorithm to the database...");
      await db.insert(algorithms).values({
        name: "Shell Sort",
        description: "An extension of insertion sort that allows the comparison and exchange of elements that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reduces the gap between elements to be compared.",
        timeComplexityBest: "O(n log n)",
        timeComplexityAverage: "O(n log\xB2 n)",
        timeComplexityWorst: "O(n\xB2)",
        spaceComplexity: "O(1)",
        code: `function shellSort(arr) {
  const n = arr.length;
  
  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    
    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      // add a[i] to the elements that have been gap sorted
      const temp = arr[i];
      
      // shift earlier gap-sorted elements up until the correct location for a[i] is found
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      
      // put temp (the original a[i]) in its correct location
      arr[j] = temp;
    }
  }
  
  return arr;
}`,
        useCases: "Medium-sized arrays, when code simplicity is less important than performance",
        avoidCases: "When algorithm stability is required, when optimal performance isn't critical"
      });
      console.log("Successfully added Shell Sort algorithm.");
      existingAlgorithms = await db.select().from(algorithms);
      if (existingAlgorithms.length === 7) {
        console.log("Adding new Counting Sort algorithm to the database...");
        await db.insert(algorithms).values({
          name: "Counting Sort",
          description: "A non-comparative sorting algorithm that works by counting the number of objects having distinct key values, and applying prefix sum on those counts to determine the positions of each key value in the output sequence.",
          timeComplexityBest: "O(n+k)",
          timeComplexityAverage: "O(n+k)",
          timeComplexityWorst: "O(n+k)",
          spaceComplexity: "O(n+k)",
          code: `function countingSort(arr) {
  // Find the maximum value in the array
  const max = Math.max(...arr);
  
  // Create a counting array of size max+1, initialized with zeros
  const count = new Array(max + 1).fill(0);
  
  // Count the occurrences of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  
  // Modify count array to store the position of each element
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  // Create output array and place elements in correct positions
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  
  return output;
}`,
          useCases: "Integer sorting, when values have a small range, radix sort subroutine",
          avoidCases: "When memory is limited, when data has a large range of values, or with floating-point numbers"
        });
        console.log("Successfully added Counting Sort algorithm.");
      }
      return;
    } else if (algorithmCount === 7) {
      console.log("Adding Counting Sort algorithm to the database...");
      await db.insert(algorithms).values({
        name: "Counting Sort",
        description: "A non-comparative sorting algorithm that works by counting the number of objects having distinct key values, and applying prefix sum on those counts to determine the positions of each key value in the output sequence.",
        timeComplexityBest: "O(n+k)",
        timeComplexityAverage: "O(n+k)",
        timeComplexityWorst: "O(n+k)",
        spaceComplexity: "O(n+k)",
        code: `function countingSort(arr) {
  // Find the maximum value in the array
  const max = Math.max(...arr);
  
  // Create a counting array of size max+1, initialized with zeros
  const count = new Array(max + 1).fill(0);
  
  // Count the occurrences of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]]++;
  }
  
  // Modify count array to store the position of each element
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  // Create output array and place elements in correct positions
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  
  return output;
}`,
        useCases: "Integer sorting, when values have a small range, radix sort subroutine",
        avoidCases: "When memory is limited, when data has a large range of values, or with floating-point numbers"
      });
      console.log("Successfully added Counting Sort algorithm.");
      return;
    } else if (algorithmCount === 8) {
      console.log("All algorithms already exist in database. Skipping initialization.");
      return;
    } else if (algorithmCount > 0) {
      console.log("Some algorithms exist in database. Skipping initialization.");
      return;
    }
    const defaultAlgorithms = [
      {
        name: "Bubble Sort",
        description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in wrong order.",
        timeComplexityBest: "O(n)",
        timeComplexityAverage: "O(n\xB2)",
        timeComplexityWorst: "O(n\xB2)",
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
        timeComplexityWorst: "O(n\xB2)",
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
        timeComplexityAverage: "O(n\xB2)",
        timeComplexityWorst: "O(n\xB2)",
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
        timeComplexityBest: "O(n\xB2)",
        timeComplexityAverage: "O(n\xB2)",
        timeComplexityWorst: "O(n\xB2)",
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
      },
      {
        name: "Shell Sort",
        description: "An extension of insertion sort that allows the comparison and exchange of elements that are far apart. It starts by sorting pairs of elements far apart from each other, then progressively reduces the gap between elements to be compared.",
        timeComplexityBest: "O(n log n)",
        timeComplexityAverage: "O(n log\xB2 n)",
        timeComplexityWorst: "O(n\xB2)",
        spaceComplexity: "O(1)",
        code: `function shellSort(arr) {
  const n = arr.length;
  
  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    
    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      // add a[i] to the elements that have been gap sorted
      const temp = arr[i];
      
      // shift earlier gap-sorted elements up until the correct location for a[i] is found
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      
      // put temp (the original a[i]) in its correct location
      arr[j] = temp;
    }
  }
  
  return arr;
}`,
        useCases: "Medium-sized arrays, when code simplicity is less important than performance",
        avoidCases: "When algorithm stability is required, when optimal performance isn't critical"
      }
    ];
    console.log("Initializing algorithms in database...");
    for (const algorithm of defaultAlgorithms) {
      await db.insert(algorithms).values(algorithm);
    }
    console.log("Algorithm initialization complete!");
  }
};
var storage = new DatabaseStorage();

// server/algorithms/bubble-sort.ts
function bubbleSort(arr) {
  const startTime = performance.now();
  const result = [...arr];
  const len = result.length;
  let swapped;
  for (let i = 0; i < len; i++) {
    swapped = false;
    for (let j = 0; j < len - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  return {
    time: executionTime,
    sorted: result
  };
}

// server/algorithms/quick-sort.ts
function quickSort(arr) {
  const startTime = performance.now();
  const result = [...arr];
  function sort(arr2, left = 0, right = arr2.length - 1) {
    if (left < right) {
      const pivotIndex = partition(arr2, left, right);
      sort(arr2, left, pivotIndex - 1);
      sort(arr2, pivotIndex + 1, right);
    }
    return arr2;
  }
  function partition(arr2, left, right) {
    const pivot = arr2[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
      if (arr2[j] <= pivot) {
        i++;
        [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
      }
    }
    [arr2[i + 1], arr2[right]] = [arr2[right], arr2[i + 1]];
    return i + 1;
  }
  sort(result);
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  return {
    time: executionTime,
    sorted: result
  };
}

// server/algorithms/merge-sort.ts
function mergeSort(arr) {
  const startTime = performance.now();
  const result = [...arr];
  function sort(arr2) {
    if (arr2.length <= 1) return arr2;
    const mid = Math.floor(arr2.length / 2);
    const left = arr2.slice(0, mid);
    const right = arr2.slice(mid);
    return merge(sort(left), sort(right));
  }
  function merge(left, right) {
    const result2 = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result2.push(left[leftIndex]);
        leftIndex++;
      } else {
        result2.push(right[rightIndex]);
        rightIndex++;
      }
    }
    return result2.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }
  const sorted = sort(result);
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  return {
    time: executionTime,
    sorted
  };
}

// server/algorithms/insertion-sort.ts
function insertionSort(arr) {
  const startTime = performance.now();
  const result = [...arr];
  const len = result.length;
  for (let i = 1; i < len; i++) {
    const current = result[i];
    let j = i - 1;
    while (j >= 0 && result[j] > current) {
      result[j + 1] = result[j];
      j--;
    }
    result[j + 1] = current;
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  return {
    time: executionTime,
    sorted: result
  };
}

// server/algorithms/selection-sort.ts
function selectionSort(arr) {
  const startTime = performance.now();
  const result = [...arr];
  const len = result.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [result[i], result[minIndex]] = [result[minIndex], result[i]];
    }
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  return {
    time: executionTime,
    sorted: result
  };
}

// server/algorithms/heap-sort.ts
function heapSort(arr) {
  const startTime = performance.now();
  const result = [...arr];
  const len = result.length;
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(result, len, i);
  }
  for (let i = len - 1; i > 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  return {
    time: executionTime,
    sorted: result
  };
}
function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// server/algorithms/shell-sort.ts
function shellSort(arr) {
  const sorted = [...arr];
  const startTime = performance.now();
  const n = sorted.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = sorted[i];
      let j;
      for (j = i; j >= gap && sorted[j - gap] > temp; j -= gap) {
        sorted[j] = sorted[j - gap];
      }
      sorted[j] = temp;
    }
  }
  const endTime = performance.now();
  return {
    time: endTime - startTime,
    sorted
  };
}

// server/algorithms/counting-sort.ts
function countingSort(arr) {
  const input = [...arr];
  const startTime = performance.now();
  const max = Math.max(...input);
  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < input.length; i++) {
    count[input[i]]++;
  }
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  const output = new Array(input.length);
  for (let i = input.length - 1; i >= 0; i--) {
    output[count[input[i]] - 1] = input[i];
    count[input[i]]--;
  }
  const endTime = performance.now();
  return {
    time: endTime - startTime,
    sorted: output
  };
}

// server/algorithms/index.ts
function generateArray(size, order) {
  const arr = [];
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
        arr.push(Math.floor(Math.random() * 10));
      }
      break;
    default:
      for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * size * 10));
      }
  }
  return arr;
}
function getSizeByOption(option) {
  switch (option) {
    case "small":
      return Math.floor(Math.random() * 11) + 10;
    // 10-20 elements
    case "medium":
      return Math.floor(Math.random() * 51) + 50;
    // 50-100 elements
    case "large":
      return Math.floor(Math.random() * 501) + 500;
    // 500-1000 elements
    case "xlarge":
      return Math.floor(Math.random() * 5001) + 5e3;
    // 5000-10000 elements
    default:
      return 20;
  }
}
var algorithms2 = [
  {
    id: 1,
    name: "Bubble Sort",
    sort: bubbleSort,
    timeComplexity: "O(n\xB2)"
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
    timeComplexity: "O(n\xB2)"
  },
  {
    id: 5,
    name: "Selection Sort",
    sort: selectionSort,
    timeComplexity: "O(n\xB2)"
  },
  {
    id: 6,
    name: "Heap Sort",
    sort: heapSort,
    timeComplexity: "O(n log n)"
  },
  {
    id: 7,
    name: "Shell Sort",
    sort: shellSort,
    timeComplexity: "O(n log\xB2 n)"
  },
  {
    id: 8,
    name: "Counting Sort",
    sort: countingSort,
    timeComplexity: "O(n+k)"
  }
];

// server/routes.ts
import { fromZodError } from "zod-validation-error";
async function registerRoutes(app2) {
  app2.get("/api/algorithms", async (_req, res) => {
    try {
      const algorithmsList = await storage.getAllAlgorithms();
      res.json(algorithmsList);
    } catch (error) {
      console.error("Error fetching algorithms:", error);
      res.status(500).json({ message: "Failed to fetch algorithms" });
    }
  });
  app2.get("/api/algorithms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid algorithm ID" });
      }
      const algorithm = await storage.getAlgorithm(id);
      if (!algorithm) {
        return res.status(404).json({ message: "Algorithm not found" });
      }
      res.json(algorithm);
    } catch (error) {
      console.error("Error fetching algorithm:", error);
      res.status(500).json({ message: "Failed to fetch algorithm" });
    }
  });
  app2.post("/api/sort", async (req, res) => {
    try {
      const validationResult = sortInputSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      const { numbers, dataSize, dataOrder } = validationResult.data;
      let inputArray = [];
      try {
        inputArray = numbers.split(/[,\s]+/).map((n) => n.trim()).filter((n) => n !== "").map((n) => {
          const parsed = parseFloat(n);
          if (isNaN(parsed)) {
            throw new Error(`Invalid number: ${n}`);
          }
          return parsed;
        });
      } catch (error) {
        return res.status(400).json({
          message: error instanceof Error ? error.message : "Invalid input format"
        });
      }
      if (inputArray.length === 0) {
        return res.status(400).json({ message: "No valid numbers provided" });
      }
      const algorithmsList = await storage.getAllAlgorithms();
      const results2 = [];
      for (const algo of algorithms2) {
        const { time, sorted } = algo.sort(inputArray);
        const isSorted = sorted.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
        if (!isSorted) {
          console.error(`Algorithm ${algo.name} did not correctly sort the array`);
        }
        const algoInfo = algorithmsList.find((a) => a.name === algo.name);
        results2.push({
          algorithmId: algoInfo?.id || algo.id,
          name: algo.name,
          executionTime: time,
          timeComplexity: algo.timeComplexity
        });
      }
      results2.sort((a, b) => a.executionTime - b.executionTime);
      const resultEntry = {
        input: numbers,
        results: results2,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      await storage.saveResult(resultEntry);
      res.json({
        input: {
          numbers: inputArray,
          dataSize,
          dataOrder,
          length: inputArray.length
        },
        results: results2
      });
    } catch (error) {
      console.error("Error sorting numbers:", error);
      res.status(500).json({ message: "Failed to sort numbers" });
    }
  });
  app2.post("/api/generate", async (req, res) => {
    try {
      const { dataSize = "small", dataOrder = "random" } = req.body;
      const size = getSizeByOption(dataSize);
      const generatedArray = generateArray(size, dataOrder);
      res.json({
        numbers: generatedArray.join(", "),
        size,
        dataOrder
      });
    } catch (error) {
      console.error("Error generating random numbers:", error);
      res.status(500).json({ message: "Failed to generate random numbers" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  base: "/sorting-algorithm-analyzer/"
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await storage.initializeAlgorithms();
    log("Database initialized successfully");
  } catch (error) {
    log(`Error initializing database: ${error instanceof Error ? error.message : String(error)}`);
  }
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
