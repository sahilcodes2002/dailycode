import { atom } from 'recoil';
import { loadRecoilState, saveRecoilState } from '../recoilPersistence'

const USER_INFO_KEY = 'userinfo';

export const info = atom({
  key: 'info',
  default: loadRecoilState(USER_INFO_KEY, {
    name: '',
    username: '',
    id: ''
  }),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(newState => {
        saveRecoilState(USER_INFO_KEY, newState);
      });
    },
  ],
});
