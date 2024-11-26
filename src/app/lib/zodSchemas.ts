import { z } from "zod";
import { conformZodMessage } from '@conform-to/zod';

// Onboarding validation schema
export const onboardingSchema = z.object({
    fullName: z.string().min(4).max(70),
    userName: z.string()
        .min(4)
        .max(70)
        .regex(/^[a-zA-Z0-9-]+$/, {
            message: "UserName can only contain letters, number and -"
        })
});

// Schema with async username validation
export function OnboardingSchemaValidation(options?: {
    isUsernameUnique: () => Promise<boolean>;
}) {
    return z.object({
        userName: z
            .string()
            .min(4)
            .max(70)
            .regex(/^[a-zA-Z0-9-]+$/, {
                message: "UserName can only contain letters, number and -"
            })
            .pipe(
                z.string().superRefine((_, ctx) => {
                    if (typeof options?.isUsernameUnique !== "function") {
                        ctx.addIssue({
                            code: "custom",
                            message: conformZodMessage.VALIDATION_UNDEFINED,
                            fatal: true,
                        });
                        return;
                    }
                    return options?.isUsernameUnique().then((isUnique) => {
                        if (!isUnique) {
                            ctx.addIssue({
                                code: "custom",
                                message: "username is already used",
                            });
                        }
                    });
                })
            ),
        fullName: z.string().min(4).max(70),
    });
}

export const settingSchema = z.object({
    fullName: z.string().min(3).max(75),
    profileImage: z.string(),
})
