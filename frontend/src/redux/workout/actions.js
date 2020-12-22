import types from './types';

const actions = {
  saveWorkoutRequest: (workoutData) => {
    return {
      type: types.SAVE_WORKOUT_REQUEST,
      payload: {
        workoutData,
      },
    };
  },
  saveWorkoutSuccess: (savedWorkout) => {
    return {
      type: types.SAVE_WORKOUT_SUCCESS,
      payload: {
        savedWorkout,
      },
    };
  },
  saveWorkoutFailure: (error) => {
    return {
      type: types.SAVE_WORKOUT_FAILURE,
      payload: {
        error,
      },
    };
  },
};

export default actions;
