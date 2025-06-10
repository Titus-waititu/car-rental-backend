import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Bycrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import 'dotenv/config'; 


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly MailService: MailService,
  ) {}

  private async getTokens(userId: number, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          role: role,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
          role: role,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  private async hashData(data: string): Promise<string> {
    const salt = await Bycrypt.genSalt(10);
    return await Bycrypt.hash(data, salt);
  }

  // Helper method to remove password from profile
  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepository.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async signIn(createAuthDto: CreateAuthDto) {
    const foundUser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
      select: ['user_id', 'email', 'password', 'role'],
    });
    if (!foundUser) {
      throw new NotFoundException(
        `User with email ${createAuthDto.email} not found`,
      );
    }
    const foundPassword = await Bycrypt.compare(
      createAuthDto.password,
      foundUser.password,
    );
    if (!foundPassword) {
      throw new NotFoundException('Invalid credentials');
    }
    // if user generate tokens
    const { accessToken, refreshToken } = await this.getTokens(
      foundUser.user_id,
      foundUser.email,
      foundUser.role,
    );

    // save refresh token in the db
    await this.saveRefreshToken(foundUser.user_id, refreshToken);
    // return the tokens with user 
    return {
       user: {
        user_id: foundUser.user_id,
        email: foundUser.email,
        role: foundUser.role,
      },
      accessToken,
      refreshToken,
     
    };
  }

  
  async signOut(userId: string) {
    // set user refresh token to null
    const res = await this.userRepository.update(userId, {
      hashedRefreshToken: null,
    });

    if (res.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return { message: `User with id : ${userId} signed out successfully` };
  }

  // Method to refresh tokens
  async refreshTokens(id: number, refreshToken: string) {
    // get user
    const foundUser = await this.userRepository.findOne({
      where: { user_id: id },
      select: ['user_id', 'email', 'hashedRefreshToken', 'role'],
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!foundUser.hashedRefreshToken) {
      throw new NotFoundException('No refresh token found');
    }

    // check if the refresh token is valid
    const refreshTokenMatches = await Bycrypt.compare(
      refreshToken,
      foundUser.hashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new NotFoundException('Invalid refresh token');
    }
    // generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = await this.getTokens(
      foundUser.user_id,
      foundUser.email,
      foundUser.role,
    );
    // save new refresh token in the database
    await this.saveRefreshToken(foundUser.user_id, newRefreshToken);
    // return the new tokens
    return { accessToken, refreshToken: newRefreshToken };
  }


  async generateResetToken(userId: number) {
    return this.jwtService.sign(
      { userId },
      { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: '1h' },
    );
  }

  async sendResetEmail(email: string, token: string) {
  const resetLink = `http://localhost:8000/api/v1/auth/reset-password`; // POST endpoint
  const subject = 'Reset Your Password';
  const text = `To reset your password, please send a POST request to the following URL:\n\n${resetLink}\n\nInclude the token in the request body as follows:\n\n{"token": "${token}", "newPassword": "<your_new_password>"}`;
  const html = `<p>To reset your password, please send a POST request to the following URL:</p><p><a href="${resetLink}">${resetLink}</a></p>`;
  
  await this.MailService.sendMail({
    to: email,
    subject: subject,
    text: text,
    html: html,
  });
  
  return `Reset password email sent to ${email}`;
}


  async verifyResetToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret:this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
     const decodedEmail =  decoded.email; 
     const user = await this.userRepository.findOne({
        where: { email: decodedEmail },
        select: ['user_id'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user.user_id;
    } catch (error) {
      return null;
    }
  }

  async updateUserPassword(userId: number, newPassword: string) {
    const hashedPassword = await Bycrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<string> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['email'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const token = await this.generateResetToken(user.user_id);
    await this.sendResetEmail(email, token);
    return `Reset password link sent to ${email}`;
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<string> {
    const { token, newPassword,confirmPassword } = resetPasswordDto;
    if (newPassword !== confirmPassword) {
      throw new NotFoundException('Passwords do not match');
    }
    const userId = await this.verifyResetToken(token);
    // console.log(userId)
    if (!userId) {
      throw new NotFoundException('Invalid or expired reset token');
    }
    await this.updateUserPassword(userId, newPassword);
    return 'Password has been reset successfully';
}

}
