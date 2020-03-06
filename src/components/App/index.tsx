import React, { useContext, useEffect, useMemo } from 'react';
import { AudioMenu, Broadcasts, BroadCaseLinkList, FixedHeader, Header, UpdateLog } from '..';
import { Container } from './styles';
import { Broadcast, ButtonInfo, Site } from '../../lib/types';
import { AudioContext } from '../../contexts';
import { audioPlayer } from '../../audio-player';
import { getSourceTypeTextAndLink } from '../../lib/getSourceTypeTextAndLink';
import { endpoint, host } from '../../constants';

export type AppProps = {
  sites: Site[];
  buttonInfoList: ButtonInfo[];
  broadcasts: Broadcast[];
};

function getThumbnailUrl(streamId?: string, tweetId?: string): string {
  if (streamId) {
    return `https://img.youtube.com/vi/${streamId}/hqdefault.jpg`;
  } else if (tweetId) {
    return `${host}/images/twitter-logo.png`;
  } else {
    return `${host}/images/thumbnail.png`;
  }
}

function copyUrlToClipboard() {
  const url = document.querySelector<HTMLInputElement>('input#share-url')!;

  url.select();
  document.execCommand('copy');
}

export function App(props: AppProps) {
  const { broadcasts, buttonInfoList, sites } = props;
  const [state, setState] = useContext(AudioContext);

  const logs = useMemo(
    () =>
      broadcasts.map((b) => ({
        name: b.title,
        link: `/#${b.id}`,
        createdAt: new Date(b.createdAt),
        updatedAt: b.updatedAt && new Date(b.updatedAt),
      })),
    [broadcasts],
  );

  const audioTitle = useMemo(() => (state.audioId ? buttonInfoList[state.audioId].value : undefined), [state.audioId]);
  const buttonUrl = useMemo(() => (state.audioId ? `${endpoint}/#${state.audioId}` : endpoint), [state.audioId]);
  const twitterShareUrl = useMemo(() => {
    if (state.audioId) {
      return `https://twitter.com/intent/tweet?text=${audioTitle}&url=${endpoint}/%23${state.audioId}&hashtags=さなボタン`;
    } else {
      return 'https://twitter.com/intent/tweet?text=さなボタン';
    }
  }, [state.audioId, audioTitle, buttonUrl]);

  const callback = ({ title, streamId, tweedId }: Broadcast, audioId: number) => {
    const [, link] = getSourceTypeTextAndLink(streamId, tweedId);
    const thumbnailUrl = getThumbnailUrl(streamId, tweedId);
    const fileName = buttonInfoList[audioId]['file-name'];

    setState({
      audioId,
      sourceTitle: title,
      sourceLink: link,
      thumbnailUrl,
      streamId,
      tweedId,
    });

    audioPlayer.playNewAudio(audioId, fileName);
  };

  const playCurrentAudio = () => {
    audioPlayer.playCurrentAudio();
  };

  const pause = () => {
    audioPlayer.pause();
  };

  const stop = () => {
    audioPlayer.stop();
  };

  useEffect(() => {
    audioPlayer.eventEmitter.on('play', callback);
  }, []);

  useEffect(() => {
    const { hash } = window.location;
    const audioId = Number(hash.slice(1));

    const broadcast = broadcasts.find(({ buttonIds }) => buttonIds.includes(audioId));

    if (!broadcast) {
      return;
    }
    if (Number.isInteger(audioId)) {
      audioPlayer.emitPlay(broadcast, audioId);
    }
  }, []);

  return (
    <>
      <Container>
        <FixedHeader onStopClick={stop} />
        <Header />
        <UpdateLog logs={logs} />
        <hr style={{ margin: '1em 0' }} />
        {/* <AdArticles></AdArticles> */}
        <Broadcasts broadcasts={broadcasts} buttonInfoList={buttonInfoList} />
        <BroadCaseLinkList sites={sites} />
        {/* <Footer /> */}
      </Container>
      <AudioMenu
        audioTitle={audioTitle}
        sourceTitle={state.sourceTitle}
        thumbnailUrl={state.thumbnailUrl}
        sourceLink={state.sourceLink}
        onPlayClick={playCurrentAudio}
        onPauseClick={pause}
        onStopClick={stop}
      >
        <div>
          <div>
            <button>
              <a href={twitterShareUrl}>Twitter でシェア</a>
            </button>
          </div>
          <div>
            <input type="url" id="share-url" value={buttonUrl} />
            <button onClick={copyUrlToClipboard}>URL をコピー</button>
          </div>
        </div>
      </AudioMenu>
    </>
  );
}
