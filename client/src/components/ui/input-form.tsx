import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SortInput, sortInputSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RefreshCw } from "lucide-react";

interface InputFormProps {
  onSortResults: (data: any) => void;
}

export function InputForm({ onSortResults }: InputFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<SortInput>({
    resolver: zodResolver(sortInputSchema),
    defaultValues: {
      numbers: "",
      dataSize: "small",
      dataOrder: "random",
    },
  });

  const onSubmit = async (data: SortInput) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/sort", data);
      const results = await response.json();
      onSortResults(results);
    } catch (error) {
      console.error("Error sorting numbers:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sort numbers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomNumbers = async () => {
    try {
      setIsGenerating(true);
      const { dataSize, dataOrder } = form.getValues();
      
      const response = await apiRequest("POST", "/api/generate", {
        dataSize,
        dataOrder,
      });
      
      const result = await response.json();
      form.setValue("numbers", result.numbers);
    } catch (error) {
      console.error("Error generating numbers:", error);
      toast({
        title: "Error",
        description: "Failed to generate random numbers",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="numbers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter numbers (comma or space separated)</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="10, 5, 32, 1, 8, 17, 42, 23"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={generateRandomNumbers}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="sr-only">Generate random numbers</span>
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Enter a list of numbers you want to sort
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <FormField
              control={form.control}
              name="dataSize"
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/2">
                  <FormLabel>Custom data size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small (up to 20 elements)</SelectItem>
                      <SelectItem value="medium">Medium (up to 100 elements)</SelectItem>
                      <SelectItem value="large">Large (up to 1000 elements)</SelectItem>
                      <SelectItem value="xlarge">Extra Large (up to 10000 elements)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataOrder"
              render={({ field }) => (
                <FormItem className="w-full sm:w-1/2">
                  <FormLabel>Initial data order</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="nearly-sorted">Nearly Sorted</SelectItem>
                      <SelectItem value="reverse">Reverse Sorted</SelectItem>
                      <SelectItem value="sorted">Already Sorted</SelectItem>
                      <SelectItem value="few-unique">Few Unique Values</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Analyze Sorting Algorithms
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function ArrowUpDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}
