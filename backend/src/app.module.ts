import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { InvoiceModule } from './invoice/invoice.module';
import { InvoiceEntity } from './invoice/entities/invoice.entity';
import { InvoiceDetailEntity } from './invoice/entities/invoice-detail.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: parseInt(configService.get<string>('MYSQL_PORT', '3306'), 10),
        username: configService.get<string>('MYSQL_USER'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [InvoiceEntity, InvoiceDetailEntity],
        synchronize: true,
      }),
    }),
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
