import { Result } from './Result';

export interface ServiceInterface<> {
  execute(context: any): Promise<Result<any>>;
}
