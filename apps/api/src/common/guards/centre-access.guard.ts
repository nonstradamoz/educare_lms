import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CentreAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    // In our routes, we expect `centreId` to be passed as a param or body or query.
    // E.g., /api/centres/:centreId/students
    const targetCentreId = request.params.centreId || request.body.centreId || request.query.centreId;

    if (!user) {
      return false;
    }

    // Super Admin bypasses centre check
    if (user.role?.name === 'SUPER_ADMIN') {
      return true;
    }

    if (!targetCentreId) {
      // If no centreId is provided in the request, we can't verify access.
      // Depending on the endpoint, this could either be allowed or forbidden.
      // For strict isolation, we forbid unless explicitly handled otherwise.
      throw new ForbiddenException('Centre context is missing from the request');
    }

    const hasAccess = user.userCentres?.some(
      (uc: any) => uc.centreId === targetCentreId
    );

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this centre');
    }

    return true;
  }
}
