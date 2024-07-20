import { MimeTypes } from '../enums/mime-types.enum'
import { UnsupportedMediaTypeException } from '@nestjs/common/exceptions'
import { extension } from 'mime-types'

export const checkFileType = (
  file: {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    size: number
    destination: string
    filename: string
    path: string
    buffer: Buffer
  },
  cb: (error: Error | null, acceptFile: boolean) => void,
  mimeTypes: MimeTypes[],
) => {
  if (!mimeTypes.includes(file.mimetype as MimeTypes)) {
    const allowedMimeTypes = mimeTypes.map((type) => extension(type))

    return cb(
      new UnsupportedMediaTypeException(
        `Incorrect file type (${extension(
          file.mimetype,
        )})! Available types: ${allowedMimeTypes.join(', ')}`,
      ),
      false,
    )
  }

  cb(null, true)
}
