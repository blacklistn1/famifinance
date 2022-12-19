import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    return 'hi';
  },
);
