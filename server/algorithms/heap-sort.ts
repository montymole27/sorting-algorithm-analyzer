export function heapSort(arr: number[]): { time: number, sorted: number[] } {
  const startTime = performance.now();
  
  const result = [...arr];
  const len = result.length;
  
  // Build max heap
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(result, len, i);
  }
  
  // Extract elements from heap one by one
  for (let i = len - 1; i > 0; i--) {
    // Move current root to end
    [result[0], result[i]] = [result[i], result[0]];
    
    // Call heapify on the reduced heap
    heapify(result, i, 0);
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  return {
    time: executionTime,
    sorted: result
  };
}

function heapify(arr: number[], n: number, i: number) {
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
}
