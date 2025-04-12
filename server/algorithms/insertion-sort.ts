export function insertionSort(arr: number[]): { time: number, sorted: number[] } {
  const startTime = performance.now();
  
  const result = [...arr];
  const len = result.length;
  
  for (let i = 1; i < len; i++) {
    // Store the current element
    const current = result[i];
    let j = i - 1;
    
    // Move elements greater than current to one position ahead
    while (j >= 0 && result[j] > current) {
      result[j + 1] = result[j];
      j--;
    }
    
    // Place current in its correct position
    result[j + 1] = current;
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  return {
    time: executionTime,
    sorted: result
  };
}
