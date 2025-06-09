import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService], // Export MailService to be used in other modules
})
export class MailModule {}
