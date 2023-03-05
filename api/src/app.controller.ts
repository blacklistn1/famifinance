import { Controller, Get } from '@nestjs/common';
import { google } from 'googleapis';

@Controller('')
export class AppController {
  @Get('_google/supported-apis')
  getGoogleApis() {
    return google.getSupportedAPIs();
  }
}
