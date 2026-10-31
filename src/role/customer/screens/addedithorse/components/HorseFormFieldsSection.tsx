import React, { Suspense, lazy } from 'react';
import { Input, LazyFallback } from '../../../../../components';
import { breedsList, sexes, stallTypes } from '../constants';

const AppSelect = lazy(() =>
  import('../../../../../components').then(module => ({
    default: module.AppSelect,
  })),
);

interface Props {
  values: any;
  touched: any;
  errors: any;
  handleChange: any;
  setFieldValue: (field: string, val: any) => void;
  colorOptions: string[];
}

export const HorseFormFieldsSection: React.FC<Props> = React.memo(
  ({ values, touched, errors, handleChange, setFieldValue, colorOptions }) => {
    return (
      <>
        <Input
          label={'Registered Name'}
          placeholder="Enter Registered name ( min 3 characters )"
          value={values?.registeredName}
          onChangeText={handleChange('registeredName')}
          error={
            touched.registeredName ? (errors.registeredName as string) : ''
          }
        />

        <Input
          label={'Barn Name'}
          placeholder="Enter Barn name ( min 3 characters )"
          value={values?.barnName}
          onChangeText={handleChange('barnName')}
          error={touched?.barnName ? (errors.barnName as string) : ''}
        />

        <Suspense fallback={<LazyFallback />}>
          <AppSelect
            label={'Color'}
            placeholder="Select Color"
            options={colorOptions}
            value={values?.colour}
            searchable
            onSelect={item => setFieldValue('colour', item)}
            error={touched?.colour ? (errors.colour as string) : ''}
          />
        </Suspense>

        <Input
          label={'Age (years)'}
          placeholder="Enter age"
          keyboardType="numeric"
          value={values?.age}
          onChangeText={handleChange('age')}
          maxLength={2}
          error={touched?.age ? (errors.age as string) : ''}
        />

        <Suspense fallback={<LazyFallback />}>
          <AppSelect
            label={'Breed'}
            placeholder="Select Breed"
            options={breedsList}
            value={values?.breed}
            searchable
            onSelect={item => setFieldValue('breed', item)}
            error={touched?.breed ? (errors.breed as string) : ''}
          />
        </Suspense>

        {(values?.breed === 'Other' || values?.breed === 'Other Breed') && (
          <Input
            label={'Other Breed'}
            placeholder="Enter custom breed name"
            value={values?.otherBreed}
            onChangeText={handleChange('otherBreed')}
            error={touched.otherBreed ? (errors.otherBreed as string) : ''}
          />
        )}

        <Suspense fallback={<LazyFallback />}>
          <AppSelect
            label={'Sex'}
            placeholder="Select Sex"
            options={sexes}
            value={values?.sex}
            onSelect={item => setFieldValue('sex', item)}
            error={touched?.sex ? (errors.sex as string) : ''}
          />
        </Suspense>

        <Suspense fallback={<LazyFallback />}>
          <AppSelect
            label={'Stall Type'}
            placeholder="Select Stall Type"
            options={stallTypes}
            value={values?.defaultStallSize}
            onSelect={item => setFieldValue('defaultStallSize', item)}
            error={
              touched.defaultStallSize
                ? (errors.defaultStallSize as string)
                : ''
            }
          />
        </Suspense>

        <Input
          label="Notes (General Info)"
          placeholder="Enter Notes about horse"
          multiline
          numberOfLines={4}
          value={values?.notes}
          onChangeText={handleChange('notes')}
          inputContainerStyle={{ height: 100 }}
          error={touched?.notes ? (errors.notes as string) : ''}
        />
      </>
    );
  },
);
