import { AsyncStorage } from "react-native";
import { all, takeLatest, call, put } from "redux-saga/effects";

import { navigate } from "~/services/navigator";
import * as apiConfig from "~/services/apiConfig";

import {
  Creators as PofileActions,
  Types as ProfileTypes
} from "../ducks/profile";
import {
  Creators as PreferencesActions,
  Types as PreferencesTypes
} from "../ducks/preferences";
import {
  Creators as MeetupActions,
  Types as MeetupTypes
} from "../ducks/meetup";
import {
  Creators as MeetupsActions,
  Types as MeetupsTypes
} from "../ducks/meetups";

// export const getUserFromState = state => state.preferences;
function ValidaErro(err) {
  let msgErr = "";
  if (err.response) {
    if (err.response.status === 400) {
      msgErr = err.response.data[0].message;
    } else if (err.response.status === 401) {
      msgErr = "Dados não confere!.";
    }
  } else {
    msgErr = "Erro no servidor!.";
  }
  return msgErr;
}

function* login(action) {
  try {
    const data = yield call(apiConfig.login, action.params);
    yield put(PofileActions.loginSuccess(action.params));
    yield AsyncStorage.setItem("@MeetupApp:token", data.data.token);
    navigate("Dashboard");
  } catch (err) {
    yield put({
      type: "LOGIN_FAILURE",
      payload: {
        msgError: ValidaErro(err)
      }
    });
  }
}
function* signUp(action) {
  try {
    const response = yield call(apiConfig.signup, action.params);
    yield put(PofileActions.signUpSuccess(action.params));
    const data = yield call(apiConfig.login, action.params);
    yield AsyncStorage.setItem("@MeetupApp:token", data.data.token);
    navigate("Preferences");
  } catch (err) {
    yield put({
      type: "SIGNUP_FAILURE",
      payload: {
        error: true,
        loading: false,
        msgError: ValidaErro(err)
      }
    });
  }
}

