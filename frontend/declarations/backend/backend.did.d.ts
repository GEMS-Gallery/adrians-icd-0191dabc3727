import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : [number, number, number] } |
  { 'err' : string };
export type Result_1 = { 'ok' : [bigint, bigint, bigint] } |
  { 'err' : string };
export type Result_2 = { 'ok' : [bigint, bigint] } |
  { 'err' : string };
export interface _SERVICE {
  'getGovernanceData' : ActorMethod<[], Result_2>,
  'getHistoricalData' : ActorMethod<[], Array<[bigint, number, bigint]>>,
  'getNetworkStats' : ActorMethod<[], Result_1>,
  'getTokenMetrics' : ActorMethod<[], Result>,
  'updateDashboard' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
