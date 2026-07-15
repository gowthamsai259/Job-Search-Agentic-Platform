export interface Job {

    title: string;
  
    company: string;
  
    location: string;
  
    description: string;
  
    url: string;
  
    source: string;
  
  }
  
  export interface SearchJobsOutput {
  
    jobs: Job[];
  
  }