
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const SUPER_ADMIN_EMAIL = 'superadmin@thefreshhub.com';

/**
 * Cloud Function that triggers when a new Firebase user is created.
 * It checks if the user's email exists in the 'adminInvites' collection.
 * If it does, the function assigns a custom 'admin' claim to the user.
 */
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  const { uid, email } = user;

  if (!email) {
    functions.logger.log(`User ${uid} has no email, cannot process role.`);
    return null;
  }

  // The superadmin role is handled client-side via email; no special claims needed on signup.
  // This function only promotes pre-approved admins.
  if (email.toLowerCase() === SUPER_ADMIN_EMAIL) {
    functions.logger.log(`Super admin ${email} signed up. No claims assigned via this function.`);
    return null;
  }

  const inviteDocRef = admin.firestore().collection("adminInvites").doc(email.toLowerCase());

  try {
    const inviteDoc = await inviteDocRef.get();

    if (inviteDoc.exists) {
      functions.logger.log(`Admin invite found for ${email}. Setting 'admin' custom claim for user ${uid}.`);
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      functions.logger.log(`Successfully set 'admin' custom claim for user ${uid} (${email}).`);
      
      // Optional: It's safer to leave the invite for auditing. Deleting can be done in a separate job.
      // await inviteDocRef.delete();
      
      return { result: `Admin claim assigned to ${email}` };
    }

    functions.logger.log(`No admin invite found for ${email}. User will be a standard client.`);
    return null; // No invite found, do nothing.
    
  } catch (error) {
    functions.logger.error(`Error processing signup for ${email}:`, error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while processing the user's role."
    );
  }
});

/**
 * This function synchronizes role changes made in Firestore to Firebase Auth Custom Claims.
 * It ensures that if a superadmin changes a user's role in the UI, the user's
 * authentication token reflects that change, granting or revoking privileges.
 * This function will NOT affect the superadmin user.
 */
exports.onUserRoleChange = functions.firestore
  .document("users/{uid}")
  .onUpdate(async (change, context) => {
    const newUserDoc = change.after.data();
    const oldUserDoc = change.before.data();
    const uid = context.params.uid;

    // CRITICAL: Protect the superadmin from any changes by this function.
    if (newUserDoc.email === SUPER_ADMIN_EMAIL) {
      functions.logger.log(`Change detected on superadmin profile (${newUserDoc.email}). Function will not alter their claims.`);
      return null;
    }

    if (newUserDoc.role === oldUserDoc.role) {
      functions.logger.log(`Role for user ${uid} is unchanged. Exiting.`);
      return null;
    }

    functions.logger.log(
      `Role for user ${uid} changed from '${oldUserDoc.role}' to '${newUserDoc.role}'. Updating custom claims.`
    );

    try {
      let claims = {}; // Default to no claims (client role)
      if (newUserDoc.role === "admin") {
        claims = { admin: true };
      }
      
      await admin.auth().setCustomUserClaims(uid, claims);
      functions.logger.log(`Successfully updated claims for user ${uid} to reflect new role: ${newUserDoc.role}.`);

      return {
        result: `Custom claims for user ${uid} have been updated.`,
      };
    } catch (error) {
      functions.logger.error(
        `Error setting custom claims for user ${uid}:`,
        error
      );
      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while setting custom claims."
      );
    }
  });
