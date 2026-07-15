import { Body, Controller, Post } from '@nestjs/common';
import { JobListingsService } from './job-listings.service';
import { SearchJobsDto } from './dto';

@Controller('job-listings')
export class JobListingsController {
  constructor(
    private readonly jobListingsService: JobListingsService,
  ) {}

  @Post('search')
  async searchJobs(
    @Body() searchJobs: SearchJobsDto
  ) {
    return await this.jobListingsService.searchJobs(
      searchJobs,
    );
  }
}