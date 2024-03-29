import { 
    ExecutionContext,
    Injectable,
    UnauthorizedException, 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SocketAuthGuard extends AuthGuard('socket') {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        // console.log(context);
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        // console.log(user);
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
