
'use client';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  constructor(context: SecurityRuleContext) {
    const contextString = JSON.stringify(
      {
        ...context,
        // Emulate the structure of a server-side contextual error
        request: {
          resource: {
            data: context.requestResourceData,
          },
        },
      },
      null,
      2
    );

    const message = `FirestoreError: Missing or insufficient permissions: 
The following request was denied by Firestore Security Rules:
${contextString}`;

    super(message);
    this.name = 'FirestorePermissionError';
  }
}
