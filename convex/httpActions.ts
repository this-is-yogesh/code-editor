import { Webhook } from "svix";
import { httpAction } from "../convex/_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api, internal } from "./_generated/api";

export const POSTRequestFromClerk = httpAction(async (ctx, request) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Webhook Secret Missing");
  }

  //verifying the svix to see if clerk only sent the webhook
  const svix_id = request.headers.get("svix-id");
  const svix_signature = request.headers.get("svix-signature");
  const svix_timestamp = request.headers.get("svix-timestamp");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Error occured - no svix header", {
      status: 400,
    });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
    /*verify() most likely returns an object, and we want to explicitly cast (or assert) that the returned value matches the expected WebhookEvent structure.*/
    //result of wh.verify should be treated as a WebhookEvent
  } catch (e) {
    console.log(e, "Error verifying webhook");
    return new Response("Error occurence", { status: 400 });
  }

  const eventType = event.type;
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    const email = email_addresses[0].email_address;
    const name = `${first_name || ""}  ${last_name || ""}`.trim();

    try {
      //save user to db
      await ctx.runMutation(api.users.syncUser, {
        userId: id,
        email: email,
        name: name,
      });
    } catch (e) {
      console.log(e, "e");
      return new Response("Failed to save user to db", { status: 500 });
    }
  } else {
    return new Response("Event type not matched", { status: 500 });
  }
  return new Response("Webhook created successfully", { status: 200 });
});

export const POSTRequestFromLemonSqueezy = httpAction(async (ctx, request) => {
  const payloadString = await request.text();
  const signature = request.headers.get("X-Signature");

  if (!signature) {
    return new Response("Missing X-Signature header", { status: 400 });
  }

  try {
    const payload = await ctx.runAction(internal.lemonSqueezy.verifyWebhook, {
      payload: payloadString,
      signature,
    });

    if (payload.meta.event_name === "order_created") {
      const { data } = payload;

      const { success } = await ctx.runMutation(api.users.upgradeToPro, {
        email: data.attributes.user_email,
        lemonSqueezyCustomerId: data.attributes.customer_id.toString(),
        lemonSqueezyOrderId: data.id,
        amount: data.attributes.total,
      });

      if (success) {
        // optionally do anything here
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.log("Webhook error:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
});
