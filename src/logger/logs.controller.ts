import { Controller, Get, Delete } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  async getLogs(): Promise<string> {
    return await this.logsService.readLogs();
  }

  @Delete()
  async clearLogs(): Promise<string> {
    return await this.logsService.clearLogs();
  }
}
