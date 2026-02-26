import type { FC } from "react";
import './User.css'

type UserProps = {
    id: string,
    name: string, 
    email: string
}

const User:FC<UserProps> = ({id, name, email}) => {
    return (
        <>
            <div className="user-card">
                <h3>{name}</h3>
                <h4>{email}</h4>
                <p>{id}</p>
            </div>
        </>
    );
}

export default User;