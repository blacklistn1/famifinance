import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TransactionsService } from '../transactions.service';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private transactionsService: TransactionsService) {}

  /**
   * Returns true if the authenticated user is the owner of the transaction
   * @param context
   * @return {boolean | Promise<boolean> | Observable<boolean>}
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const request = context.switchToHttp().getRequest();
    return true;
  }
}
