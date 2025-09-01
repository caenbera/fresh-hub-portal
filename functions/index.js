
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize the Admin SDK
admin.initializeApp();

const SUPER_ADMIN_EMAIL = "superadmin@thefreshhub.com";

exports.setupSuperAdmin = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const callerUid = context.auth.uid;

  try {
    const userRecord = await admin.auth().getUser(callerUid);

    // Only the specified super admin email can call this to elevate themselves.
    if (userRecord.email !== SUPER_ADMIN_EMAIL) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "You are not authorized to perform this action."
        );
    }
    
    // Check if the user already has the claim
    if (userRecord.customClaims && userRecord.customClaims.superadmin === true) {
      return {
        message: "User is already a superadmin.",
      };
    }

    // Set the custom claim
    await admin.auth().setCustomUserClaims(callerUid, { superadmin: true });
    
    return {
      message: `Success! ${userRecord.email} has been made a superadmin.`,
    };
  } catch (error) {
    console.error("Error setting superadmin claim:", error);
    // Log the detailed error to Firebase console for debugging.
    throw new functions.https.HttpsError(
      "internal",
      "An internal error occurred while setting the superadmin role. Check the function logs for details.",
      error
    );
  }
});
