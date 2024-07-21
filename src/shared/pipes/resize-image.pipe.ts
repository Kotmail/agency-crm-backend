import { Injectable, PipeTransform } from '@nestjs/common'
import * as sharp from 'sharp'

sharp.cache(false)

@Injectable()
export class ResizeImagePipe
  implements PipeTransform<Express.Multer.File, Promise<Express.Multer.File>>
{
  constructor(private resizeOptions: sharp.ResizeOptions) {}

  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    if (!file) {
      return
    }

    const path = file.destination + file.filename

    const buffer = await sharp(path)
      .jpeg({
        quality: 90,
      })
      .resize(this.resizeOptions)
      .toBuffer()

    sharp(buffer).toFile(path)

    return file
  }
}
