import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  CauseSubmission: a.model({
    name: a.string().required(),
    category: a.string().required(),
    location: a.string().required(),
    targetAmount: a.float().required(),
    urgency: a.enum(['Low', 'Medium', 'High']),
    beneficiary: a.string(),
    description: a.string().required(),
    registrationNumber: a.string().required(),
    documentName: a.string(),
    supportingDocumentKey: a.string(),
    collectorEmail: a.string(),
    collectorName: a.string(),
    raisedAmount: a.float(),
    status: a.enum(['PENDING', 'VERIFIED', 'REJECTED']),
    adminNote: a.string(),
  }).authorization(allow => [
    allow.groups(['admin']),
    allow.groups(['collector']).to(['create']),
    allow.owner().to(['read']),
  ]),

  Campaign: a.model({
    causeSubmissionId: a.string(),
    name: a.string().required(),
    category: a.string().required(),
    location: a.string().required(),
    targetAmount: a.float().required(),
    urgency: a.enum(['Low', 'Medium', 'High']),
    beneficiary: a.string(),
    description: a.string().required(),
    raisedAmount: a.float(),
    supportingDocumentKey: a.string(),
  }).authorization(allow => [
    allow.groups(['admin']),
    allow.authenticated().to(['read']),
  ]),

  Donation: a.model({
    campaignId: a.string().required(),
    causeName: a.string().required(),
    category: a.string(),
    amount: a.float().required(),
    donationDate: a.string().required(),
    note: a.string(),
  }).authorization(allow => [
    allow.groups(['admin']),
    allow.groups(['donor']).to(['create']),
    allow.owner().to(['read']),
  ]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({ schema });
