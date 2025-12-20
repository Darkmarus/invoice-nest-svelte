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

  async save(product: Product): Promise<Product> {
    const [saved] = await this.knex('products')
      .insert({
        name: product._name,
        stock: product._stock,
        price: product._price,
        enabled: product._enabled,
        created_at: product._created_at,
        updated_at: product._updated_at,
      })
      .returning('*');

    return Product.rehydrate({
      id: saved.id,
      name: saved.name,
      price: parseFloat(saved.price),
      stock: saved.stock,
      enabled: saved.enabled,
      created_at: new Date(saved.created_at),
      updated_at: new Date(saved.updated_at),
    });
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.knex('products').where({ id }).first();

    if (!result) {
      return null;
    }

    return Product.rehydrate({
      id: result.id,
      name: result.name,
      price: parseFloat(result.price),
      stock: result.stock,
      enabled: result.enabled,
      created_at: new Date(result.created_at),
      updated_at: new Date(result.updated_at),
    });
  }

  async findAll(): Promise<Product[]> {
    const results = await this.knex('products').select('*');

    return results.map((result) =>
      Product.rehydrate({
        id: result.id,
        name: result.name,
        price: parseFloat(result.price),
        stock: result.stock,
        enabled: result.enabled,
        created_at: new Date(result.created_at),
        updated_at: new Date(result.updated_at),
      }),
    );
  }

  async findWithFilters(
    filters: ProductFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>> {
    let query = this.knex('products');

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
        price: parseFloat(result.price),
        stock: result.stock,
        enabled: result.enabled,
        created_at: new Date(result.created_at),
        updated_at: new Date(result.updated_at),
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
      .where({ id: product._id })
      .update({
        name: product._name,
        stock: product._stock,
        price: product._price,
        enabled: product._enabled,
        updated_at,
      })
      .returning('*');

    return Product.rehydrate({
      id: updated.id,
      name: updated.name,
      price: parseFloat(updated.price),
      stock: updated.stock,
      enabled: updated.enabled,
      created_at: new Date(updated.created_at),
      updated_at: new Date(updated.updated_at),
    });
  }

  async delete(id: string): Promise<void> {
    await this.knex('products').where({ id }).del();
  }
}
