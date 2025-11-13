import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Register a new user. Either email or phoneNumber should be provided.
   */
  async register(dto: RegisterDto): Promise<Partial<User>> {
    if (!dto.email && !dto.phoneNumber) {
      throw new BadRequestException('Either email or phoneNumber must be provided');
    }

    // check existing by email or phone
    if (dto.email) {
      const exists = await this.userRepo.findOne({ where: { email: dto.email } });
      if (exists) throw new BadRequestException('User with this email already exists');
    }

    if (dto.phoneNumber) {
      const exists = await this.userRepo.findOne({ where: { phoneNumber: dto.phoneNumber } });
      if (exists) throw new BadRequestException('User with this phone number already exists');
    }

    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email ?? null,
      phoneNumber: dto.phoneNumber ?? null,
      password: await this.hashPassword(dto.password),
      // default role (adjust as needed)
      role: typeof (User as any).Role === 'undefined' ? 'customer' : (User as any).Role?.CUSTOMER ?? 'customer',
    } as Partial<User>);

    const saved = await this.userRepo.save(user);
    // don't return password to caller
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = saved as any;
    return rest;
  }

  /**
   * Validate a user by email/phone + password.
   * Returns the user (without password) if valid, otherwise throws UnauthorizedException.
   */
  async validateUser(identifier: { email?: string; phoneNumber?: string }, password: string): Promise<Partial<User>> {
    const where = identifier.email ? { email: identifier.email } : { phoneNumber: identifier.phoneNumber };
    const user = await this.userRepo.findOne({ where });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await this.comparePassword(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    // remove password field
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user as any;
    return rest;
  }

  /**
   * Login: returns access token (no refresh tokens)
   */
  async login(dto: LoginDto): Promise<{ access_token: string; user: Partial<User> }> {
    if (!dto.email && !dto.phoneNumber) {
      throw new BadRequestException('Either email or phoneNumber must be provided');
    }
    const user = await this.validateUser({ email: dto.email, phoneNumber: dto.phoneNumber }, dto.password);

    const payload = { sub: (user as any).id, email: (user as any).email, role: (user as any).role };
    const access_token = this.jwtService.sign(payload);

    return { access_token, user };
  }
}
