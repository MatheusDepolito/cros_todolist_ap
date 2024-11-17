import { z, ZodError } from 'zod';

const envSchema = z.object({
  jwt: z.object({
    secret: z.string(),
  }),
  database: z.object({
    ssl: z.boolean().optional(),
    user: z.string().optional(),
    host: z.string().optional(),
    port: z.number().optional(),
    name: z.string().optional(),
    client: z.enum(['pg', 'mssql']),
    password: z.string().optional(),
    filename: z.string().optional(),
    connectionString: z.string().optional(),
  }),
});

type EnvSchema = z.infer<typeof envSchema>;

export class EnvService {
  e: EnvSchema;

  constructor() {
    try {
      this.e = envSchema.parse({
        jwt: {
          secret: process.env.JWT_SECRET,
        },
        database: {
          ssl: process.env.DB_SSL === 'true',
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT ?? 0),
          name: process.env.DB_NAME,
          client: process.env.DB_CLIENT,
          password: process.env.DB_PASSWORD,
          filename: process.env.DB_FILENAME,
          connectionString: process.env.DB_CONNECTION_STRING,
        },
      });
    } catch (err) {
      if (err instanceof ZodError) {
        for (const error of err.errors) {
          console.log(`${error.path.join('.')}: ${error.message}`);
        }
        return;
      }

      console.log(`Another error: ${err}`);
    }
  }
}
