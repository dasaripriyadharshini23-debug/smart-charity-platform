import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'charityDocuments',
  access: (allow) => ({
    'verification-documents/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.groups(['admin']).to(['read']),
    ],
  }),
});
