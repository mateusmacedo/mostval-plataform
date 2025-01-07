import { Result } from '../../application'
import { DependencyError, NotFoundError, ValidationError } from '../error'
import { BaseEntity } from '../model'

export interface IFindById<T extends BaseEntity<T, ID>, ID> {
  findById(id: ID): Promise<Result<T, DependencyError | NotFoundError>>
}

export interface IFindAll<T extends BaseEntity<T, ID>, ID> {
  findAll(): Promise<Result<T[], DependencyError>>
}

export interface ISave<T extends BaseEntity<T, ID>, ID> {
  save(entity: T): Promise<Result<T, DependencyError | ValidationError>>
}

export interface IDelete<ID> {
  delete(id: ID): Promise<Result<void, DependencyError | NotFoundError>>
}

export interface IPagination {
  page: number
  limit: number
}

export interface IPagedResult<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export interface IFindPaged<T extends BaseEntity<T, ID>, ID> {
  findPaged(pagination: IPagination): Promise<Result<IPagedResult<T>, DependencyError>>
}

export interface IRepository<T extends BaseEntity<T, ID>, ID>
  extends IFindById<T, ID>,
    IFindAll<T, ID>,
    IFindPaged<T, ID>,
    ISave<T, ID>,
    IDelete<ID> {}
