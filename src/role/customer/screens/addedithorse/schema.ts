import * as Yup from 'yup';

export const HorseSchema = Yup.object().shape({
  registeredName: Yup.string().min(3, 'Minimum 3 characters required').required('Required'),
  barnName: Yup.string().min(3, 'Minimum 3 characters required').required('Required'),
  colour: Yup.string().required('Required'),
  age: Yup.string().required('Required'),
  breed: Yup.string().required('Required'),
  otherBreed: Yup.string().optional(),
  sex: Yup.string().required('Required'),
  defaultStallSize: Yup.string().required('Required'),
  notes: Yup.string().optional(),
});



 