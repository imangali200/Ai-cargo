import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRoles } from "../db/enums/user.enum";
import { ROLES_KEY } from "../decorators/auth.decorators";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){}
    canActivate(context: ExecutionContext):boolean{
        const requiredroles =  this.reflector.getAllAndOverride<UserRoles[]>(
            ROLES_KEY,
            [context.getClass(),context.getHandler()]
        )
        if(!requiredroles || requiredroles.length === 0){
            return true
        }
        const request = context.switchToHttp().getRequest() 
        const user = request.user
        return requiredroles.includes(user.role)
    }
}