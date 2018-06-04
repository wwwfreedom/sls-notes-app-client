import { Storage } from "aws-amplify"

// take a file object as a parameter
export async function s3Upload(file) {
  // generate a unique file name (use uuid in production)
  const filename = `${Date.now()}-${file.name}`

  // upload file to user's folder in S3 if uploading publicly use Storage.put()
  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  })

  return stored.key
}
