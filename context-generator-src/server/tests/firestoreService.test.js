// context-generator-src/server/tests/firestoreService.test.js
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  RulesTestEnvironment,
  clearFirestoreData // Correct function for clearing data
} = require("@firebase/rules-unit-testing");
const fs = require("fs");
const path = require("path");

// Import the functions to test (assuming refactor for testability)
// This might require adjusting the service to accept a db instance.
// For now, we'll mock the interaction for logic tests and use rules testing for security.
// const firestoreService = require('../src/services/firestoreService'); // Actual service import (if refactored)

// --- Test Setup ---
let testEnv;
const PROJECT_ID = `contextforge-test-${Date.now()}`; // Unique project ID for tests
let rules;

// User IDs for testing
const USER_ID = "test-user-123";
const OTHER_USER_ID = "other-user-456";
const WIZARD_COLLECTION = "wizardResponses"; // Collection name

beforeAll(async () => {
  // Load rules once
  rules = fs.readFileSync(path.resolve(__dirname, "../../../firestore.rules"), "utf8");
  // Initialize the test environment
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules },
  });
});

afterAll(async () => {
  // Clean up the test environment
  await testEnv?.cleanup(); // Add optional chaining
});

// Clear Firestore data between tests
beforeEach(async () => {
    if (testEnv) {
      // Clear data using the project ID.
      await clearFirestoreData({ projectId: PROJECT_ID });
    }
});


// --- Mock Firestore Service Logic ---
// Mocks the *behavior* of the service functions for testing purposes.
// This doesn't test the internal service logic itself, but allows testing components that use it.
// For testing the service logic *itself*, you'd typically inject the testEnv Firestore instance
// into the real service (requires refactoring the service).
const mockFirestoreService = (dbInstance) => ({
    saveWizard: async (userId, wizardId, payload) => {
        const docId = `${userId}_${wizardId}`;
        const docRef = dbInstance.collection(WIZARD_COLLECTION).doc(docId);
        const dataToSave = {
            ...payload,
            userId,
            id: wizardId,
            createdAt: new Date(), // Use simple date for mock
            updatedAt: new Date()
         };
        await docRef.set(dataToSave, { merge: true });
        return { id: docId, ref: docRef };
    },
    listWizards: async (userId) => {
        const query = dbInstance.collection(WIZARD_COLLECTION).where('userId', '==', userId).orderBy('updatedAt', 'desc');
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
    },
    deleteWizard: async (userId, docId) => {
        // In a real test of service *logic*, verify ownership first if service does
        const docRef = dbInstance.collection(WIZARD_COLLECTION).doc(docId);
        // Check if doc belongs to user before deleting (simulating service logic)
        const docSnap = await docRef.get();
        if (docSnap.exists && docSnap.data().userId === userId) {
            await docRef.delete();
        } else if (docSnap.exists) {
            // Simulate permission denied error if needed for callers
            throw new Error('Permission denied to delete this document.');
        }
        // If doesn't exist, do nothing (or throw NotFound, depending on service spec)
    }
});

