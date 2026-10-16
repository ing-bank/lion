const { createSocialImage } = require('@rocket/cli');

module.exports = async function () {
  const socialMediaImage = await createSocialImage({
    title: 'Lion',
    subTitle: 'Components for',
    subTitle2: 'your Design System',
    footer: 'ING open source',
  });
  return {
    socialMediaImage,
  };
};
