import * as Yup from 'yup';

export const HorseSchema = Yup.object().shape({
  registeredName: Yup.string()
    .trim()
    .min(3, 'Registered name must be at least 3 characters')
    .required('Please enter the horse’s registered name'),

  barnName: Yup.string()
    .trim()
    .min(3, 'Barn name must be at least 3 characters')
    .required('Please enter the horse’s barn name'),

  colour: Yup.string().required('Please select the horse’s colour'),

  age: Yup.string().required('Please select the horse’s age'),

  breed: Yup.string().required('Please select the horse’s breed'),

  otherBreed: Yup.string().when('breed', {
    is: (breed: string) => breed?.toLowerCase() === 'other',
    then: schema => schema.trim().required('Please specify the horse’s breed'),
    otherwise: schema => schema.optional(),
  }),

  sex: Yup.string().required('Please select the horse’s sex'),

  defaultStallSize: Yup.string().required(
    'Please select the default stall size',
  ),

  photo: Yup.mixed()
    .nullable()
    .required('Please upload a photo of the horse')
    .test('photo-required', 'Please upload a valid horse photo', value => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }

      if (value && typeof value === 'object') {
        const photo = value as { uri?: string; url?: string };

        return Boolean(photo.uri?.trim() || photo.url?.trim());
      }

      return false;
    }),

  notes: Yup.string().optional(),
});
