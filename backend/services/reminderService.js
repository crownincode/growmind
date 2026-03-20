import nodemailer from 'nodemailer';
import supabaseClient from './supabaseClient.js';

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Schedule reminders for a plant based on care plan reminder days
 * @param {string} plantId - Plant UUID
 * @param {string} userId - User UUID
 * @param {number[]} reminderDays - Array of day numbers (e.g., [1, 3, 7, 14])
 * @param {string} plantName - Plant nickname
 * @param {string} baseDateISO - Base date in ISO format
 */
export async function scheduleReminders(plantId, userId, reminderDays, plantName, baseDateISO) {
  try {
    const baseDate = new Date(baseDateISO);
    
    const reminders = reminderDays.map(day => {
      const dueDate = new Date(baseDate);
      dueDate.setDate(dueDate.getDate() + day);
      
      return {
        plant_id: plantId,
        user_id: userId,
        due_date: dueDate.toISOString().split('T')[0], // YYYY-MM-DD format
        action: `Day ${day} - Check your ${plantName}`,
        sent: false,
      };
    });

    const { data, error } = await supabaseClient.supabase
      .from('reminders')
      .insert(reminders);

    if (error) throw error;
    
    console.log(`✅ Scheduled ${reminders.length} reminders for plant ${plantName}`);
    return data;
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    throw error;
  }
}

/**
 * Send pending reminders that are due
 */
export async function sendPendingReminders() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get all unsent reminders due today or earlier
    const { data: reminders, error } = await supabaseClient.supabase
      .from('reminders')
      .select('id, plant_id, user_id, due_date, action')
      .lte('due_date', today)
      .eq('sent', false);

    if (error) throw error;
    
    if (!reminders || reminders.length === 0) {
      console.log('📭 No pending reminders to send');
      return;
    }

    console.log(`📬 Sending ${reminders.length} pending reminders...`);

    for (const reminder of reminders) {
      try {
        // Get user's email from auth.users
        const { data: userData, error: userError } = await supabaseClient.supabase
          .from('users')
          .select('email')
          .eq('id', reminder.user_id)
          .single();

        if (userError || !userData?.email) {
          console.warn(`⚠️ Could not find email for user ${reminder.user_id}`);
          continue;
        }

        // Send email
        await transporter.sendMail({
          from: `"GrowMind 🌿" <${process.env.SMTP_USER}>`,
          to: userData.email,
          subject: '🌿 GrowMind — Time to check your plant!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #22c55e;">🌿 GrowMind Reminder</h2>
              <p>Hi there!</p>
              <p>${reminder.action}</p>
              <p style="color: #6b7280; font-size: 14px;">
                Don't forget to check on your plant and update its status in the app.
              </p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-plants" 
                 style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
                Open GrowMind
              </a>
            </div>
          `,
        });

        // Mark reminder as sent
        await supabaseClient.supabase
          .from('reminders')
          .update({ sent: true })
          .eq('id', reminder.id);

        console.log(`✅ Sent reminder ${reminder.id} to ${userData.email}`);
      } catch (err) {
        console.error(`❌ Error sending reminder ${reminder.id}:`, err);
      }
    }

    console.log('✅ All pending reminders processed');
  } catch (error) {
    console.error('Error in sendPendingReminders:', error);
    throw error;
  }
}

export default { scheduleReminders, sendPendingReminders };
