import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  /* This code was update in future for google auth */
  //   constructor(private readonly configService: ConfigService) {
  //     super({
  //       clientID: configService.get('111111'), // получите это из Google Cloud Console
  //       clientSecret: configService.get('22222222'), // получите это из Google Cloud Console
  //       callbackURL: 'http://localhost:3000/api/auth/google/callback', // измените это на свой callback URL
  //       scope: ['email', 'profile'],
  //     });
  //   }
  //
  //   async validate(
  //     accessToken: string,
  //     refreshToken: string,
  //     profile,
  //     done: (err: any, user: any, info?: any) => void,
  //   ): Promise<any> {
  //     const { name, emails, photos } = profile;
  //     const user = {
  //       email: emails[0].value,
  //       firstName: name.givenName,
  //       lastName: name.familyName,
  //       picture: photos[0].value,
  //       accessToken,
  //     };
  //     done(null, user);
  //   }
}
