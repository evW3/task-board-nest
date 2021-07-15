import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    createToken(userId: number): string {
        return this.jwtService.sign({ userId });
    }

    createRecoverToken(userId: number, codeId: number): string {
        return this.jwtService.sign({ id: userId, codeId });
    }

    decryptToken(token: string) {
        try {
            const params = this.jwtService.verify(token);
            delete params.iat;
            delete params.exp;
            return { ...params };
        } catch (e) {}
    }
}