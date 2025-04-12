export function bubbleSort(arr: number[]): { time: number, sorted: number[] } {
  const startTime = performance.now();
  
  const result = [...arr];
  const len = result.length;
  let swapped;
  
  for (let i = 0; i < len; i++) {
    swapped = false;
    
    for (let j = 0; j < len - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        // Swap elements
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) break;
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  return {
    time: executionTime,
    sorted: result
  };
}
