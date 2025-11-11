import { onAuthStateChanged } from "firebase/auth";
import { useState,useEffect } from "react";


export default function HomePage(){
    const[user, setUser] = useState<any>(null)

useEffect(() =>{
  const lookForLoggedInUser=onAuthStateChanged(auth, (currentUser) =>{   // built-in metheod tells us if user logged in after loginng in
    if (currentUser){
      console.log("User logged in:, currentUser.email")
      setUser(currentUser)
    } else {
      console.log("No user logged in")
      setUser(null)
    }
    


})
})
}