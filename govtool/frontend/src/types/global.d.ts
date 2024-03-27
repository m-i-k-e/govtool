export {};

declare global {
  type VoteType = "yes" | "no" | "abstain";

  type ActionTypeFromAPI = {
    id: string;
    type: string;
    details: string;
    expiryDate: string;
    url: string;
    metadataHash: string;
  };

  type ActionDetailsType = {
    [key: string]: string | number;
  };

  type ActionType = {
    id: string;
    type: string;
    details?: ActionDetailsType;
    expiryDate: string;
    expiryEpochNo: number;
    createdDate: string;
    createdEpochNo: number;
    url?: string;
    metadataHash?: string;
    yesVotes: number;
    noVotes: number;
    abstainVotes: number;
    index: number;
    txHash: string;
    title: string | null;
    about: string | null;
    motivation: string | null;
    rationale: string | null;
  };

  interface ActionVotedOnType extends ActionType {
    vote: VoteType;
  }

  type VotedOnDataType = {
    title: string;
    actions: ActionVotedOnType[];
  }[];

  type ToVoteDataType = {
    title: string;
    actions: ActionType[];
  }[];

  type NestedKeys<T> = T extends Record<string, unknown>
    ? {
        [K in keyof T]: T[K] extends Record<string, unknown>
          ? `${string & K}.${NestedKeys<T[K]>}`
          : string & K;
      }[keyof T]
    : never;

  type JSONValue =
    | string
    | number
    | boolean
    | null
    | { [property: string]: JSONValue }
    | JSONValue[];
}
