export function shellSort(arr: number[]): { time: number, sorted: number[] } {
  // Create a copy to avoid modifying the input array
  const sorted = [...arr];
  
  const startTime = performance.now();
  
  const n = sorted.length;
  
  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      // add a[i] to the elements that have been gap sorted
      const temp = sorted[i];
      
      // shift earlier gap-sorted elements up until the correct location for a[i] is found
      let j;
      for (j = i; j >= gap && sorted[j - gap] > temp; j -= gap) {
        sorted[j] = sorted[j - gap];
      }
      
      // put temp (the original a[i]) in its correct location
      sorted[j] = temp;
    }
  }
  
  const endTime = performance.now();
  
  return {
    time: endTime - startTime,
    sorted: sorted
  };
}