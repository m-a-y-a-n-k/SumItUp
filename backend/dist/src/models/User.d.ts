import { Document, Model } from "mongoose";
export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    tokens: number;
    adEligible: boolean;
    resetToken?: string;
    resetTokenExpiry?: Date;
    verificationToken?: string;
    verified: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateResetToken(): string;
    validateResetToken(token: string): boolean;
    generateVerificationToken(): string;
}
export interface IUserModel extends Model<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
}
declare const _default: IUserModel;
export default _default;
//# sourceMappingURL=User.d.ts.map