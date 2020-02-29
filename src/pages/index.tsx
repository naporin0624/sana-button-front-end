import React, { createRef, useEffect, useState } from 'react';

import fetch from 'isomorphic-unfetch';
import { FixedHeader, PostArticles, UpdateLog, Header } from '../components';
import { addDays } from 'date-fns';
import { endpoint, endpointSound, endpointV1 } from '../constants';
import { AudioState, ButtonsBySlug } from '../lib/types';

function getDecodedTitleFromEncodedPath(path: string) {
  const matchResult = path.match(/\/api\/button\/(.*)\.json/);

  if (!matchResult) {
    throw new Error();
  }
  const [, encodedTitle] = matchResult;
  const title = decodeURI(encodedTitle);

  return title;
}

type Props = {
  slugs: string[];
  buttonsBySlug: ButtonsBySlug;
};

const initialAudioState: AudioState = {
  currentPlayingAudioName: undefined,
  initializedAudioNames: new Set(),
};

export default function Index(props: Props) {
  const logs = [
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      name: '感情を取り戻したオタクの配信はここですか？',
      link: '#',
    },
    {
      createdAt: new Date(),
      updatedAt: addDays(new Date(), 1),
      name: '感情を取り戻したオタクの配信はここですか？',
      link: '#',
    },
  ];
  const [state, setState] = useState<AudioState>(initialAudioState);
  const { initializedAudioNames, currentPlayingAudioName } = state;
  const playingRef = createRef<HTMLAudioElement>();
  const handleButtonClick = (audioName: string) => {
    if (playingRef.current) {
      playingRef.current.pause();
    }
    setState(({ initializedAudioNames: prevInitializedAudioNames }) => ({
      currentPlayingAudioName: audioName,
      initializedAudioNames: prevInitializedAudioNames.add(audioName),
    }));
  };

  useEffect(() => {
    if (playingRef && playingRef.current) {
      playingRef.current.play();
    }
  });

  return (
    <>
      <FixedHeader />
      <Header />
      <UpdateLog logs={logs} />
      <hr style={{ margin: '1em 0' }} />
      {/* <AdArticles></AdArticles> */}
      {/* <Footer /> */}
      <PostArticles {...props} handleButtonClick={handleButtonClick}></PostArticles>
      {[...initializedAudioNames].map((audioName) => (
        <audio
          key={audioName}
          ref={audioName === currentPlayingAudioName ? playingRef : undefined}
          src={`${endpointSound}/${audioName}.mp3`}
        />
      ))}
    </>
  );
}

Index.getInitialProps = async (): Promise<Props> => {
  // /api/button/${urlEncodedTitle}
  const broadcastPaths: string[] = await fetch(`${endpointV1}/post-list.json`).then((r) => r.json());

  const slugs = [];
  const buttonsBySlug: ButtonsBySlug = {};

  for (const path of broadcastPaths) {
    const title = getDecodedTitleFromEncodedPath(path);
    const [buttons] = await fetch(`${endpoint}${path}`).then((r) => r.json());

    slugs.push(title);
    buttonsBySlug[title] = buttons;
  }

  return {
    slugs,
    buttonsBySlug,
  };
};
