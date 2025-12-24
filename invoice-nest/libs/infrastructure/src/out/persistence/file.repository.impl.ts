/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { File } from '@app/domain/models/file.model';
import { FileRepository } from '@app/domain/repositories/file.repository';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class FileRepositoryImpl implements FileRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async save(file: File, trx?: Knex.Transaction): Promise<File> {
    const db = trx || this.knex;
    const [saved] = await db('files')
      .insert({
        name: file.name,
        path: file.path,
        type: file.type,
        created_at: file.createdAt,
        updated_at: file.updatedAt,
      })
      .returning('*');

    return File.rehydrate({
      id: saved.id as string,
      name: saved.name as string,
      path: saved.path as string,
      type: saved.type as string,
      createdAt: new Date(saved.created_at),
      updatedAt: new Date(saved.updated_at),
    });
  }

  async findById(id: string): Promise<File | null> {
    const result = await this.knex('files').where({ id }).first();

    if (!result) {
      return null;
    }

    return File.rehydrate({
      id: result.id as string,
      name: result.name as string,
      path: result.path as string,
      type: result.type as string,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    });
  }

  async findAll(): Promise<File[]> {
    const results = await this.knex('files').select('*');

    return results.map((result) =>
      File.rehydrate({
        id: result.id,
        name: result.name,
        path: result.path,
        type: result.type,
        createdAt: new Date(result.created_at),
        updatedAt: new Date(result.updated_at),
      }),
    );
  }

  async delete(id: string): Promise<void> {
    await this.knex('files').where({ id }).del();
  }
}
