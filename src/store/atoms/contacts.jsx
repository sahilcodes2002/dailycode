import { atom } from "recoil";
import { loadRecoilState, saveRecoilState } from '../recoilPersistence';


export const contacts = atom({
    key:"contacts",
   default:[] 
}) 

// export const allusers = atom({
//     key:"allusers",
//    default:[] 
// })

const ALL_USERS_KEY = 'allusers';

export const allusers = atom({
  key: 'allusers',
  default: loadRecoilState(ALL_USERS_KEY, []),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(newState => {
        saveRecoilState(ALL_USERS_KEY, newState);
      });
    },
  ],
});


export const userDetails = atom({
    key:"userDetails",
   default:{} 
})







