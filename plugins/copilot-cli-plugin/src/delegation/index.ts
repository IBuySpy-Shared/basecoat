import { InvocationContext, DelegationResult } from '../types';

export class AgentDelegator {
  async delegate(_context: InvocationContext): Promise<DelegationResult> {
    throw new Error('Not implemented — see issue #483');
  }
}
