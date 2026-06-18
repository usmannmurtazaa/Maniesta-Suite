const admin = require('firebase-admin');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseId: '(default)',
      });
    }

    // Explicitly specify the database
    const db = admin.firestore();
    
    const data = JSON.parse(event.body);
    
    // Try writing to the exports collection
    const docRef = await db.collection('exports').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docRef.id, success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message, 
        code: error.code || 'unknown',
      }),
    };
  }
};