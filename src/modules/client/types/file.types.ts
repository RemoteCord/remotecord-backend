export type FileMetadata = {
  filename: string;
  size: number;
  format: string;
};

export type FileResult = {
  path: string;
  timestamp: string;
  controllerid: string;
  metadata: FileMetadata;
};
