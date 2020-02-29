import React from 'react';
import { ButtonInfo } from '../../lib/types';

type Props = {
  button: ButtonInfo;
  handleButtonClick: Function;
};

export function Button({ button, handleButtonClick }: Props) {
  return (
    <>
      <button onClick={() => handleButtonClick(button['file-name'])}>{button.value}</button>
    </>
  );
}
