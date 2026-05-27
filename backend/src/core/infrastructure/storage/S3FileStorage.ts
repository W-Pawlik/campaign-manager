import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  CreatePresignedUploadUrlInput,
  FileStorage,
  PresignedUploadUrl,
} from "@core/application/storage/FileStorage";

export interface S3FileStorageConfig {
  bucket: string;
  region: string;
}

export class S3FileStorage implements FileStorage {
  public constructor(
    private readonly s3Client: S3Client,
    private readonly config: S3FileStorageConfig,
  ) {}

  public async createPresignedUploadUrl(
    input: CreatePresignedUploadUrlInput,
  ): Promise<PresignedUploadUrl> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: input.key,
      ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: input.expiresInSeconds,
    });

    return {
      uploadUrl,
      publicUrl: this.buildPublicUrl(input.key),
    };
  }

  private buildPublicUrl(key: string): string {
    const encodedKey = key
      .split("/")
      .map((segment) => encodeURIComponent(segment))
      .join("/");

    return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${encodedKey}`;
  }
}
