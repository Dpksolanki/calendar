// "use server"

// import { ZodError } from "zod";
// import prisma from "./lib/db";
// import { requireUser } from "./lib/hook";
// import { OnboardingSchemaValidation } from "./lib/zodSchemas";
// import { redirect } from "next/navigation";

// // Convert FormData to a plain object
// function formDataToObject(formData: FormData) {
//     const data: { [key: string]: string } = {};
//     formData.forEach((value, key) => {
//         data[key] = value.toString(); // Convert each value to string
//     });
//     return data;
// }

// export async function OnboardingAction(prevstate: unknown, formData: FormData) {
//     const session = await requireUser();
//     const formObject = formDataToObject(formData);
//     // Check if userName is defined before proceeding
//     if (!formObject.userName) {
//         console.error("Error: userName is undefined");
//         return {
//             status: 'error',
//             message: 'userName is required.',
//         };
//     }

//     try {
//          await OnboardingSchemaValidation({
//             isUsernameUnique: async () => {
//                 const username = formObject.userName; // Get the userName from formObject
//                 const existingUsername = await prisma.user.findUnique({
//                     where: {
//                         userName: username,
//                     },
//                 });
//                 return !existingUsername;
//             },
//         }).parseAsync(formObject);


//         const data = await prisma.user.update({
//             where: {
//                 id: session?.user?.id,
//             },
//             data: {
//                 userName: formObject.userName,
//                 name: formObject.fullName,
//             },
//         });

        

//         return data;
//     } catch (error) {
//         console.error("Error:", error); // Log error details
//         if (error instanceof ZodError) {
//             return {
//                 status: 'error',
//                 errors: error.errors,
//             };
//         }
//         return {
//             status: 'error',
//             message: error?.message || 'Something went wrong.',
//         };
//     }

//      return redirect("/onboarding/grant-id")
// }


"use server"

// import { ZodError } from "zod";
import prisma from "./lib/db";
import { requireUser } from "./lib/hook";
import { OnboardingSchemaValidation } from "./lib/zodSchemas";
import { redirect } from "next/navigation";

// Convert FormData to a plain object
function formDataToObject(formData: FormData) {
    const data: { [key: string]: string } = {};
    formData.forEach((value, key) => {
        data[key] = value.toString(); // Convert each value to string
    });
    return data;
}

export async function OnboardingAction(prevstate: unknown, formData: FormData) {
    const session = await requireUser();
    const formObject = formDataToObject(formData);

    // Check if userName is defined before proceeding
    if (!formObject.userName) {
        console.error("Error: userName is undefined");
        return {
            status: 'error',
            message: 'userName is required.',
        };
    }

    await OnboardingSchemaValidation({
        isUsernameUnique: async () => {
            const username = formObject.userName; // Get the userName from formObject
            const existingUsername = await prisma.user.findUnique({
                where: {
                    userName: username,
                },
            });
            return !existingUsername;
        },
    }).parseAsync(formObject);

    await prisma.user.update({
        where: {
            id: session?.user?.id,
        },
        data: {
            userName: formObject.userName,
            name: formObject.fullName,
        },
    });

    return redirect("/onboarding/grant-id");
}


