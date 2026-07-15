import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { SearchJobsDto } from "./dto"

export interface JobListing {
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    source: string;
}

@Injectable()
export class JobListingsService {

  async searchJobs(query:  SearchJobsDto) {

    const [
      arbeitnow,
      himalayas,
      jobicy,
      remoteok,
      remotive
    ] = await Promise.allSettled([

      axios.get("https://www.arbeitnow.com/api/job-board-api"),

      axios.get("https://himalayas.app/jobs/api/search", {
        params: { q: query }
      }),

      axios.get("https://jobicy.com/api/v2/remote-jobs"),

      axios.get("https://remoteok.com/api"),

      axios.get("https://remotive.com/api/remote-jobs", {
        params: { search: query }
      }),

    ]);

    const jobs = [

      ...this.parseArbeitNow(arbeitnow),

      ...this.parseHimalayas(himalayas),

      ...this.parseJobicy(jobicy),

      ...this.parseRemoteOK(remoteok),

      ...this.parseRemotive(remotive)

    ];

    return this.removeDuplicates(jobs);

  }

  private parseArbeitNow(response: PromiseSettledResult<any>) {

    if (response.status !== "fulfilled") return [];

    return response.value.data.data.map((job: any) => ({
      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description,
      url: job.url,
      source: "ArbeitNow"
    }));
  }

  private parseHimalayas(response: PromiseSettledResult<any>) {

    if (response.status !== "fulfilled") return [];

    return response.value.data.jobs.map((job: any) => ({
      title: job.title,
      company: job.companyName,
      location: job.locationRestrictions?.join(", ") || "Remote",
      description: job.excerpt,
      url: job.applicationLink,
      source: "Himalayas"
    }));
  }

  private parseJobicy(response: PromiseSettledResult<any>) {

    if (response.status !== "fulfilled") return [];

    return response.value.data.jobs.map((job: any) => ({
      title: job.jobTitle,
      company: job.companyName,
      location: job.jobGeo,
      description: job.jobExcerpt,
      url: job.url,
      source: "Jobicy"
    }));
  }

  private parseRemoteOK(response: PromiseSettledResult<any>) {

    if (response.status !== "fulfilled") return [];

    return response.value.data
      .slice(1)
      .map((job: any) => ({
        title: job.position,
        company: job.company,
        location: job.location,
        description: job.description,
        url: job.url,
        source: "RemoteOK"
      }));
  }

  private parseRemotive(response: PromiseSettledResult<any>) {

    if (response.status !== "fulfilled") return [];

    return response.value.data.jobs.map((job: any) => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      description: job.description,
      url: job.url,
      source: "Remotive"
    }));
  }

  private removeDuplicates(jobs: any[]) {

    const map = new Map();

    for (const job of jobs) {

      const key = `${job.title}-${job.company}`;

      if (!map.has(key)) {

        map.set(key, job);

      }

    }

    return [...map.values()];
  }

}