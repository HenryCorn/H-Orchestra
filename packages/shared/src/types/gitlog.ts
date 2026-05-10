export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
}

export interface GitLogResponse {
  commits: GitCommit[];
  isGitRepo: boolean;
}
