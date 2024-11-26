"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "./submitButton"
// import { useForm } from "@conform-to/react"
import { useFormState } from "react-dom"
import { SettingsAction } from "../actions"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { settingSchema } from "../lib/zodSchemas"
import { useState } from "react"
import { Heading1, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UploadDropzone } from "../lib/uploadthing"
import { toast } from "sonner"

interface iAppProps{
    fullName: string;
    email: string;
    profileImage: string;
}

export function SettingsFrom({email, fullName, profileImage}: iAppProps){
    const [lastResult, action] = useFormState(SettingsAction, undefined);
    const [currentProfileImage, setCurrentProfileImage] = useState(profileImage)
    const [form, fields] = useForm({
        lastResult,

        onValidate({formData}){
            return parseWithZod(formData, {
                schema: settingSchema,
            })
        },

        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    })

    const handleDeleteImage = () => {
        setCurrentProfileImage("")
    }
return(
    <Card>
    <CardHeader>
        <CardTitle>Settings</CardTitle>
    <CardDescription>Manage your account settings!</CardDescription>
    </CardHeader>

    <form id= {form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                <Label >Full Name</Label>
                <Input 
                name={fields.fullName.name}
                key={fields.fullName.key}
                defaultValue={fullName} 
                placeholder="Deepak Solanki"/>
            </div>
            <p className="text-red-500 text-small">{fields.fullName.errors}</p>
            <div className="flex flex-col gap-y-2">
                <Label>Email</Label>
                <Input defaultValue={email} placeholder="test@test.com"/>
            </div>
            <div className="grid gap-y-5">
                <Label>Profile Image</Label>
                <input 
                type="hidden"
                name={fields.profileImage.name}
                key={fields.profileImage.key}
                value={currentProfileImage}
                />
                {currentProfileImage ? (
                   <div className="relative size-16">
                     <img 
                    src={currentProfileImage} 
                    alt= "Profile Image"
                    className="size-16 rounded-lg"
                    />
                     <Button 
                     onClick={handleDeleteImage}
                     className="absolute -top-3 -right-3" 
                     variant="destructive"
                     type="button"
                     size="icon"
                     >
                    <X className="size-4"/>
                   </Button>
                   </div>
                  
                ):(
                    <UploadDropzone onClientUploadComplete={(res) =>{
                        setCurrentProfileImage(res[0].url)
                        toast.success("Profile Image has been uploaded")
                    }}
                    onUploadError={(error)=>{
                        console.log("someThing went wrong", error)
                        toast.error(error.message)
                    }}
                    endpoint="imageUploader"/>
                )
            }
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
            </div>
        </CardContent>
        <CardFooter>
            <SubmitButton text="Save Changes"/>
        </CardFooter>
    </form>

</Card>
)
}