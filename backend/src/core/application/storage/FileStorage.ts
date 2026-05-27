export interface CreatePresignedUploadUrlInput {
  key: string;
  contentType: string;
  expiresInSeconds: number;
}

export interface PresignedUploadUrl {
  uploadUrl: string;
  publicUrl: string;
}

export interface FileStorage {
  createPresignedUploadUrl(input: CreatePresignedUploadUrlInput): Promise<PresignedUploadUrl>;
}
