const { createSocialImage } = require('@rocket/cli');

module.exports = async function () {
  const socialMediaImage = await createSocialImage({
    title: 'Controlling',
    subTitle: 'Exports',
    footer: 'Lion Blog',
  });
  return {
    socialMediaImage,
  };
};
