const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize the Admin SDK with necessary configuration
admin.initializeApp({
  storageBucket: "fresh-hub-portal.appspot.com",
});

exports.setupSuperAdmin = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const superAdminEmail = "superadmin@thefreshhub.com";
  const userEmail = context.auth.token.email;

  // Only the user with the specified email can call this function to elevate themselves.
  if (userEmail !== superAdminEmail) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "You are not authorized to perform this action."
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(superAdminEmail);
    await admin.auth().setCustomUserClaims(user.uid, { superadmin: true });
    return {
      message: `Success! ${superAdminEmail} has been made a superadmin.`,
    };
  } catch (error) {
    console.error("Error setting superadmin claim:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An internal error occurred while setting the superadmin role."
    );
  }
});
