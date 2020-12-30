import 'regenerator-runtime/runtime';
import { all, takeLatest } from 'redux-saga/effects';

import types from '../types';

// import each saga
import getPresetRoutines from './getPresetRoutines';
import getCustomRoutines from './getCustomRoutines';
import saveRoutine from './saveRoutine';

export default function* authSaga() {
  yield all([takeLatest(types.GET_PRESET_ROUTINES_REQUEST, getPresetRoutines)]);
  yield all([takeLatest(types.GET_CUSTOM_ROUTINES_REQUEST, getCustomRoutines)]);
  yield all([takeLatest(types.SAVE_ROUTINE_REQUEST, saveRoutine)]);
}
