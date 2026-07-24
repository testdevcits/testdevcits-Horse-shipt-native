import * as Yup from 'yup';

export const StepSchemas = [
  // Step 0: Pickup
  Yup.object().shape({
    pickupLocation: Yup.string().required('Pickup location is required'),
    pickupStartDate: Yup.date().required('Start date is required'),
    pickupEndDate: Yup.date()
      .min(Yup.ref('pickupStartDate'), 'End date cannot be before start date')
      .required('End date is required'),
  }),
  // Step 1: Delivery
  Yup.object().shape({
    deliveryLocation: Yup.string().required('Delivery location is required'),
    deliveryStartDate: Yup.date().required('Start date is required'),
    deliveryEndDate: Yup.date()
      .min(Yup.ref('deliveryStartDate'), 'End date cannot be before start date')
      .required('End date is required'),
  }),
  // Step 2: Horses
  Yup.object().shape({
    numberOfHorses: Yup.number().min(1, 'At least 1 horse required').required(),
    horses: Yup.array().of(
      Yup.object().shape({
        registeredName: Yup.string().required('Registered name is required'),
        breed: Yup.string().required('Breed is required'),
        sex: Yup.string().required('Sex is required'),
      })
    ),
  }),
  // Step 3: Documents
  Yup.object().shape({
    // Documents can be optional or required based on business logic
  }),
];