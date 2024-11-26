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

import { parseWithZod } from "@conform-to/zod";
// import { ZodError } from "zod";
import prisma from "./lib/db";
import { requireUser } from "./lib/hook";
import { OnboardingSchemaValidation, settingSchema } from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
            availability: {
                createMany: {
                  data: [
                    {
                      day: "Monday",
                      fromTime: "08:00",
                      tillTime: "18:00",
                    },
                    {
                      day: "Tuesday",
                      fromTime: "08:00",
                      tillTime: "18:00",
                    },
                    {
                      day: "Wednesday",
                      fromTime: "08:00",
                      tillTime: "18:00",
                    },
                    {
                      day: "Thursday",
                      fromTime: "08:00",
                      tillTime: "18:00",
                    },
                    {
                      day: "Friday",
                      fromTime: "08:00",
                      tillTime: "18:00",
                    },
                    {
                      day: "Saturday",
                      fromTime: "08:00",
                      tillTime: "18:00",
                    },
                    {
                      day: "Sunday",
                      fromTime: "08:00",
                      tillTime: "18:00",
                    },
                  ],
                },
              },
        },
    });

    return redirect("/onboarding/grant-id");
}

export async function SettingsAction(prevstate: unknown, formData: FormData){
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: settingSchema,
    })

    if(submission.status !== "success"){
        return submission.reply();
    }

     await prisma.user.update({
        where:{
            id: session.user?.id,
        },
        data:{
            name: submission.value.fullName,
            image:submission.value.profileImage,
        },
    });
    return redirect("/dashboard")
}

export async function updateAvailabilityAction(formData: FormData) {
    const session = await requireUser();
  
    const rawData = Object.fromEntries(formData.entries());
    const availabilityData = Object.keys(rawData)
      .filter((key) => key.startsWith("id-"))
      .map((key) => {
        const id = key.replace("id-", "");
        return {
          id,
          isActive: rawData[`isActive-${id}`] === "on",
          fromTime: rawData[`fromTime-${id}`] as string,
          tillTime: rawData[`tillTime-${id}`] as string,
        };
      });
  
    try {
      await prisma.$transaction(
        availabilityData.map((item) =>
          prisma.availability.update({
            where: { id: item.id },
            data: {
              isActive: item.isActive,
              fromTime: item.fromTime,
              tillTime: item.tillTime,
            },
          })
        )
      );
  
      revalidatePath("/dashboard/availability");
      return { status: "success", message: "Availability updated successfully" };
    } catch (error) {
      console.error("Error updating availability:", error);
      return { status: "error", message: "Failed to update availability" };
    }
}
