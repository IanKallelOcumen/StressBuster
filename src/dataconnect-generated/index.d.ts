import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddJournalEntryData {
  journalEntry_insert: JournalEntry_Key;
}

export interface AddJournalEntryVariables {
  title: string;
  content: string;
  moodTag?: string | null;
  associatedActivity?: string | null;
}

export interface AddMeditationSessionCustomData {
  meditationSession_insert: MeditationSession_Key;
}

export interface AddMeditationSessionCustomVariables {
  durationInMinutes: number;
  meditationType?: string | null;
  notes?: string | null;
}

export interface AddMeditationSessionData {
  meditationSession_insert: MeditationSession_Key;
}

export interface AddMeditationSessionVariables {
  durationInMinutes: number;
  startTime: TimestampString;
  meditationType?: string | null;
  notes?: string | null;
}

export interface AddMoodEntryData {
  moodEntry_insert: MoodEntry_Key;
}

export interface AddMoodEntryVariables {
  moodRating: number;
  stressLevel: number;
  notes?: string | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  email: string;
  username: string;
}

export interface DeleteJournalEntryData {
  journalEntry_delete?: JournalEntry_Key | null;
}

export interface DeleteJournalEntryVariables {
  id: UUIDString;
}

export interface DeleteMoodEntryData {
  moodEntry_delete?: MoodEntry_Key | null;
}

export interface DeleteMoodEntryVariables {
  id: UUIDString;
}

export interface GetMyJournalEntriesData {
  journalEntries: ({
    id: UUIDString;
    title: string;
    content: string;
    createdAt: TimestampString;
    moodTag?: string | null;
    associatedActivity?: string | null;
  } & JournalEntry_Key)[];
}

export interface JournalEntry_Key {
  id: UUIDString;
  __typename?: 'JournalEntry_Key';
}

export interface ListSoundscapesData {
  soundscapes: ({
    id: UUIDString;
    name: string;
    category?: string | null;
    description?: string | null;
    durationInSeconds: number;
    fileUrl: string;
  } & Soundscape_Key)[];
}

export interface MeditationSession_Key {
  id: UUIDString;
  __typename?: 'MeditationSession_Key';
}

export interface MoodEntry_Key {
  id: UUIDString;
  __typename?: 'MoodEntry_Key';
}

export interface Soundscape_Key {
  id: UUIDString;
  __typename?: 'Soundscape_Key';
}

export interface UpdateJournalEntryData {
  journalEntry_update?: JournalEntry_Key | null;
}

export interface UpdateJournalEntryVariables {
  id: UUIDString;
  title?: string | null;
  content?: string | null;
  moodTag?: string | null;
  associatedActivity?: string | null;
}

export interface UpdateMoodEntryData {
  moodEntry_update?: MoodEntry_Key | null;
}

export interface UpdateMoodEntryVariables {
  id: UUIDString;
  moodRating?: number | null;
  stressLevel?: number | null;
  notes?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddJournalEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddJournalEntryVariables): MutationRef<AddJournalEntryData, AddJournalEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddJournalEntryVariables): MutationRef<AddJournalEntryData, AddJournalEntryVariables>;
  operationName: string;
}
export const addJournalEntryRef: AddJournalEntryRef;

export function addJournalEntry(vars: AddJournalEntryVariables): MutationPromise<AddJournalEntryData, AddJournalEntryVariables>;
export function addJournalEntry(dc: DataConnect, vars: AddJournalEntryVariables): MutationPromise<AddJournalEntryData, AddJournalEntryVariables>;

interface UpdateJournalEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateJournalEntryVariables): MutationRef<UpdateJournalEntryData, UpdateJournalEntryVariables>;
  operationName: string;
}
export const updateJournalEntryRef: UpdateJournalEntryRef;

export function updateJournalEntry(vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;
export function updateJournalEntry(dc: DataConnect, vars: UpdateJournalEntryVariables): MutationPromise<UpdateJournalEntryData, UpdateJournalEntryVariables>;

interface DeleteJournalEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteJournalEntryVariables): MutationRef<DeleteJournalEntryData, DeleteJournalEntryVariables>;
  operationName: string;
}
export const deleteJournalEntryRef: DeleteJournalEntryRef;

