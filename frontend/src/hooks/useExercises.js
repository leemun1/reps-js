import { useEffect, useState } from 'react';
import _ from 'lodash';

// custom hook for managing workout exercises and sets data
function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [setsByExercise, setExerciseSets] = useState({});
  const [anySetCompleted, setAnySetCompleted] = useState(false);

  useEffect(() => {
    const allSets = _.flatMap(setsByExercise);
    setAnySetCompleted(_.some(allSets, (set) => set.completed));
  }, [setsByExercise]);

  const onAddExercise = (exercise, numSets = 1) => {
    setExercises((prev) => [...prev, exercise]);
    for (let i = 0; i < numSets; i++) {
      onAddSet(exercise);
    }
  };

  const onAddSavedExercise = (
    savedExercise,
    exercisePreset,
    conversionFactor = 1,
    markAsCoplete = false
  ) => {
    setExercises((prev) => [...prev, exercisePreset]);
    for (let i = 0; i < savedExercise.sets.length; i++) {
      const currentSet = savedExercise.sets[i];
      onAddSet(
        exercisePreset,
        currentSet.kg * conversionFactor,
        currentSet.reps,
        markAsCoplete
      );
    }
  };

  const onAddSet = (exercise, kg = 0, reps = 0, completed = false) => {
    setExerciseSets((prev) => {
      const existingSets = prev[exercise._id] || [];
      return {
        ...prev,
        [exercise._id]: [
          ...existingSets,
          {
            id: existingSets.length + 1,
            set: existingSets.length + 1,
            previous: '',
            kg,
            reps,
            completed,
          },
        ],
      };
    });
  };

  const onEditSet = (exercise, rowIndex, columnId, value) => {
    setExerciseSets((prev) => {
      const existingSets = prev[exercise._id];
      return {
        ...prev,
        [exercise._id]: existingSets.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...existingSets[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        }),
      };
    });
  };

  const onRemoveSet = (exercise, rowIndex) => {
    setExerciseSets((prev) => {
      const existingSets = prev[exercise._id];
      return {
        ...prev,
        [exercise._id]: _.filter(
          existingSets,
          (_item, index) => index !== rowIndex
        ),
      };
    });
  };

  const onConvertUnit = (conversionFactor) => {
    setExerciseSets((prev) => {
      const updatedSetsByExercise = {};

      _.forEach(prev, (sets, exerciseId) => {
        updatedSetsByExercise[exerciseId] = sets.map((row) => {
          return {
            ...row,
            kg: row.kg * conversionFactor,
          };
        });
      });

      return updatedSetsByExercise;
    });
  };

  const onFormatExercisesData = (conversionFactor) => {
    return _.map(setsByExercise, (sets, exerciseId) => {
      const completedSets = _.filter(sets, (set) => set.completed);
      return {
        exerciseId,
        sets: _.map(completedSets, (set) => ({
          kg: set.kg * conversionFactor,
          reps: set.reps,
        })),
      };
    });
  };

  return {
    exercises,
    setsByExercise,
    anySetCompleted,
    onAddExercise,
    onAddSavedExercise,
    onAddSet,
    onEditSet,
    onRemoveSet,
    onConvertUnit,
    onFormatExercisesData,
  };
}

export default useExercises;
