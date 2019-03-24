import { combineReducers } from 'redux';

import login from './login';
import signUp from './signUp';
import meetupsSigneds from './meetupsSigneds';
import meetupsUnsigneds from './meetupsUnsigneds';
import meetupsRecommendeds from './meetupsRecommendeds';
import profile from './profile';
import preferences from './preferences';
import meetup from './meetup';
import meetupsFilter from './meetupsFilter';
import file from './file';

export default combineReducers({
  login,
  signUp,
  meetupsSigneds,
  meetupsUnsigneds,
  meetupsRecommendeds,
  profile,
  preferences,
  meetup,
  meetupsFilter,
  file,
});
