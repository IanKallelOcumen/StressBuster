import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

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

/** Generated Node Admin SDK operation action function for the 'AddJournalEntry' Mutation. Allow users to execute without passing in DataConnect. */
export function addJournalEntry(dc: DataConnect, vars: AddJournalEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddJournalEntryData>>;
/** Generated Node Admin SDK operation action function for the 'AddJournalEntry' Mutation. Allow users to pass in custom DataConnect instances. */
export function addJournalEntry(vars: AddJournalEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddJournalEntryData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateJournalEntry' Mutation. Allow users to execute without passing in DataConnect. */
export function updateJournalEntry(dc: DataConnect, vars: UpdateJournalEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateJournalEntryData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateJournalEntry' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateJournalEntry(vars: UpdateJournalEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateJournalEntryData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteJournalEntry' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteJournalEntry(dc: DataConnect, vars: DeleteJournalEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteJournalEntryData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteJournalEntry' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteJournalEntry(vars: DeleteJournalEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteJournalEntryData>>;

/** Generated Node Admin SDK operation action function for the 'AddMoodEntry' Mutation. Allow users to execute without passing in DataConnect. */
export function addMoodEntry(dc: DataConnect, vars: AddMoodEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddMoodEntryData>>;
/** Generated Node Admin SDK operation action function for the 'AddMoodEntry' Mutation. Allow users to pass in custom DataConnect instances. */
export function addMoodEntry(vars: AddMoodEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddMoodEntryData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateMoodEntry' Mutation. Allow users to execute without passing in DataConnect. */
export function updateMoodEntry(dc: DataConnect, vars: UpdateMoodEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMoodEntryData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateMoodEntry' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateMoodEntry(vars: UpdateMoodEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateMoodEntryData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteMoodEntry' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteMoodEntry(dc: DataConnect, vars: DeleteMoodEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMoodEntryData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteMoodEntry' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteMoodEntry(vars: DeleteMoodEntryVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeleteMoodEntryData>>;

/** Generated Node Admin SDK operation action function for the 'AddMeditationSessionCustom' Mutation. Allow users to execute without passing in DataConnect. */
export function addMeditationSessionCustom(dc: DataConnect, vars: AddMeditationSessionCustomVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddMeditationSessionCustomData>>;
/** Generated Node Admin SDK operation action function for the 'AddMeditationSessionCustom' Mutation. Allow users to pass in custom DataConnect instances. */
export function addMeditationSessionCustom(vars: AddMeditationSessionCustomVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddMeditationSessionCustomData>>;

/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createUser(dc: DataConnect, vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createUser(vars: CreateUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateUserData>>;

/** Generated Node Admin SDK operation action function for the 'GetMyJournalEntries' Query. Allow users to execute without passing in DataConnect. */
export function getMyJournalEntries(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyJournalEntriesData>>;
/** Generated Node Admin SDK operation action function for the 'GetMyJournalEntries' Query. Allow users to pass in custom DataConnect instances. */
export function getMyJournalEntries(options?: OperationOptions): Promise<ExecuteOperationResponse<GetMyJournalEntriesData>>;

/** Generated Node Admin SDK operation action function for the 'AddMeditationSession' Mutation. Allow users to execute without passing in DataConnect. */
export function addMeditationSession(dc: DataConnect, vars: AddMeditationSessionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddMeditationSessionData>>;
/** Generated Node Admin SDK operation action function for the 'AddMeditationSession' Mutation. Allow users to pass in custom DataConnect instances. */
export function addMeditationSession(vars: AddMeditationSessionVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddMeditationSessionData>>;

/** Generated Node Admin SDK operation action function for the 'ListSoundscapes' Query. Allow users to execute without passing in DataConnect. */
export function listSoundscapes(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListSoundscapesData>>;
/** Generated Node Admin SDK operation action function for the 'ListSoundscapes' Query. Allow users to pass in custom DataConnect instances. */
export function listSoundscapes(options?: OperationOptions): Promise<ExecuteOperationResponse<ListSoundscapesData>>;

