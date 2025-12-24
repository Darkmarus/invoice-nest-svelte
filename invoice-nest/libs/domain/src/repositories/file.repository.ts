import { File } from '../models/file.model';

export abstract class FileRepository {
  abstract save(file: File, trx?: any): Promise<File>;
  abstract findById(id: string): Promise<File | null>;
  abstract findAll(): Promise<File[]>;
  abstract delete(id: string): Promise<void>;
}
