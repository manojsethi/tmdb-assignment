import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from '../../dtos/api_response.dto';
import { User, UserDocument } from '../users/user.schema';
import { SigninDto, SignupDto } from '../../dtos/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  generateToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(dto: SignupDto): Promise<ApiResponse> {
    try {
      const foundUserDoc = await this.userModel.findOne({ email: dto.email });
      if (foundUserDoc) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'User already existed!',
        };
      }

      await this.userModel.create(dto);

      return { status: HttpStatus.CREATED, message: 'User created!' };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `An error occurred while signing up error ${error}!`,
      };
    }
  }

  async signin(dto: SigninDto): Promise<ApiResponse> {
    try {
      const { email, password } = dto;

      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        return { status: HttpStatus.NOT_FOUND, message: 'User not found!' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid credentials!',
        };
      }
      const accessToken = this.generateToken(user._id as string);

      return {
        status: HttpStatus.OK,
        data: { accessToken, email: user.email },
      };
    } catch (error: any) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `An error occurred while signing in error ${error}!`,
      };
    }
  }
}
