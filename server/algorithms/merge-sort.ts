export function mergeSort(arr: number[]): { time: number, sorted: number[] } {
  const startTime = performance.now();
  
  // Make a copy to avoid modifying the original array
  const result = [...arr];
  
  // Merge sort implementation
  function sort(arr: number[]): number[] {
    // Base case: arrays with 0 or 1 element are already sorted
    if (arr.length <= 1) return arr;
    
    // Split the array into two halves
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    
    // Recursively sort both halves and merge them
    return merge(sort(left), sort(right));
  }

  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
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
  }
  
  const sorted = sort(result);
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  return {
    time: executionTime,
    sorted: sorted
  };
}
