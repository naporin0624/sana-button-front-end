export type ButtonsBySlug = {
  [slug: string]: ButtonInfo[];
};

export type ButtonInfo = {
  'file-name': string;
  value: string;
};

export type AudioState = {
  initializedAudioNames: Set<string>;
  currentPlayingAudioName: string | undefined;
};
