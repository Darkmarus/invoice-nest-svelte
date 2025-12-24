import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { UnitOfWork } from '@app/domain/repositories/unit-of-work.interface';

@Injectable()
export class UnitOfWorkImpl implements UnitOfWork {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async transaction<T>(
    callback: (trx: Knex.Transaction) => Promise<T>,
  ): Promise<T> {
    return this.knex.transaction(callback);
  }
}
