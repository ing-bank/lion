import { expect } from '@open-wc/testing';
import { FileLastModifiedDateValidator } from '@lion/ui/FileLastModifiedDateValidator';

describe('FileLastModifiedDateValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new FileLastModifiedDateValidator({
      startDate: new Date('2022-01-01'),
      endDate: new Date('2023-01-01'),
    });
  });

  it('validates files within the specified date range', () => {
    const validFile = new File(['content'], 'test.txt', {
      type: 'text/plain',
      lastModified: new Date('2022-06-01').getTime(),
    });

    const result = validator.execute([validFile]);
    expect(result).to.be.true;
  });

  it('invalidates files outside the specified date range', () => {
    const invalidFile = new File(['content'], 'test.txt', {
      type: 'text/plain',
      lastModified: new Date('2021-12-31').getTime(),
    });

    const result = validator.execute([invalidFile]);
    expect(result).to.be.false;
  });

  it('returns a validation message for invalid files', async () => {
    const message = await FileLastModifiedDateValidator.getMessage();
    expect(message).to.equal(
      'The file must have been last modified within the specified date range.',
    );
  });
});
