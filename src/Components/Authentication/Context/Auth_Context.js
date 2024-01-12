import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, signInWithEmailAndPassword, signOut, updateCurrentUser, updateProfile } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { auth, database } from '../../../firebase';
import { doc, setDoc } from 'firebase/firestore';


const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}


export function AuthProvider({children}){
    const [loading,set_loading]=useState(false)
    const [error,set_error]=useState('')
    const [success,set_success]=useState('')
    const [login_error,set_login_error]=useState('')
    const [login_success,set_login_success]=useState('')

    async function createUser(email,password,name,confirm_password){
        set_loading(true)
          if(email==='' && name===''){
            set_error('Please enter your email and name')
            set_loading(false)
          }
          else if(email===''){
            set_error('Please enter your email')
            set_loading(false)
          }
          else if(name===''){
            set_error('Please enter your name')
            set_loading(false)
          }
          else if (password==='' && confirm_password === ''){
            set_error('Please Enter the password and confirm it')
            set_loading(false)
          }
          else if (password!==confirm_password){
            set_error('Password and confirm Password do not match')
            set_loading(false)
          }
          else if(password===''){
            set_error('Please Enter the Password')
            set_loading(false)
          }
          else if(confirm_password===''){
            set_error('Please Confirm your password')
            set_loading(false)
          }
        else if (email !='' && password==confirm_password && name!=''){         
        await createUserWithEmailAndPassword(auth,email,password)
        .then(async (e)=>{
           
            console.log(e)
            const docRef = doc(database,'Users',`${auth.currentUser.uid}`)
            await setDoc(docRef,{}).then(async (e)=>{
              console.log("User stored with uid")
              updateProfile(auth.currentUser,{
                displayName:name
              }).then((e)=>{
                set_loading(false)
                console.log("User name updated")
              }).catch((E)=>{
                console.log (E)
              })
            }).catch((e)=>{
              console.log(e)
            })
            set_error('')
        })
        .catch((e)=>{
            set_loading(false)
            console.log(e.message)
            set_error(e.message)
        })
        }
        else {
            set_error('Something Went Wrong')
        }
    }
    async function Login_user(email,password){
      set_loading(true)
        if(email===''){
          set_loading(false)
          set_login_error("Please enter your email")
        }
        else if(password===''){
          set_loading(false)
          set_login_error('Please enter your password')
        }
        else if(password==='' && email===''){
          set_loading(false)
          set_login_error('Please enter your email and password')
        }
        else if(password!=='' && email!=='' ){
          await signInWithEmailAndPassword(auth,email,password)
          .then((e)=>{
            set_loading(false)
            set_login_error('')
            set_login_success('Welcome To silwalk')
          })
          .catch((e)=>{
            set_loading(false)
            set_login_error(e.message) 
          })
        }
        else {
          set_login_error('Something went worng')
        }
    }
   
    async function Send_Email_verify(){
      set_loading(true)
     await sendEmailVerification(auth.currentUser)
      .then((e)=>{
        console.log("Email sent")
        console.log(e)
        set_loading(false)
      })
      .catch((e)=>{
        console.log(e)
        set_loading(false)
      })
    }

    async function Delete_signin_function(){
      await deleteUser(auth.currentUser)
      .then((e)=>{
        signOut(auth)
        .then((e)=>{
          console.log('user signout')
        })
        .catch((e)=>{
          console.log(e)
        })
      })
      .catch((e)=>{
        console.log(e)
      })
    }

    const value = {
        loading,
        error,
        success,
        login_error,
        login_success,
        createUser,
        Login_user,
        Send_Email_verify,
        Delete_signin_function,

    }

    return (
        <AuthContext.Provider value={value}>
         {children}
        </AuthContext.Provider>
    )
}