import { FixedHeader } from '../FixedHeader';
import { Header } from '../Header';
import { UpdateLog } from '../UpdateLog';
import React, { useContext, useMemo } from 'react';
import { BroadCaseLinkList } from '../BroadCastLinkList';
import { AudioPlayer } from '../AudioPlayer';
import { Container } from './styles';
import { Broadcast, ButtonInfo, Site } from '../../lib/types';
import { playAudio } from '../../lib/play-audio';
import { AudioContext } from '../../contexts';
import { Broadcasts } from '../Broadcasts';

export type AppProps = {
  sites: Site[];
  buttonInfoList: ButtonInfo[];
  broadcasts: Broadcast[];
};

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
  const handleAudioPlay = (broadcast: Broadcast, buttonId: number) => {
    const fileName = buttonInfoList[buttonId]['file-name'];

    playAudio(state, setState, buttonId, fileName, broadcast.title, broadcast.streamId, broadcast.tweedId);
  };

  return (
    <>
      <Container>
        <FixedHeader />
        <Header />
        <UpdateLog logs={logs} />
        <hr style={{ margin: '1em 0' }} />
        {/* <AdArticles></AdArticles> */}
        <Broadcasts broadcasts={broadcasts} buttonInfoList={buttonInfoList} handleAudioPlay={handleAudioPlay} />
        <BroadCaseLinkList sites={sites} />
        {/* <Footer /> */}
      </Container>
      <AudioPlayer broadcasts={broadcasts} buttonInfoList={buttonInfoList} handleAudioPlay={handleAudioPlay} />
    </>
  );
}
