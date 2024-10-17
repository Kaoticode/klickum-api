import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getFile(folder: string, filename: string, res: Response) {
    const filePath = join(process.cwd(), 'public', folder, filename);
    res.sendFile(filePath);
  }
}
