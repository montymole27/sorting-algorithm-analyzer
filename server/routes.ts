import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { algorithms, generateArray, getSizeByOption } from "./algorithms";
import { sortInputSchema, type AlgorithmResult } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/algorithms", async (_req: Request, res: Response) => {
    try {
      const algorithmsList = await storage.getAllAlgorithms();
      res.json(algorithmsList);
    } catch (error) {
      console.error("Error fetching algorithms:", error);
      res.status(500).json({ message: "Failed to fetch algorithms" });
    }
  });
  
  app.get("/api/algorithms/:id", async (req: Request, res: Response) => {
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
  
  app.post("/api/sort", async (req: Request, res: Response) => {
    try {
      // Validate input
      const validationResult = sortInputSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { numbers, dataSize, dataOrder } = validationResult.data;
      
      // Parse numbers from input
      let inputArray: number[] = [];
      try {
        inputArray = numbers
          .split(/[,\s]+/)
          .map(n => n.trim())
          .filter(n => n !== "")
          .map(n => {
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
      
      // Get algorithms from storage
      const algorithmsList = await storage.getAllAlgorithms();
      
      // Run sorting algorithms and measure performance
      const results: AlgorithmResult[] = [];
      
      for (const algo of algorithms) {
        const { time, sorted } = algo.sort(inputArray);
        
        // Verify sort correctness
        const isSorted = sorted.every((val, i, arr) => i === 0 || val >= arr[i - 1]);
        if (!isSorted) {
          console.error(`Algorithm ${algo.name} did not correctly sort the array`);
        }
        
        // Find the corresponding algorithm in storage
        const algoInfo = algorithmsList.find(a => a.name === algo.name);
        
        results.push({
          algorithmId: algoInfo?.id || algo.id,
          name: algo.name,
          executionTime: time,
          timeComplexity: algo.timeComplexity,
        });
      }
      
      // Sort results by execution time (fastest first)
      results.sort((a, b) => a.executionTime - b.executionTime);
      
      // Save the result in storage
      const resultEntry = {
        input: numbers,
        results,
        timestamp: new Date().toISOString()
      };
      
      await storage.saveResult(resultEntry);
      
      res.json({
        input: {
          numbers: inputArray,
          dataSize,
          dataOrder,
          length: inputArray.length
        },
        results
      });
    } catch (error) {
      console.error("Error sorting numbers:", error);
      res.status(500).json({ message: "Failed to sort numbers" });
    }
  });
  
  app.post("/api/generate", async (req: Request, res: Response) => {
    try {
      const { dataSize = "small", dataOrder = "random" } = req.body;
      
      // Determine array size based on dataSize
      const size = getSizeByOption(dataSize);
      
      // Generate array with specified order
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

  const httpServer = createServer(app);
  return httpServer;
}
