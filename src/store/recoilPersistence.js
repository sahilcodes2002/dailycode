// recoilPersistence.js
import { atom, RecoilRoot, useRecoilState } from 'recoil';
import { useEffect } from 'react';

// Function to load saved state from localStorage
export const loadRecoilState = (key, defaultValue) => {
  const savedState = localStorage.getItem(key);
  return savedState ? JSON.parse(savedState) : defaultValue;
};

// Function to save state to localStorage
export const saveRecoilState = (key, state) => {
  localStorage.setItem(key, JSON.stringify(state));
};
