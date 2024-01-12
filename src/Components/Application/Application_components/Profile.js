import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import react from 'react';
import { auth } from '../../../firebase';
import { useNavigate } from 'react-router-dom';

function Profile(){
    const navigator = useNavigate()
    async function Handle_sign_out (){
        await signOut(auth).then((e)=>{
            window.alert("User Sign out")
            navigator('/')
        })
        .catch((e)=>{
            console.log(e)
        })
    }

    return(<div>
        <Button variant='contained' onClick={Handle_sign_out}>
            Sign Out
        </Button>
    </div>)
}
export default Profile;