import { Result } from '../../application';
import { DependencyError, NotFoundError, ValidationError } from '../error';

export interface Entity<ID> {
  id: ID;
}

export interface IFindById<T extends Entity<ID>, ID> {
  findById(id: ID): Promise<Result<T, DependencyError | NotFoundError>>;
}

export interface IFindAll<T extends Entity<ID>, ID> {
  findAll(): Promise<Result<T[], DependencyError>>;
}

export interface ISave<T extends Entity<ID>, ID> {
  save(entity: T): Promise<Result<T, DependencyError | ValidationError>>;
}

export interface IDelete<ID> {
  delete(id: ID): Promise<Result<void, DependencyError | NotFoundError>>;
}

export interface IRepository<T extends Entity<ID>, ID, E = string>
  extends IFindById<T, ID>,
    IFindAll<T, ID>,
    ISave<T, ID>,
    IDelete<ID> {}
