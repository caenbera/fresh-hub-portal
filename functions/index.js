
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const webpush = require("web-push");

admin.initializeApp();

// Set up VAPID keys for web push.
// In a production environment, these should be stored securely as environment variables.
// For example, in Firebase Functions config:
// `firebase functions:config:set vapid.public_key="YOUR_KEY" vapid.private_key="YOUR_KEY"`
// The public key MUST match the one used in `src/lib/notifications.ts`.
const VAPID_PUBLIC_KEY = "BPhgGfH_TCI66-3o7kXQ2S2G4iO4-dJkYx9A3C2A1Z1E4W4zY2zJ4J8L4zX3w5H_k3K9J6n3L1oY8E";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
      "mailto:example@your-domain.com",
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
  );
} else {
  functions.logger.warn("VAPID_PRIVATE_KEY environment variable not set. Push notifications will not work.");
}


/**
 * Triggers when a support ticket is updated and sends a push notification
 * to the user if their ticket status has changed.
 */
exports.onSupportTicketUpdate = functions.firestore
    .document("supportTickets/{ticketId}")
    .onUpdate(async (change, context) => {
      const newValue = change.after.data();
      const previousValue = change.before.data();

      // Exit if the status hasn't changed
      if (newValue.status === previousValue.status) {
        return null;
      }

      const userId = newValue.userId;
      if (!userId) {
        functions.logger.log("No userId found on ticket, cannot send notification.");
        return null;
      }

      try {
        // Get the user's profile to find their push subscription
        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        if (!userDoc.exists) {
          functions.logger.log("User document not found:", userId);
          return null;
        }

        const userProfile = userDoc.data();
        const subscription = userProfile.pushSubscription;

        if (!subscription || !subscription.endpoint) {
          functions.logger.log("No push subscription found for user:", userId);
          return null;
        }

        const statusTranslations = {
          "new": "Nuevo",
          "in_progress": "En Progreso",
          "resolved": "Resuelto",
        };

        const notificationPayload = {
          title: "Actualización de Ticket de Soporte",
          body: `Tu ticket #${context.params.ticketId.substring(0, 6)} ha sido actualizado a: ${statusTranslations[newValue.status] || newValue.status}`,
          icon: "/icon.svg", // Public URL to an icon
          data: {
            url: `/client/support`, // URL to open when notification is clicked
          },
        };

        // Send the push notification
        await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
        functions.logger.log("Successfully sent push notification to user:", userId);
        return true;
      } catch (error) {
        functions.logger.error("Error sending push notification for user:", userId, error);

        // If the subscription is expired or invalid, remove it from the user's profile.
        if (error.statusCode === 410 || error.statusCode === 404) {
          functions.logger.log("Subscription is gone or invalid, removing from user profile.");
          return admin.firestore().collection("users").doc(userId).update({
            pushSubscription: null,
          });
        }
        return null;
      }
    });
