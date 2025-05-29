import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogsService {
  private readonly logDir = path.join(__dirname, '..', '..', 'logs');

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  async logToFile(message: string, clientIp: string): Promise<void> {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${clientIp}] ${message}\n`;

    const filePath = path.join(this.logDir, 'errors.log');
    fs.appendFile(filePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write to log file:', err);
      }
    });
  }

  async readLogs(): Promise<string> {
    const filePath = path.join(this.logDir, 'errors.log');
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (err) {
      return 'Log file not found or unreadable.';
    }
  }

  async clearLogs(): Promise<string> {
    const filePath = path.join(this.logDir, 'errors.log');
    try {
      fs.writeFileSync(filePath, '');
      return 'Logs cleared successfully.';
    } catch (err) {
      return 'Failed to clear log file.';
    }
  }
}
