export function countingSort(arr: number[]): { time: number, sorted: number[] } {
  // Create a copy to avoid modifying the input array
  const input = [...arr];
  
  const startTime = performance.now();
  
  // Find the maximum value in the array to determine counting array size
  const max = Math.max(...input);
  
  // Create a counting array of size max+1, initialized with zeros
  const count = new Array(max + 1).fill(0);
  
  // Count the occurrences of each element
  for (let i = 0; i < input.length; i++) {
    count[input[i]]++;
  }
  
  // Modify count array to store the position of each element
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  // Create output array and place elements in correct positions
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