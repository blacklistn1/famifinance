import { helpers } from 'vuelidate/lib/validators';

export const multitude = (factor) =>
  helpers.withParams(
    { type: 'multitude', factor },
    (value) => parseFloat(value) % factor === 0
  )
