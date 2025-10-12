import { EmailOptions } from "../../types";
declare class AuthService {
    private transporter;
    constructor();
    sendResetEmail(email: string, resetToken: string): Promise<void>;
    sendVerificationEmail(email: string, verificationToken: string): Promise<void>;
    sendEmail(options: EmailOptions): Promise<void>;
}
declare const authService: AuthService;
export default authService;
//# sourceMappingURL=index.d.ts.map