import * as mongoose from 'mongoose';
import { providersOpt } from 'src/configs/providers.config';

export const databaseProviders = [
  {
    provide: providersOpt['DATABASE_CONNECTION'],
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}.mongodb.net/`,
      ),
  },
];
