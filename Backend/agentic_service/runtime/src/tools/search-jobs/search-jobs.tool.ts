import axios from "axios";

import { Tool } from "./search-jobs.interface";
import { SearchJobsInput } from "./search-jobs.input";
import { SearchJobsOutput } from "./search-jobs.output";

export class SearchJobsTool
  implements Tool<SearchJobsInput, SearchJobsOutput>
{
  name = "search_jobs";

  description =
    "Search jobs based on the user's query.";

  async execute(
    input: SearchJobsInput,
  ): Promise<SearchJobsOutput> {

    const { data } = await axios.post(
      "http://localhost:3002/job-listings/search",
      input,
    );
  
  // console.log(data[0]);

    return {
      jobs: data?.map((job: any) => ({
        title: job.title ?? '',
        company: job.company ?? '',
        location: job.location ?? '',
        type: job.type ?? '',
        salary: job.salary ?? '',
        applyUrl: job.applyUrl ?? job.url ?? job.Url ?? job.URL?? '',
        description: job.description ?? '',
      })),
    };

  }
}