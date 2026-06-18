const admin = require('firebase-admin');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Initialize on first call
    if (!admin.apps.length) {
      console.log('[Function] Initializing Firebase Admin...');
      console.log('[Function] Project ID:', process.env.FIREBASE_PROJECT_ID);
      console.log('[Function] Client Email exists:', !!process.env.FIREBASE_CLIENT_EMAIL);
      console.log('[Function] Private Key exists:', !!process.env.FIREBASE_PRIVATE_KEY);
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('[Function] ✅ Firebase Admin initialized');
    }

    const db = admin.firestore();
    console.log('[Function] Firestore instance created');
    
    const data = JSON.parse(event.body);
    console.log('[Function] Writing to exports collection...');
    console.log('[Function] Data keys:', Object.keys(data));
    
    const docRef = await db.collection('exports').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log('[Function] ✅ Document written:', docRef.id);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: docRef.id, success: true }),
    };
  } catch (error) {
    console.error('[Function] ❌ Error:', error.code, error.message);
    console.error('[Function] Full error:', JSON.stringify(error, null, 2));
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error.message, 
        code: error.code || 'unknown',
        details: error.details || '',
      }),
    };
  }
};