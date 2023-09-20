import { api } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const seedMessages = [
  ["Ian", "Hey, glad you're here.", 0],
  
  ["Ian", "Thanks @gpt!", 5000],
] as const;

export const seed = internalMutation({
  handler: async (ctx) => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "Missing OPENAI_API_KEY in environment variables.\n" +
          "Set it in the project settings in the Convex dashboard:\n" +
          "    npx convex dashboard\n or https://dashboard.convex.dev"
      );
    }
    let totalDelay = 0;
    for (const [author, body, delay] of seedMessages) {
      totalDelay += delay;
      await ctx.scheduler.runAfter(totalDelay, api.messages.send, {
        author,
        body,
      });
    }
  },
});

export default internalMutation({
  handler: async (ctx) => {
    const anyMessage = await ctx.db.query("messages").first();
    if (anyMessage) return;
    await seed(ctx, {});
  },
});
