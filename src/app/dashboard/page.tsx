
import { requireUser } from "../lib/hook";

export default async function DashboardPage(){
   const session = await requireUser();

   
    return(
        <div>
            <h1>Hello this is the dashboard Page</h1>
        </div>
    )
}