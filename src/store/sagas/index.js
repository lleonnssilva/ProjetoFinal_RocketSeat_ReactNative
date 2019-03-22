import { AsyncStorage } from 'react-native';
import {
  all, takeLatest, call, put, select,
} from 'redux-saga/effects';
import api from '../../services/api';

import { navigate } from '../../services/navigator';
import { Creators as LoginActions, Types as LoginTypes } from '../ducks/login';
import { Creators as SignUpActions, Types as SignUpTypes } from '../ducks/signUp';
import { Creators as SignedsActions, Types as SignedsTypes } from '../ducks/meetupsSigneds';
import { Creators as UnsignedsActions, Types as UnsignedsTypes } from '../ducks/meetupsUnsigneds';
import {
  Creators as RecommendedsActions,
  Types as RecommendedsTypes,
} from '../ducks/meetupsRecommendeds';
import { Creators as PofileActions, Types as ProfileTypes } from '../ducks/profile';
import { Creators as PreferencesActions, Types as PreferencesTypes } from '../ducks/preferences';
import { Creators as MeetupActions, Types as MeetupTypes } from '../ducks/meetup';

import * as apiConfig from '../../services/apiConfig';

export const getUserFromState = state => state.preferences;
function* login(action) {
  try {
    const data = yield call(apiConfig.login, action.params);
    yield put(LoginActions.loginSuccess(action.params));
    yield AsyncStorage.setItem('@MeetupApp:token', data.data.token);
    navigate('Dashboard');
  } catch (err) {
    yield put(LoginActions.loginFailure());
  }
}
function* signUp(action) {
  try {
    const response = yield call(apiConfig.signup, action.params);
    yield put(SignUpActions.signUpSuccess(action.params));
    const data = yield call(apiConfig.login, action.params);
    yield AsyncStorage.setItem('@MeetupApp:token', data.data.token);
    navigate('Preferences');
  } catch (err) {
    yield put(SignUpActions.signUpFailure());
  }
}

function* profileUpdate(action) {
  try {
    const response = yield call(apiConfig.profileUpdate, action.params);
    yield put(PofileActions.profileUpdateSuccess(action.params));
  } catch (err) {
    yield put(PofileActions.profileUpdateFailure());
  }
}
function* profileCreate(action) {
  try {
    const response = yield call(apiConfig.profileCreate, action.params);
    yield put(PofileActions.profileCreateSuccess(action.params));
    navigate('Dashboard');
  } catch (err) {
    yield put(PofileActions.profileCreateFailure());
  }
}
function* profileShow() {
  try {
    const prefer = yield call(apiConfig.preferences);
    const { data } = yield call(apiConfig.profileShow);

    for (let i = 0; i < prefer.data.length; i++) {
      for (let j = 0; j < data[0].preferences.length; j++) {
        if (prefer.data[i].id === data[0].preferences[j].id) {
          prefer.data[i].checked = true;
        }
      }
    }
    data[0].preferences = prefer.data;
    yield put(PofileActions.profileShowSuccess(data));
  } catch (err) {
    yield put(PofileActions.profileShowFailure());
  }
}
function* meetupShow(action) {
  try {
    const data = yield call(apiConfig.meetupShow, action.params);
    // console.tron.log(data.data);
    yield put(MeetupActions.meetupShowSuccess(data.data));
  } catch (err) {
    // console.tron.log(err);
    yield put(MeetupActions.meetupShowFailure());
  }
}
function* meetupSubscription(action) {
  try {
    const data = yield call(apiConfig.subscription, action.params);
    // console.tron.log('data');
    // console.tron.log(data);
    // console.tron.log('data');
    yield put(MeetupActions.meetupSubscriptionSuccess(data.data));
  } catch (err) {
    // console.tron.log(err);
    yield put(MeetupActions.meetupShowFailure());
  }
}
function* loadMeetupsSigneds() {
  try {
    const response = yield call(apiConfig.meetupsSigneds);
    yield put(SignedsActions.meetupsSignedsSuccess(response.data));
  } catch (err) {
    yield put(SignedsActions.meetupsSignedsFailure());
  }
}
function* loadMeetupsUnsigneds() {
  try {
    const response = yield call(apiConfig.meetupsUnsigneds);
    yield put(UnsignedsActions.meetupsUnsignedsSuccess(response.data));
  } catch (err) {
    yield put(UnsignedsActions.meetupsUnsignedsFailure());
  }
}
function* loadMeetupsRecommededs() {
  try {
    const response = yield call(apiConfig.meetupsRecommendeds);
    yield put(RecommendedsActions.meetupsRecommendedSuccess(response.data));
  } catch (err) {
    yield put(RecommendedsActions.meetupsRecommendedsFailure());
  }
}
function* loadPreferences() {
  try {
    const response = yield call(apiConfig.preferences);

    yield put(PreferencesActions.preferencesSuccess(response.data));
  } catch (err) {
    yield put(PreferencesActions.preferencesFailure());
  }
}
export default function* sagaRoot() {
  yield all([
    takeLatest(LoginTypes.LOGIN_REQUEST, login),
    takeLatest(SignUpTypes.SIGNUP_REQUEST, signUp),
    takeLatest(SignedsTypes.MEETUPS_SIGNEDS_REQUEST, loadMeetupsSigneds),
    takeLatest(UnsignedsTypes.MEETUPS_UNSIGNEDS_REQUEST, loadMeetupsUnsigneds),
    takeLatest(RecommendedsTypes.MEETUPS_RECOMMENDEDS_REQUEST, loadMeetupsRecommededs),
    takeLatest(PreferencesTypes.PREFERENCES_REQUEST, loadPreferences),
    takeLatest(ProfileTypes.PROFILE_UPDATE_REQUEST, profileUpdate),
    takeLatest(ProfileTypes.PROFILE_SHOW_REQUEST, profileShow),
    takeLatest(ProfileTypes.PROFILE_CREATE_REQUEST, profileCreate),
    takeLatest(MeetupTypes.MEETUP_SHOW_REQUEST, meetupShow),
    takeLatest(MeetupTypes.MEETUP_SUBSCRIPTION_REQUEST, meetupSubscription),
  ]);
}