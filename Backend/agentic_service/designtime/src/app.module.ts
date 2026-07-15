import { Module } from '@nestjs/common';
import { JobListingsModule } from './job-listings/jobs-listings.module';

@Module({
    imports: [JobListingsModule]
})
export class AppModule {}