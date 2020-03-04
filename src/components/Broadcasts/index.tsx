import { Broadcast, ButtonInfo } from '../../lib/types';
import React, { Fragment, useMemo } from 'react';
import { PostArticles } from '../PostArticles';
import { Button } from '../Button';

type Props = {
  broadcasts: Broadcast[];
  buttonInfoList: ButtonInfo[];
  handleAudioPlay: (broadcast: Broadcast, id: number) => void;
};

export function Broadcasts({ broadcasts, buttonInfoList, handleAudioPlay }: Props) {
  return useMemo(
    () => (
      <>
        {broadcasts.map((broadcast) => (
          <Fragment key={broadcast.id}>
            <PostArticles broadcast={broadcast} buttonInfoList={buttonInfoList}>
              {broadcast.buttonIds.map((buttonId) => (
                <Button
                  key={buttonId}
                  id={buttonId}
                  buttonInfo={buttonInfoList[buttonId]}
                  handleClick={(id: number) => handleAudioPlay(broadcast, id)}
                />
              ))}
            </PostArticles>
            <hr style={{ margin: '1em 0' }} />
          </Fragment>
        ))}
      </>
    ),
    [],
  );
}
