const cron = require('node-cron');
const User = require('../models/userModel');
const sendEmail = require('./sendEmail');

// Function to initialize the daily cron job
const initCronJob = () => {
    // Schedule a job to run daily at 7:30 PM (30 19 * * *)
    // 30 = Minute, 19 = Hour (7 PM)
    cron.schedule('30 19 * * *', async () => {
        console.log('--- [Cron Job] Starting daily check for expired fees ---');
        console.log(`Execution Time: ${new Date().toLocaleString()}`);

        try {
            // Get today's date and normalize it (start of day)
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find users where:
            // 1. toMonth is earlier than today
            // 2. isNotified is false (to avoid duplicate emails)
            const expiredUsers = await User.find({
                toMonth: { $lt: today },
                isNotified: false
            });

            console.log(`[Cron Job] Expired users found to notify: ${expiredUsers.length}`);

            // Loop through each expired user
            for (const user of expiredUsers) {
                try {
                    console.log(`Sending email to: ${user.email}...`);
                    // Send notification email
                    await sendEmail({
                        to: user.email,
                        subject: 'Fee Expired Notification',
                        text: `Hello ${user.name},\n\nYour subscription fee has expired on ${user.toMonth.toDateString()}.\nPlease renew your subscription to continue services.\n\nThank you.`
                    });

                    // Update user status so we don't notify them again tomorrow
                    user.isNotified = true;
                    await user.save();

                    console.log(`Successfully notified and updated: ${user.email}`);
                } catch (emailError) {
                    console.error(`Failed to notify ${user.email}: ${emailError.message}`);
                }
            }
            console.log('--- Cron Job Completed Successfully ---');
        } catch (error) {
            console.error(`Cron Job Error: ${error.message}`);
        }
    });

    console.log('Daily cron job scheduled.');
};

module.exports = initCronJob;
