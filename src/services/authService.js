// authService.js
// ==========================================
// ARCHITECTURE NOTE: HIGH COHESION & LOW COUPLING
// HIGH COHESION: Manages all Firebase Google Authentication flows. It handles popup execution 
// and error unwrapping entirely internally.
// LOW COUPLING: Instead of passing back a raw Firebase `UserCredentialImpl` object, which would 
// tightly couple the UI to Firebase, it maps the response into a pure, generic JavaScript object: 
// `{ success: true, user: { name, email } }`. The UI remains ignorant of Firebase's existence.
// ==========================================
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseSetup";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        return {
            success: true,
            user: {
                name: user.displayName || "Google User",
                email: user.email
            }
        };
    } catch (error) {
        console.error("Error signing in with Google", error);
        if (error.code === 'auth/unauthorized-domain') {
            return {
                success: false,
                error: "Google Sign-In failed: The current domain is not authorized. Please add locally testing domains to Firebase console."
            };
        }
        return {
            success: false,
            error: "Google Sign-In failed. Please try again."
        };
    }
}
