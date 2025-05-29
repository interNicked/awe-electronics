import { Card, CardHeader } from "@mui/material";
import Prisma from "@prisma/client";

export function UserCard({user}: {user: Prisma.User}){
    
    return <Card>
        <CardHeader
            title={user.email}
            subheader={`ID: ${user.id}`}
        />
    </Card>
}

export default UserCard;
