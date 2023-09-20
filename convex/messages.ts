import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";

import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const list = query({
  handler: async ({ db }): Promise<Doc<"messages">[]> => {
    // Grab the most recent messages.
    const messages = await db.query("messages").order("desc").take(5);
    // Reverse the list so that it's in chronological order.
    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async ({ db, scheduler }, { body, author }) => {
    // Send our message.
    await db.insert("messages", { body, author });

    // Check for the '@memory' command in the user's message
    if (body.indexOf("@memory") !== -1) {
      // Save the memory
      await db.insert("memories", {
        body: body.replace("@memory ", ""),
        author,
      });

      // Send a confirmation message
      await db.insert("messages", { body: "Memory saved.", author: "System" });
    }
    if (body.indexOf("@recall") !== -1) {
      try {
        // Fetch all memories
        const allMemories = await db.query("memories").order("desc").take(100);

        // Filter to get only those belonging to the current author
        const memories = allMemories.filter((m) => m.author === author);

        // Format the memories
        const formattedMemories = memories
          .map(
            (m) => `${new Date(m._creationTime).toLocaleString()}: ${m.body}`
          )
          .join("\n");

        // Insert the formattedMemories into the chat as a system message
        await db.insert("messages", {
          body: `Recalled Memories:\n${formattedMemories}`,
          author: "System",
        });
      } catch (error) {
        console.error("Error in recalling memories:", error);
      }
    }

    if (body.indexOf("@mem") !== -1) {
      // Fetch latest 10 memories and messages
      const memoryMessages = await db.query("memories").order("desc").take(10);
      const recentMessages = await db.query("messages").order("desc").take(10);

      // Combine and cast them as suggested
      type CombinedMessage = {
        _id: any;
        _creationTime: number;
        author: string;
        body: string;
      };
      const allMessages: CombinedMessage[] = [
        ...memoryMessages,
        ...recentMessages,
      ].map((msg) => {
        return {
          _id: msg._id as any,
          _creationTime: msg._creationTime,
          author: msg.author,
          body: msg.body,
        };
      });

      // Insert a message with a placeholder body.
      const messageId = await db.insert("messages", {
        author: "ChatGPT",
        body: "...",
      });

      // Schedule an action that calls ChatGPT and updates the message.
      scheduler.runAfter(0, internal.openai.chat, {
        messages: allMessages as any,
        messageId,
      });
    }

    if (body.indexOf("@gpt") !== -1) {
      // Fetch the latest n messages to send as context.
      // The default order is by creation time.
      const messages = await db.query("messages").order("desc").take(10);
      // Reverse the list so that it's in chronological order.
      messages.reverse();
      // Insert a message with a placeholder body.
      const messageId = await db.insert("messages", {
        author: "ChatGPT",
        body: "...",
      });
      // Schedule an action that calls ChatGPT and updates the message.
      scheduler.runAfter(0, internal.openai.chat, { messages, messageId });
    }
  },
});

// Updates a message with a new body.
export const update = internalMutation({
  args: { messageId: v.id("messages"), body: v.string() },
  handler: async ({ db }, { messageId, body }) => {
    await db.patch(messageId, { body });
  },
});