// --- Service Logic Tests (Using Mock Implementation) ---
// These tests verify the expected behavior of the mocked service functions.
describe("Firestore Service Logic (Mocked Behavior)", () => {
  let service;
  let db;
  beforeEach(() => {
    // Use an unauthenticated context for logic tests, as rules aren't applied here
    db = testEnv.unauthenticatedContext().firestore();
    service = mockFirestoreService(db);
  });

  test("saveWizard should create a document with correct data", async () => {
    const wizardId = "wiz-abc";
    const payload = { documentType: "test", title: "My Test", data: "abc" };
    const result = await service.saveWizard(USER_ID, wizardId, payload);

    expect(result.id).toBe(`${USER_ID}_${wizardId}`);

    const docSnap = await db.collection(WIZARD_COLLECTION).doc(result.id).get();
    expect(docSnap.exists).toBe(true);
    const data = docSnap.data();
    expect(data.userId).toBe(USER_ID);
    expect(data.id).toBe(wizardId);
    expect(data.documentType).toBe("test");
    expect(data.title).toBe("My Test");
    expect(data.createdAt).toBeInstanceOf(Date); // Check timestamp was added
  });

  test("listWizards should return only documents for the specified user, ordered by updatedAt desc", async () => {
    // Save in specific order to test sorting
    await service.saveWizard(USER_ID, "wiz2", { title: "User 1 Doc 2", updatedAt: new Date(Date.now() - 1000) }); // Older
    await service.saveWizard(USER_ID, "wiz1", { title: "User 1 Doc 1", updatedAt: new Date() }); // Newer
    await service.saveWizard(OTHER_USER_ID, "wiz3", { title: "User 2 Doc 1", updatedAt: new Date() });

    const user1Docs = await service.listWizards(USER_ID);
    const user2Docs = await service.listWizards(OTHER_USER_ID);

    expect(user1Docs).toHaveLength(2);
    expect(user1Docs[0].title).toBe("User 1 Doc 1"); // Newest first
    expect(user1Docs[1].title).toBe("User 1 Doc 2");
    expect(user2Docs).toHaveLength(1);
    expect(user2Docs[0].title).toBe("User 2 Doc 1");
  });

   test("deleteWizard should remove the specified document if owned", async () => {
    const result = await service.saveWizard(USER_ID, "wiz-to-delete", { title: "Delete Me" });
    const docId = result.id;

    let docSnap = await db.collection(WIZARD_COLLECTION).doc(docId).get();
    expect(docSnap.exists).toBe(true); // Verify it exists first

    await service.deleteWizard(USER_ID, docId); // User deletes own doc

    docSnap = await db.collection(WIZARD_COLLECTION).doc(docId).get();
    expect(docSnap.exists).toBe(false); // Verify it's gone
  });

  test("deleteWizard should not remove document if not owned", async () => {
    const result = await service.saveWizard(OTHER_USER_ID, "wiz-protected", { title: "Protected" });
    const docId = result.id;

    let docSnap = await db.collection(WIZARD_COLLECTION).doc(docId).get();
    expect(docSnap.exists).toBe(true); // Verify it exists

    // Attempt delete by wrong user - mock should throw or do nothing based on its logic
    await expect(service.deleteWizard(USER_ID, docId)) // USER_ID trying delete OTHER_USER_ID's doc
        .rejects.toThrow('Permission denied'); // Assert that the mock throws permission error

    docSnap = await db.collection(WIZARD_COLLECTION).doc(docId).get();
    expect(docSnap.exists).toBe(true); // Verify it still exists
  });

});

