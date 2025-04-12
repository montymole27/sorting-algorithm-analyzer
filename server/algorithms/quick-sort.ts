export function quickSort(arr: number[]): { time: number, sorted: number[] } {
  const startTime = performance.now();
  
  const result = [...arr];
  
  // Quick sort implementation
  function sort(arr: number[], left = 0, right = arr.length - 1) {
    if (left < right) {
      const pivotIndex = partition(arr, left, right);
      
      // Sort the elements on the left of pivot
      sort(arr, left, pivotIndex - 1);
      
      // Sort the elements on the right of pivot
      sort(arr, pivotIndex + 1, right);
    }
    
    return arr;
  }

  function partition(arr: number[], left: number, right: number) {
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
  }
  
  sort(result);
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  return {
    time: executionTime,
    sorted: result
  };
}
