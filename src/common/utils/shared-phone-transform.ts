import { Transform } from 'class-transformer';

export const TrimAndNullify = () =>
  Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : String(value).trim(),
  );
