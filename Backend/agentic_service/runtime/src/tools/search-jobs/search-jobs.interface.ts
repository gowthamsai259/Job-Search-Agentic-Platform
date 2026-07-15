export interface Tool<TInput, TOutput> {
    name: string;
    description: string;
  
    execute(input: TInput): Promise<TOutput>;
}