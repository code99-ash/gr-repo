import { Validator } from './validation.pipe';

describe('Validator', () => {
  it('should be defined', () => {
    expect(new Validator({})).toBeDefined();
  });
});
