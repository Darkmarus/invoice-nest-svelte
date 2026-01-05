/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Product } from '@app/domain/models/product.model';
import type {
  PaginatedResult,
  PaginationParams,
  ProductFilters,
} from '@app/domain/repositories/product-filters.interface';
import { ProductRepository } from '@app/domain/repositories/product.repository';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async save(product: Product, trx?: Knex.Transaction): Promise<Product> {
    const db = trx || this.knex;
    const [saved] = await db('products')
      .insert({
        name: product.name,
        details: product.details,
        stock: product.stock,
        price: product.price,
        enabled: product.enabled,
        created_at: product.created_at,
        updated_at: product.updated_at,
        deleted_at: product.deleted_at,
      })
      .returning('*');

    return Product.rehydrate({
      id: saved.id as string,
      name: saved.name as string,
      details: saved.details as string,
      price: parseFloat(saved.price),
      stock: saved.stock as number,
      enabled: saved.enabled as boolean,
      created_at: new Date(saved.created_at),
      updated_at: new Date(saved.updated_at),
      deleted_at: saved.deleted_at ? new Date(saved.deleted_at) : null,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.knex('products')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!result) {
      return null;
    }

    return Product.rehydrate({
      id: result.id as string,
      name: result.name as string,
      details: result.details as string,
      price: parseFloat(result.price),
      stock: result.stock as number,
      enabled: result.enabled as boolean,
      created_at: new Date(result.created_at),
      updated_at: new Date(result.updated_at),
      deleted_at: result.deleted_at ? new Date(result.deleted_at) : null,
    });
  }

  async findAll(): Promise<Product[]> {
    const results = await this.knex('products')
      .select('*')
      .whereNull('deleted_at');

    return results.map((result) =>
      Product.rehydrate({
        id: result.id,
        name: result.name,
        details: result.details,
        price: parseFloat(result.price),
        stock: result.stock,
        enabled: result.enabled,
        created_at: new Date(result.created_at),
        updated_at: new Date(result.updated_at),
        deleted_at: result.deleted_at ? new Date(result.deleted_at) : null,
      }),
    );
  }

  async findWithFilters(
    filters: ProductFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>> {
    let query = this.knex('products').whereNull('deleted_at');

    // Aplicar filtros
    if (filters.name) {
      query = query.whereILike('name', `%${filters.name}%`);
    }

    if (filters.minPrice !== undefined) {
      query = query.where('price', '>=', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.where('price', '<=', filters.maxPrice);
    }

    if (filters.enabled !== undefined) {
      query = query.where('enabled', filters.enabled);
    }

    // Obtener total antes de paginar
    const countQuery = query.clone();
    const countResult = await countQuery.count('* as count').first();
    const total = countResult ? Number(countResult.count) : 0;

    // Aplicar ordenamiento
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'DESC';
    query = query.orderBy(sortBy, sortOrder);

    // Aplicar paginación
    const offset = (pagination.page - 1) * pagination.limit;
    query = query.limit(pagination.limit).offset(offset);

    const results = await query.select('*');

    const data = results.map((result) =>
      Product.rehydrate({
        id: result.id,
        name: result.name,
        details: result.details,
        price: parseFloat(result.price),
        stock: result.stock,
        enabled: result.enabled,
        created_at: new Date(result.created_at),
        updated_at: new Date(result.updated_at),
        deleted_at: result.deleted_at ? new Date(result.deleted_at) : null,
      }),
    );

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
    };
  }

  async update(product: Product): Promise<Product> {
    const updated_at = new Date();
    const [updated] = await this.knex('products')
      .where({ id: product.id })
      .whereNull('deleted_at')
      .update({
        name: product.name,
        stock: product.stock,
        details: product.details,
        price: product.price,
        enabled: product.enabled,
        updated_at,
      })
      .returning('*');

    return Product.rehydrate({
      id: updated.id as string,
      name: updated.name as string,
      details: updated.details as string,
      price: parseFloat(updated.price),
      stock: updated.stock as number,
      enabled: updated.enabled as boolean,
      created_at: new Date(updated.created_at),
      updated_at: new Date(updated.updated_at),
      deleted_at: updated.deleted_at ? new Date(updated.deleted_at) : null,
    });
  }

  async delete(id: string): Promise<void> {
    await this.knex('products')
      .where({ id })
      .whereNull('deleted_at')
      .update({ deleted_at: new Date() });
  }
}
