import { SetMetadata, Inject, createParamDecorator } from '@nestjs/common';

export const AccessUser = createParamDecorator((_, request: any) => {      
    
    const requestNext = request.switchToHttp().getNext()
    
    return requestNext.user
    
});

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);