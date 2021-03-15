const { createSocialImage } = require('@rocket/cli');

module.exports = async function () {
  const socialMediaImage = await createSocialImage({
    title: 'ING',
    subTitle: 'Open Sources',
    subTitle2: 'Lion',
    footer: 'Lion Blog',
  });
  return {
    socialMediaImage,
  };
};
