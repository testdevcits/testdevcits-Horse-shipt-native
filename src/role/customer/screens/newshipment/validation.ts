import * as Yup from 'yup';

const getTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const StepSchemas = [
  // Step 0: Pickup
  Yup.object().shape({
    pickupLocation: Yup.string().required('Pickup location is required'),
    pickupStartDate: Yup.date()
      .required('Pickup start date is required')
      .test(
        'is-at-least-tomorrow',
        'Pickup start date must be at least 1 day in advance',
        value => {
          if (!value) return false;
          const minDate = getTomorrow();
          const valDate = new Date(value);
          valDate.setHours(0, 0, 0, 0);
          return valDate.getTime() >= minDate.getTime();
        },
      ),
    pickupEndDate: Yup.date()
      .required('Pickup end date is required')
      .test(
        'is-on-or-after-pickup-start',
        'Pickup end date cannot be before pickup start date',
        function (value) {
          const { pickupStartDate } = this.parent;
          if (!value || !pickupStartDate) return true;
          const start = new Date(pickupStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(value);
          end.setHours(0, 0, 0, 0);
          return end.getTime() >= start.getTime();
        },
      ),
  }),
  // Step 1: Delivery
  Yup.object().shape({
    deliveryLocation: Yup.string().required('Delivery location is required'),
    deliveryStartDate: Yup.date()
      .required('Delivery start date is required')
      .test(
        'is-on-or-after-pickup',
        'Delivery start date must be on or after pickup date',
        function (value) {
          const { pickupEndDate, pickupStartDate } = this.parent;
          const refDate = pickupEndDate || pickupStartDate;
          if (!value || !refDate) return true;
          const pickup = new Date(refDate);
          pickup.setHours(0, 0, 0, 0);
          const delStart = new Date(value);
          delStart.setHours(0, 0, 0, 0);
          return delStart.getTime() >= pickup.getTime();
        },
      ),
    deliveryEndDate: Yup.date()
      .required('Delivery end date is required')
      .test(
        'is-on-or-after-delivery-start',
        'Delivery end date cannot be before delivery start date',
        function (value) {
          const { deliveryStartDate } = this.parent;
          if (!value || !deliveryStartDate) return true;
          const start = new Date(deliveryStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(value);
          end.setHours(0, 0, 0, 0);
          return end.getTime() >= start.getTime();
        },
      ),
  }),
  // Step 2: Horses
  Yup.object().shape({
    numberOfHorses: Yup.number().min(1, 'At least 1 horse required').required(),
    horses: Yup.array().of(
      Yup.object().shape({
        registeredName: Yup.string().required('Registered name is required'),
        breed: Yup.string().required('Breed is required'),
        sex: Yup.string().required('Sex is required'),
      }),
    ),
  }),
  // Step 3: Documents
  Yup.object().shape({}),
  // Step 4: Review
  Yup.object().shape({}),
];
