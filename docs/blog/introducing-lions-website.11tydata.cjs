const { createSocialImage } = require('@rocket/cli');

module.exports = async function () {
  const socialMediaImage = await createSocialImage({
    title: 'Introducing',
    subTitle: 'Lions',
    subTitle2: 'Website',
    footer: 'Lion Blog',
  });
  return {
    socialMediaImage,
  };
};
