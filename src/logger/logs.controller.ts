import { Controller, Get, Delete } from '@nestjs/common';
import { LogsService } from './logs.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@Public()
@ApiExcludeController()
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  getLogs(): string {
    return this.logsService.readLogs();
  }

  @Delete()
  clearLogs(): string {
    return this.logsService.clearLogs();
  }
}
