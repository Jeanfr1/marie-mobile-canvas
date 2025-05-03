import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { addDays, formatISO, parseISO, isWithinInterval } from "date-fns";

const REGION = process.env.AWS_REGION || "us-east-1";
const EVENTS_TABLE = process.env.EVENTS_TABLE || "GiftTracker-Events";
const NOTIFICATIONS_TABLE =
  process.env.NOTIFICATIONS_TABLE || "GiftTracker-Notifications";
const REMINDER_DAYS = parseInt(process.env.REMINDER_DAYS || "7", 10);

const ddb = new DynamoDBClient({ region: REGION });

export const handler = async () => {
  const today = new Date();
  const reminderDate = addDays(today, REMINDER_DAYS);

  // 1. Scan for upcoming events
  const eventsResult = await ddb.send(
    new ScanCommand({
      TableName: EVENTS_TABLE,
    })
  );

  const events = (eventsResult.Items || []).map((item) => ({
    eventId: item.eventId.S,
    name: item.name.S,
    date: item.date.S,
    contactIds: item.contactIds ? item.contactIds.L.map((c: any) => c.S) : [],
    notes: item.notes?.S,
  }));

  // 2. Filter events within the next REMINDER_DAYS
  const upcomingEvents = events.filter((event) => {
    const eventDate = parseISO(event.date);
    return isWithinInterval(eventDate, { start: today, end: reminderDate });
  });

  // 3. Write notifications for each event
  for (const event of upcomingEvents) {
    for (const contactId of event.contactIds) {
      const notificationId = uuidv4();
      const notification = {
        notificationId: { S: notificationId },
        eventId: { S: event.eventId },
        contactId: { S: contactId },
        message: { S: `Reminder: ${event.name} is coming up on ${event.date}` },
        date: { S: event.date },
        createdAt: { S: formatISO(new Date()) },
        read: { BOOL: false },
      };

      await ddb.send(
        new PutItemCommand({
          TableName: NOTIFICATIONS_TABLE,
          Item: notification,
        })
      );
    }
  }

  return {
    statusCode: 200,
    body: `Created ${upcomingEvents.length} event reminders.`,
  };
};
