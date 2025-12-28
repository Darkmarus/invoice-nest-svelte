import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class DatabaseHealthService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseHealthService.name);

  constructor(@InjectModel() private readonly knex: Knex) {}

  async onModuleInit() {
    try {
      await this.knex.raw('SELECT 1');
      this.logger.log('Database connection successful');
    } catch (error) {
      this.logger.error(`Failed to connect to database: ${error.message}`);
      throw new Error(
        `Cannot connect to PostgreSQL database at ${this.knex.client.config.connection.host}:${this.knex.client.config.connection.port}. ` +
          'Please ensure the database is running and check your .env configuration.',
      );
    }
  }
}
