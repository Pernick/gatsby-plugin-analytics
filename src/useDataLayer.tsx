import React, { useEffect, useState } from 'react';
import { oneLine, stripIndent } from 'common-tags';

export const useDataLayer = (data: string) => {
  const [dataLayer, setDataLayer] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDataLayer(stripIndent`
      window.dataLayer.push(${data})
    `);
    }, 50);
    return () => clearTimeout(timeout);
  }, [data]);

  if (!dataLayer) {
    return null;
  }

  return <script>{oneLine`${dataLayer}`}</script>;
};