export function deleteJournalEntry(vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;
export function deleteJournalEntry(dc: DataConnect, vars: DeleteJournalEntryVariables): MutationPromise<DeleteJournalEntryData, DeleteJournalEntryVariables>;

interface AddMoodEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMoodEntryVariables): MutationRef<AddMoodEntryData, AddMoodEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddMoodEntryVariables): MutationRef<AddMoodEntryData, AddMoodEntryVariables>;
  operationName: string;
}
export const addMoodEntryRef: AddMoodEntryRef;

export function addMoodEntry(vars: AddMoodEntryVariables): MutationPromise<AddMoodEntryData, AddMoodEntryVariables>;
export function addMoodEntry(dc: DataConnect, vars: AddMoodEntryVariables): MutationPromise<AddMoodEntryData, AddMoodEntryVariables>;

interface UpdateMoodEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMoodEntryVariables): MutationRef<UpdateMoodEntryData, UpdateMoodEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMoodEntryVariables): MutationRef<UpdateMoodEntryData, UpdateMoodEntryVariables>;
  operationName: string;
}
export const updateMoodEntryRef: UpdateMoodEntryRef;

export function updateMoodEntry(vars: UpdateMoodEntryVariables): MutationPromise<UpdateMoodEntryData, UpdateMoodEntryVariables>;
export function updateMoodEntry(dc: DataConnect, vars: UpdateMoodEntryVariables): MutationPromise<UpdateMoodEntryData, UpdateMoodEntryVariables>;

interface DeleteMoodEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteMoodEntryVariables): MutationRef<DeleteMoodEntryData, DeleteMoodEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteMoodEntryVariables): MutationRef<DeleteMoodEntryData, DeleteMoodEntryVariables>;
  operationName: string;
}
export const deleteMoodEntryRef: DeleteMoodEntryRef;

export function deleteMoodEntry(vars: DeleteMoodEntryVariables): MutationPromise<DeleteMoodEntryData, DeleteMoodEntryVariables>;
export function deleteMoodEntry(dc: DataConnect, vars: DeleteMoodEntryVariables): MutationPromise<DeleteMoodEntryData, DeleteMoodEntryVariables>;

interface AddMeditationSessionCustomRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMeditationSessionCustomVariables): MutationRef<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddMeditationSessionCustomVariables): MutationRef<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;
  operationName: string;
}
export const addMeditationSessionCustomRef: AddMeditationSessionCustomRef;

export function addMeditationSessionCustom(vars: AddMeditationSessionCustomVariables): MutationPromise<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;
export function addMeditationSessionCustom(dc: DataConnect, vars: AddMeditationSessionCustomVariables): MutationPromise<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetMyJournalEntriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyJournalEntriesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyJournalEntriesData, undefined>;
  operationName: string;
}
export const getMyJournalEntriesRef: GetMyJournalEntriesRef;

export function getMyJournalEntries(): QueryPromise<GetMyJournalEntriesData, undefined>;
export function getMyJournalEntries(dc: DataConnect): QueryPromise<GetMyJournalEntriesData, undefined>;

interface AddMeditationSessionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddMeditationSessionVariables): MutationRef<AddMeditationSessionData, AddMeditationSessionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddMeditationSessionVariables): MutationRef<AddMeditationSessionData, AddMeditationSessionVariables>;
  operationName: string;
}
export const addMeditationSessionRef: AddMeditationSessionRef;

export function addMeditationSession(vars: AddMeditationSessionVariables): MutationPromise<AddMeditationSessionData, AddMeditationSessionVariables>;
export function addMeditationSession(dc: DataConnect, vars: AddMeditationSessionVariables): MutationPromise<AddMeditationSessionData, AddMeditationSessionVariables>;

interface ListSoundscapesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListSoundscapesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListSoundscapesData, undefined>;
  operationName: string;
}
export const listSoundscapesRef: ListSoundscapesRef;

export function listSoundscapes(): QueryPromise<ListSoundscapesData, undefined>;
export function listSoundscapes(dc: DataConnect): QueryPromise<ListSoundscapesData, undefined>;

