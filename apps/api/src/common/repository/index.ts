import { AnyZodObject, z, ZodDefault } from 'zod';
import { DeepMerge, Prettify } from '../types/misc';
import { config } from 'dotenv';
import { withDev } from 'zod-dev';

config();

type CustomReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : undefined;

function getDefaults<Schema extends AnyZodObject>(schema: Schema) {
  const defaults: {
    [Key in keyof Schema['shape']]: Schema['shape'][Key] extends ZodDefault<Schema>
      ? undefined
      : CustomReturnType<Schema['shape'][Key]['_def']['defaultValue']>;
  } = {} as any;

  for (const key in schema.shape) {
    const value = schema.shape[key as keyof Schema['shape']]; // Use key as keyof Schema["shape"]

    if (value instanceof ZodDefault) {
      defaults[key as keyof Schema['shape']] = value._def.defaultValue();
    }
  }

  return defaults;
}

/**
 * The Model function validates and parses a received object (T) and returns merged keys of U that are present in T
 * and ignores keys that are not present in T. This mimicks the default behaviour of zod.parse() function
 */
export function Model<S extends AnyZodObject, T extends object>(
  schema: S,
  obj: T, // type to ensure that keys include keys that
) {
  const default_schema = getDefaults(schema);
  type Schema = typeof default_schema;
  type ObjSchema = typeof obj;

  const isDev = process.env.NODE_ENV !== 'production';
  const devSchema = withDev(schema, isDev);

  return devSchema.parse(obj) as Prettify<DeepMerge<Schema, ObjSchema>>;
}

/**
 * Type should be used to ensure data going into or from the repository layer is complaint to the repository db schema
 */
export type ORM<S extends z.AnyZodObject> = Prettify<z.infer<S>>;

/**
 * Type should be used to ensure going into or from the service layer is complaint to the repository db schema. For now it is equal to ORM type
 */
export type ISchema<S extends z.AnyZodObject> = Prettify<z.infer<S>>;
