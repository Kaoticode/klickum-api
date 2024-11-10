import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusRepository } from './status.repository';

@Module({
  providers: [StatusService, StatusRepository],
  exports: [StatusService, StatusRepository],
})
export class StatusModule {}
