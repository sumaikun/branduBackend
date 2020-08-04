import { Controller, Get, Post, UseInterceptors, UploadedFiles, Param, Res, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './utils/file-upload.util';
import * as fs from 'fs'

@Controller('files')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('uploadImage')
  @UseInterceptors( FilesInterceptor('file', 20, {
    storage: diskStorage({
      destination: './files',
      filename: editFileName,
    }),
    fileFilter: imageFileFilter,
  }))
  uploadFile(@UploadedFiles() files) {
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './files' });
  }

  @Delete(':fileName')
  deleteFile(@Param('fileName') fileName) {
    fs.unlinkSync('./files/'+fileName);
    return { "status":"ok" }
  }

  
}
