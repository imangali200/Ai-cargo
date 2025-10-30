import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { UserRoles } from "../db/enums/user.enum";
import { JwtAuthGuard } from "../guards/jwt_auth_guard";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { RolesGuard } from "../guards/roles.guards";

export const ROLES_KEY = 'roles'

export const Auth = (roles ?: UserRoles[])=>{
    return applyDecorators(
        SetMetadata(ROLES_KEY,roles ?? Object.values(UserRoles)),
        UseGuards(JwtAuthGuard,RolesGuard),
        ApiBearerAuth('Authorization'),
        ApiUnauthorizedResponse({description:'Unauthorized'})
    )
}