function* profileUpdate(action) {
  try {
    const response = yield call(apiConfig.profileUpdate, action.params);
    yield put(PofileActions.profileUpdateSuccess());

    const meetupsRecommendeds = yield call(apiConfig.meetupsRecommendeds, {
      id: 1
    });
    yield put(
      MeetupsActions.meetupsRecommendedSuccess(meetupsRecommendeds.data)
    );
  } catch (err) {
    yield put({
      type: "PROFILE_UPDATE_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* profileCreate(action) {
  try {
    const response = yield call(apiConfig.profileCreate, action.params);
    yield put(PofileActions.profileCreateSuccess(action.params));
    navigate("Dashboard");
  } catch (err) {
    yield put({
      type: "PROFILE_CREATE_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
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
    yield put({
      type: "PROFILE_SHOW_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* meetupShow(action) {
  try {
    const data = yield call(apiConfig.meetupShow, action.params);
    yield put(MeetupActions.meetupShowSuccess(data.data));
    navigate("Meetup", { title: data.data.meetup.title || "" });
  } catch (err) {
    yield put({
      type: "MEETUP_SHOW_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* fileCreate(action) {
  try {
    const response = yield call(apiConfig.fileCreate, action.params);
    yield put(MeetupActions.fileuploadSuccess(response.data));
  } catch (err) {
    yield put({
      type: "FILE_UPLOAD_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* meetupCreate(action) {
  try {
    const response = yield call(
      apiConfig.fileCreate,
      action.params.imageMeetup
    );
    const newMeetup = {
      image: response.data,
      ...action.params
    };

    const data = yield call(apiConfig.meetupCreate, newMeetup);
    yield put(MeetupActions.meetupCreateSuccess(data.data));

    const newMeetups = yield call(apiConfig.meetupsUnsigneds, { id: 1 });
    yield put(MeetupsActions.meetupsUnsignedsSuccess(newMeetups.data));

    navigate("Dashboard");
  } catch (err) {
    yield put({
      type: "MEETUP_CREATE_FAILURE",
      payload: {
        msgError: ValidaErro(err)
      }
    });
  }
}
function* meetupSubscription(action) {
  try {
    const response = yield call(apiConfig.subscription, action.params);
    yield put(MeetupActions.meetupSubscriptionSuccess(response.data));

    const meetupsSigneds = yield call(apiConfig.meetupsSigneds, {
      id: 1
    });
    yield put(MeetupsActions.meetupsSignedsSuccess(meetupsSigneds.data));

    const meetupsUnsigneds = yield call(apiConfig.meetupsUnsigneds, {
      id: 1
    });
    yield put(MeetupsActions.meetupsUnsignedsSuccess(meetupsUnsigneds.data));

    const meetupsRecommendeds = yield call(apiConfig.meetupsRecommendeds, {
      id: 1
    });
    yield put(
      MeetupsActions.meetupsRecommendedSuccess(meetupsRecommendeds.data)
    );
  } catch (err) {
    yield put({
      type: "MEETUP_SUBSCRIPTION_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* loadMeetupsSigneds(action) {
  try {
    const response = yield call(apiConfig.meetupsSigneds, action.params);
    yield put(MeetupsActions.meetupsSignedsSuccess(response.data));
  } catch (err) {
    console.tron.log(err);
    yield put({
      type: "MEETUPS_SIGNEDS_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* loadMeetupsUnsigneds(action) {
  try {
    const response = yield call(apiConfig.meetupsUnsigneds, action.params);
    yield put(MeetupsActions.meetupsUnsignedsSuccess(response.data));
  } catch (err) {
    yield put({
      type: "MEETUPS_UNSIGNEDS_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* loadMeetupsRecommededs(action) {
  try {
    const response = yield call(apiConfig.meetupsRecommendeds, action.params);
    yield put(MeetupsActions.meetupsRecommendedSuccess(response.data));
  } catch (err) {
    yield put({
      type: "MEETUPS_RECOMMENDEDS_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* loadPreferences() {
  try {
    const response = yield call(apiConfig.preferences);

    yield put(PreferencesActions.preferencesSuccess(response.data));
  } catch (err) {
    yield put({
      type: "PREFERENCES_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}
function* loadMeetupsFilter(action) {
  try {
    const response = yield call(apiConfig.meetupsFilter, action.params);
    yield put(MeetupsActions.meetupsFilterSuccess(response.data));
  } catch (err) {
    yield put({
      type: "MEETUPS_RECOMMENDEDS_FAILURE",
      payload: { msgError: ValidaErro(err) }
    });
  }
}

export default function* sagaRoot() {
  yield all([
    takeLatest(ProfileTypes.LOGIN_REQUEST, login),
    takeLatest(ProfileTypes.SIGNUP_REQUEST, signUp),
    takeLatest(ProfileTypes.PROFILE_CREATE_REQUEST, profileCreate),
    takeLatest(ProfileTypes.PROFILE_SHOW_REQUEST, profileShow),
    takeLatest(ProfileTypes.PROFILE_UPDATE_REQUEST, profileUpdate),

    takeLatest(MeetupsTypes.MEETUPS_SIGNEDS_REQUEST, loadMeetupsSigneds),
    takeLatest(MeetupsTypes.MEETUPS_UNSIGNEDS_REQUEST, loadMeetupsUnsigneds),
    takeLatest(
      MeetupsTypes.MEETUPS_RECOMMENDEDS_REQUEST,
      loadMeetupsRecommededs
    ),
    takeLatest(MeetupsTypes.MEETUPS_FILTER_REQUEST, loadMeetupsFilter),

    takeLatest(PreferencesTypes.PREFERENCES_REQUEST, loadPreferences),

    takeLatest(MeetupTypes.MEETUP_SHOW_REQUEST, meetupShow),
    takeLatest(MeetupTypes.MEETUP_SUBSCRIPTION_REQUEST, meetupSubscription),
    takeLatest(MeetupTypes.MEETUP_CREATE_REQUEST, meetupCreate),
    takeLatest(MeetupTypes.FILE_UPLOAD_REQUEST, fileCreate)
  ]);
}
