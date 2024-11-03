import { Result } from '../../application';

export interface IDataSourceConnection {
  connect(): Promise<Result<void, Error>>;
  disconnect(): Promise<Result<void, Error>>;
  isConnected(): boolean;
}
