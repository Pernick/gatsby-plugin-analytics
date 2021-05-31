const React = require("react");
const { stripIndent, oneLine } = require("common-tags");

const generateDefaultDataLayer = (dataLayer) => {
  let result = `window.dataLayer = window.dataLayer || [];`;
  if (typeof dataLayer === `function`) {
    result += `window.dataLayer.push((${dataLayer.value})());`;
  } else {
    if (typeof dataLayer !== `object`) {
      console.error(
        `The plugin option "defaultDataLayer" should be a plain object. "${dataLayer}" is not valid.`
      );
      return ``;
    }
    if (Object.keys(dataLayer).length > 0) {
      result += `window.dataLayer.push(${JSON.stringify(dataLayer)});`;
    }
  }
  return stripIndent`${result}`;
};

const generateGTM = ({ id }) => stripIndent`
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${id}');
`;

const generateGTMIframe = ({ id }) =>
  oneLine`<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden" aria-hidden="true"></iframe>`;

exports.onRenderBody = (
  { setHeadComponents, setPreBodyComponents },
  { id, includeInDevelopment = false, defaultDataLayer }
) => {
  if (process.env.NODE_ENV !== "production" && !includeInDevelopment) {
    return;
  }

  let defaultDataLayerCode = ``;
  if (defaultDataLayer) {
    defaultDataLayerCode = generateDefaultDataLayer(defaultDataLayer);
  }

  setHeadComponents([
    <script
      key="tagmanager-datalayer"
      dangerouslySetInnerHTML={{ __html: oneLine`${defaultDataLayerCode}` }}
    />,
    <script
      key="tagmanager-gtm"
      dangerouslySetInnerHTML={{ __html: oneLine`${generateGTM({ id })}` }}
    />,
  ]);

  setPreBodyComponents([
    <noscript
      key="tagmanager-iframe"
      dangerouslySetInnerHTML={{
        __html: oneLine`${generateGTMIframe({ id })}`,
      }}
    />,
  ]);
};
