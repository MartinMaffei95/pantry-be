import { Connection } from 'mongoose';
import { providersOpt } from 'src/configs/providers.config';
import { ProductSchema } from './entities/product.entity';

export const productsProviders = [
  {
    provide: providersOpt['PRODUCT_MODEL'],
    useFactory: (connection: Connection) =>
      connection.model('Product', ProductSchema),
    inject: [providersOpt['DATABASE_CONNECTION']],
  },
];
