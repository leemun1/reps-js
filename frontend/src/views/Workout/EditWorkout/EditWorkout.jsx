import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { VscAdd } from 'react-icons/vsc';
import classnames from 'classnames';
import _ from 'lodash';

import './EditWorkout.scss';

import Exercise from '../Exercise/Exercise';

import Modal from '../../../shared/Modal/Modal';
import AddExercise from '../../../shared/AddExercise/AddExercise';
import Confirmation from '../../../shared/Confirmation/Confirmation';

import WorkoutActions from '../../../redux/workout/actions';
import ExerciseActions from '../../../redux/exercise/actions';

import usePrevious from '../../../hooks/usePrevious';
import useExercises from '../../../hooks/useExercises';

const EditWorkout = () => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(0);
  const [
    exercises,
    setsByExercise,
    anySetCompleted,
    onAddExercise,
    onAddSet,
    onEditSet,
    onRemoveSet,
  ] = useExercises();

  const addExerciseModalRef = useRef(null);
  const saveWorkoutModalRef = useRef(null);

  const { workoutLogs, status: workoutStatus } = useSelector(
    (state) => state.workout
  );
  const { presets: exercisePresets, status: exerciseStatus } = useSelector(
    (state) => state.exercise
  );
  const prevWorkoutStatus = usePrevious(workoutStatus);
  const prevExerciseStatus = usePrevious(exerciseStatus);

  const dispatch = useDispatch();
  const history = useHistory();
  const { workoutId } = useParams();

  useEffect(() => {
    dispatch(WorkoutActions.resetWorkoutProgress());
    dispatch(ExerciseActions.getPresetsRequest());
  }, []);

  useEffect(() => {
    if (prevWorkoutStatus && workoutStatus) {
      if (
        !prevWorkoutStatus.editWorkoutSuccess &&
        workoutStatus.editWorkoutSuccess
      ) {
        history.push('/logs');
        return;
      }
    }

    if (prevExerciseStatus && exerciseStatus) {
      if (
        !prevExerciseStatus.getPresetsSuccess &&
        exerciseStatus.getPresetsSuccess
      ) {
        populateExerciseSections();
      }
    }
  }, [workoutStatus, prevWorkoutStatus, exerciseStatus, prevExerciseStatus]);

  const populateExerciseSections = () => {
    if (workoutId) {
      if (_.isEmpty(workoutLogs)) {
        // no workout data available; redirect to home page
        history.push('/');
      } else {
        const currentWorkout = workoutLogs.find(
          (item) => item._id === workoutId
        );

        // set workout title
        setTitle(currentWorkout.name);

        // set workout duration
        setDuration(currentWorkout.duration);

        // add exercises
        _.forEach(currentWorkout.exercises, (item) => {
          // DX: skip exercises that are already included
          if (setsByExercise[item.presetId]) return;
          const exercisePreset = exercisePresets.find(
            (preset) => preset._id === item.presetId
          );
          const SETS_COMPLETED = true;
          onAddExercise(exercisePreset, item.numSets, SETS_COMPLETED);
        });
      }
    }
  };

  const onSaveWorkout = () => {
    const formattedData = {
      name: title,
      exercises: EditWorkout.formatExercisesData(setsByExercise),
      duration,
    };
    console.log('save', formattedData);

    // dispatch(WorkoutActions.editWorkoutRequest(formattedData));
  };

  return (
    <div className='workout-view'>
      <div className='view-header'>Edit {title}</div>
      <div className='view-content'>
        <div className='workout-controls'>
          {/* TODO: show/edit duration */}
          <div className='workout-controls-actions'>
            <button
              className='cancel-workout-btn'
              onClick={() => history.goBack()}
            >
              <span>Cancel</span>
            </button>
            <button
              className={classnames({
                'finish-workout-btn': true,
                disabled: !anySetCompleted,
              })}
              onClick={() => saveWorkoutModalRef.current.open()}
            >
              <span>Save</span>
            </button>
          </div>
        </div>
        {exercises.map((exercise) => (
          <Exercise
            key={exercise._id}
            exercise={exercise}
            sets={setsByExercise[exercise._id] || []}
            onAddSet={onAddSet}
            onEditSet={onEditSet}
            onRemoveSet={onRemoveSet}
          />
        ))}
        <button
          className='add-exercise-btn'
          onClick={() => addExerciseModalRef.current.open()}
        >
          <VscAdd />
          <span>Add exercise</span>
        </button>
      </div>
      <Modal ref={addExerciseModalRef}>
        <AddExercise
          exercisePresets={exercisePresets}
          selectedExercises={exercises}
          onAddExercise={(item) => {
            onAddExercise(item);
            addExerciseModalRef.current.close();
          }}
        />
      </Modal>
      <Modal ref={saveWorkoutModalRef}>
        <Confirmation
          title='Edit workout'
          subtitle={
            <>
              <p>Are you sure you would like to edit this workout session?</p>
              <p>Any existing data will be overriden.</p>
            </>
          }
          onCancel={() => saveWorkoutModalRef.current.close()}
          onConfirm={onSaveWorkout}
        />
      </Modal>
    </div>
  );
};

EditWorkout.formatExercisesData = (setsByExercise) => {
  return _.map(setsByExercise, (sets, presetId) => ({
    presetId,
    sets: _.map(sets, (set) => ({
      kg: parseInt(set.kg, 10),
      reps: parseInt(set.reps, 10),
    })),
  }));
};

export default EditWorkout;