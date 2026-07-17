import { Mission } from './types';

export const mockMissions: Mission[] = [
  { id: '1', label: 'Drink a glass of water first thing', done: true },
  { id: '2', label: 'Stretch for 5 minutes', done: true },
  { id: '3', label: 'Write 3 lines in your journal', done: false },
  { id: '4', label: 'Take a short walk outside', done: false },
];

/** Whether *all* missions were completed on each of the 6 days before today, oldest first. */
export const MOCK_PAST_ALL_MISSIONS_DONE: boolean[] = [true, true, true, false, true, true];
