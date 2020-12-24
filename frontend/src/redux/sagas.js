import createSagaMiddleWare from 'redux-saga';

import authSaga from './auth/sagas';
import workoutSaga from './workout/sagas';

const sagaMiddleWare = createSagaMiddleWare();

const runSagas = () => {
  sagaMiddleWare.run(authSaga);
  sagaMiddleWare.run(workoutSaga);
};

export { sagaMiddleWare as sagas, runSagas };
