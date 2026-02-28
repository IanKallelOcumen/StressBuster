import { AddJournalEntryData, AddJournalEntryVariables, UpdateJournalEntryData, UpdateJournalEntryVariables, DeleteJournalEntryData, DeleteJournalEntryVariables, AddMoodEntryData, AddMoodEntryVariables, UpdateMoodEntryData, UpdateMoodEntryVariables, DeleteMoodEntryData, DeleteMoodEntryVariables, AddMeditationSessionCustomData, AddMeditationSessionCustomVariables, CreateUserData, CreateUserVariables, GetMyJournalEntriesData, AddMeditationSessionData, AddMeditationSessionVariables, ListSoundscapesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddJournalEntry(options?: useDataConnectMutationOptions<AddJournalEntryData, FirebaseError, AddJournalEntryVariables>): UseDataConnectMutationResult<AddJournalEntryData, AddJournalEntryVariables>;
export function useAddJournalEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddJournalEntryData, FirebaseError, AddJournalEntryVariables>): UseDataConnectMutationResult<AddJournalEntryData, AddJournalEntryVariables>;

export function useUpdateJournalEntry(options?: useDataConnectMutationOptions<UpdateJournalEntryData, FirebaseError, UpdateJournalEntryVariables>): UseDataConnectMutationResult<UpdateJournalEntryData, UpdateJournalEntryVariables>;
export function useUpdateJournalEntry(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateJournalEntryData, FirebaseError, UpdateJournalEntryVariables>): UseDataConnectMutationResult<UpdateJournalEntryData, UpdateJournalEntryVariables>;

export function useDeleteJournalEntry(options?: useDataConnectMutationOptions<DeleteJournalEntryData, FirebaseError, DeleteJournalEntryVariables>): UseDataConnectMutationResult<DeleteJournalEntryData, DeleteJournalEntryVariables>;
export function useDeleteJournalEntry(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteJournalEntryData, FirebaseError, DeleteJournalEntryVariables>): UseDataConnectMutationResult<DeleteJournalEntryData, DeleteJournalEntryVariables>;

export function useAddMoodEntry(options?: useDataConnectMutationOptions<AddMoodEntryData, FirebaseError, AddMoodEntryVariables>): UseDataConnectMutationResult<AddMoodEntryData, AddMoodEntryVariables>;
export function useAddMoodEntry(dc: DataConnect, options?: useDataConnectMutationOptions<AddMoodEntryData, FirebaseError, AddMoodEntryVariables>): UseDataConnectMutationResult<AddMoodEntryData, AddMoodEntryVariables>;

export function useUpdateMoodEntry(options?: useDataConnectMutationOptions<UpdateMoodEntryData, FirebaseError, UpdateMoodEntryVariables>): UseDataConnectMutationResult<UpdateMoodEntryData, UpdateMoodEntryVariables>;
export function useUpdateMoodEntry(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateMoodEntryData, FirebaseError, UpdateMoodEntryVariables>): UseDataConnectMutationResult<UpdateMoodEntryData, UpdateMoodEntryVariables>;

export function useDeleteMoodEntry(options?: useDataConnectMutationOptions<DeleteMoodEntryData, FirebaseError, DeleteMoodEntryVariables>): UseDataConnectMutationResult<DeleteMoodEntryData, DeleteMoodEntryVariables>;
export function useDeleteMoodEntry(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMoodEntryData, FirebaseError, DeleteMoodEntryVariables>): UseDataConnectMutationResult<DeleteMoodEntryData, DeleteMoodEntryVariables>;

export function useAddMeditationSessionCustom(options?: useDataConnectMutationOptions<AddMeditationSessionCustomData, FirebaseError, AddMeditationSessionCustomVariables>): UseDataConnectMutationResult<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;
export function useAddMeditationSessionCustom(dc: DataConnect, options?: useDataConnectMutationOptions<AddMeditationSessionCustomData, FirebaseError, AddMeditationSessionCustomVariables>): UseDataConnectMutationResult<AddMeditationSessionCustomData, AddMeditationSessionCustomVariables>;

export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useGetMyJournalEntries(options?: useDataConnectQueryOptions<GetMyJournalEntriesData>): UseDataConnectQueryResult<GetMyJournalEntriesData, undefined>;
export function useGetMyJournalEntries(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyJournalEntriesData>): UseDataConnectQueryResult<GetMyJournalEntriesData, undefined>;

export function useAddMeditationSession(options?: useDataConnectMutationOptions<AddMeditationSessionData, FirebaseError, AddMeditationSessionVariables>): UseDataConnectMutationResult<AddMeditationSessionData, AddMeditationSessionVariables>;
export function useAddMeditationSession(dc: DataConnect, options?: useDataConnectMutationOptions<AddMeditationSessionData, FirebaseError, AddMeditationSessionVariables>): UseDataConnectMutationResult<AddMeditationSessionData, AddMeditationSessionVariables>;

export function useListSoundscapes(options?: useDataConnectQueryOptions<ListSoundscapesData>): UseDataConnectQueryResult<ListSoundscapesData, undefined>;
export function useListSoundscapes(dc: DataConnect, options?: useDataConnectQueryOptions<ListSoundscapesData>): UseDataConnectQueryResult<ListSoundscapesData, undefined>;
