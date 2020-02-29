import React from 'react';
import { ButtonsBySlug } from '../../lib/types';
import { PostArticle } from './PostArticle';

type Props = {
  slugs: string[];
  buttonsBySlug: ButtonsBySlug;
  handleButtonClick: Function;
};

export function PostArticles({ slugs, buttonsBySlug, handleButtonClick }: Props) {
  return (
    <div>
      {slugs.map((slug) => (
        <PostArticle
          key={slug}
          {...{
            slug,
            buttonsBySlug,
            handleButtonClick,
          }}
        />
      ))}
    </div>
  );
}
