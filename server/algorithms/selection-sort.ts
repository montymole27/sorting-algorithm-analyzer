export function selectionSort(arr: number[]): { time: number, sorted: number[] } {
  const startTime = performance.now();
  
  const result = [...arr];
  const len = result.length;
  
  for (let i = 0; i < len - 1; i++) {
    // Find the minimum element in the unsorted part
    let minIndex = i;
    
    for (let j = i + 1; j < len; j++) {
      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap minimum element with first element of unsorted part
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
