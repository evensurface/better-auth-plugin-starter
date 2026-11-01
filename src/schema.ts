/**
 * Adds the normalized email domain to Better Auth's user model.
 *
 * Existing Better Auth installations can adopt the plugin without a failing
 * non-null migration. New users always receive a value through the database
 * hook; existing users can be backfilled at the application's pace.
 */
export const emailDomainAllowlistSchema = {
  user: {
    fields: {
      emailDomain: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
    },
  },
} as const;