// --- Firestore Rules Tests ---
// These tests directly verify the security rules using the test environment contexts.
describe("Firestore Security Rules", () => {

  test("Unauthenticated users cannot read/write wizard responses", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const docRef = db.collection(WIZARD_COLLECTION).doc("any_doc");
    await assertFails(docRef.get());
    await assertFails(docRef.set({ data: "test" }));
  });

  test("Authenticated users can create their own wizard response with matching userId", async () => {
    const db = testEnv.authenticatedContext(USER_ID).firestore();
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${USER_ID}_wiz1`);
    // Rule requires userId field in the document to match auth UID on create
    await assertSucceeds(docRef.set({ userId: USER_ID, id: "wiz1", data: "my data" }));
  });

   test("Authenticated users CANNOT create a response with mismatched userId field", async () => {
    const db = testEnv.authenticatedContext(USER_ID).firestore();
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${USER_ID}_wiz1`);
     // Trying to create doc ${USER_ID}_wiz1 but setting internal userId to OTHER_USER_ID
    await assertFails(docRef.set({ userId: OTHER_USER_ID, id: "wiz1", data: "mismatched data" }));
  });

   test("Authenticated users CANNOT create a response where docId user doesn't match auth user", async () => {
    const db = testEnv.authenticatedContext(USER_ID).firestore();
    // Trying to create doc named OTHER_USER_ID_wiz1 while logged in as USER_ID
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${OTHER_USER_ID}_wiz1`);
    // Even if internal userId matches the docId name, the auth context doesn't match
    await assertFails(docRef.set({ userId: OTHER_USER_ID, id: "wiz1", data: "other user data" }));
  });


  test("Authenticated users can read their own wizard responses", async () => {
    // Seed data bypassing rules
    await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection(WIZARD_COLLECTION).doc(`${USER_ID}_mywiz`).set({ userId: USER_ID, data: "secret" });
    });

    const db = testEnv.authenticatedContext(USER_ID).firestore();
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${USER_ID}_mywiz`);
    await assertSucceeds(docRef.get());
  });

  test("Authenticated users CANNOT read other users' wizard responses", async () => {
     // Seed data bypassing rules
     await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection(WIZARD_COLLECTION).doc(`${OTHER_USER_ID}_theirwiz`).set({ userId: OTHER_USER_ID, data: "their secret" });
    });

    const db = testEnv.authenticatedContext(USER_ID).firestore(); // User trying to read other's doc
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${OTHER_USER_ID}_theirwiz`);
    await assertFails(docRef.get());
  });

   test("Authenticated users can update their own wizard responses (if userId isn't changed)", async () => {
     // Seed data
     await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection(WIZARD_COLLECTION).doc(`${USER_ID}_updatewiz`).set({ userId: USER_ID, data: "initial" });
    });

    const db = testEnv.authenticatedContext(USER_ID).firestore();
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${USER_ID}_updatewiz`);
    // Rule allows update if userId remains the same
    await assertSucceeds(docRef.update({ data: "updated", userId: USER_ID }));
  });

   test("Authenticated users CANNOT update the userId field", async () => {
     // Seed data
     await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection(WIZARD_COLLECTION).doc(`${USER_ID}_updatewiz`).set({ userId: USER_ID, data: "initial" });
    });

    const db = testEnv.authenticatedContext(USER_ID).firestore();
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${USER_ID}_updatewiz`);
    // Attempt to change userId field fails due to rule `request.resource.data.userId == resource.data.userId`
    await assertFails(docRef.update({ userId: OTHER_USER_ID, data: "updated" }));
   });

   test("Authenticated users CANNOT update other users' wizard responses", async () => {
     // Seed data
     await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection(WIZARD_COLLECTION).doc(`${OTHER_USER_ID}_theirwiz`).set({ userId: OTHER_USER_ID, data: "initial their" });
    });

    const db = testEnv.authenticatedContext(USER_ID).firestore(); // User trying to update other's doc
    const docRef = db.collection(WIZARD_COLLECTION).doc(`${OTHER_USER_ID}_theirwiz`);
    await assertFails(docRef.update({ data: "updated by wrong user" }));
  });

   test("Authenticated users CANNOT delete responses (based on current rule `allow delete: if false;`)", async () => {
     // Seed data
     await testEnv.withSecurityRulesDisabled(async (context) => {
        await context.firestore().collection(WIZARD_COLLECTION).doc(`${USER_ID}_deletewiz`).set({ userId: USER_ID });
        await context.firestore().collection(WIZARD_COLLECTION).doc(`${OTHER_USER_ID}_theirwiz`).set({ userId: OTHER_USER_ID });
    });

    // User trying to delete own doc
    const dbOwn = testEnv.authenticatedContext(USER_ID).firestore();
    const docRefOwn = dbOwn.collection(WIZARD_COLLECTION).doc(`${USER_ID}_deletewiz`);
    await assertFails(docRefOwn.delete());

    // User trying to delete other's doc
    const dbOther = testEnv.authenticatedContext(USER_ID).firestore();
    const docRefOther = dbOther.collection(WIZARD_COLLECTION).doc(`${OTHER_USER_ID}_theirwiz`);
    await assertFails(docRefOther.delete());
   });

    // If rules change to allow delete: `allow delete: if request.auth.uid == resource.data.userId;`
    // Then add tests like:
    // test("Authenticated users CAN delete their own responses (if rule updated)", async () => { ... assertSucceeds ... });
    // test("Authenticated users CANNOT delete other users' responses (if rule updated)", async () => { ... assertFails ... });
});

