import { BasecoatCommand, InvocationContext } from '../types';

export class ContextBuilder {
  build(_command: BasecoatCommand): InvocationContext {
    throw new Error('Not implemented — see issue #481');
  }
}
