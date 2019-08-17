export interface Version {
  major: string;
  minor: string;
  build: string;
  branch: string;
  commit: string;
}

export interface AboutState {
  version: Version;
}

export const DefaultState: AboutState = {
  version: null,
};
