const webpush = require('web-push');
const vapidKeys = webpush.generateVAPIDKeys();
console.log('=======================================');
console.log('Public Key (88 chars):');
console.log(vapidKeys.publicKey);
console.log('\nPrivate Key (44 chars):');
console.log(vapidKeys.privateKey);
console.log('=======================================');
console.log(`Public Key length: ${vapidKeys.publicKey.length}`);
