'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  DocumentData,
} from 'firebase/firestore'; // Firestore imports
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { set } from 'mongoose';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define types
interface AuthContextType {
  createUser: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  currentUser: User | null;
  userRolesResources: DocumentData | null;
  logout: () => void;
  signupProvider: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

interface User {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRolesResources, setUserRolesResources] =
    useState<DocumentData | null>(null); // To store roles & resources
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('user') || 'null'));
    userObserver();
  }, []);

  // Register user and store role and resources
  const createUser = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser as FirebaseUser, { displayName });

      // Store role and resources in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        roles: ['user'], // Default role
      });

      router.push('/');
      toast.success('Registered Successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Login user and fetch role and resources
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Fetch user roles and resources from Firestore
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserRolesResources(docSnap.data());
      }

      router.push('/');
      toast.success('Logged In Successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Logout
  const logout = () => {
    signOut(auth);
    toast.success('Logged Out Successfully!');
  };

  // Signup with a provider
  const signupProvider = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);

      router.push('/');
      toast.success('Logged In Successfully!');

      // Fetch user roles and resources from Firestore
      console.log('userCredential', userCredential);
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserRolesResources(docSnap.data());
      } else {
        // Store role and resources in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          roles: ['user'], // Default role
        });
      }
      console.log('userRolesResources', userRolesResources);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.warn('Please check your email!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // User observer to track auth state
  const userObserver = () => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { email, displayName, photoURL } = currentUser;
        setCurrentUser({ email, displayName, photoURL });
        localStorage.setItem(
          'user',
          JSON.stringify({ email, displayName, photoURL })
        );

        // Fetch roles and resources when user logs in
        const fetchRolesResources = async () => {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserRolesResources(docSnap.data());
            localStorage.setItem(
              'user',
              JSON.stringify({
                email,
                displayName,
                photoURL,
                ...docSnap.data(),
              })
            );
          }
        };
        fetchRolesResources();
      } else {
        setCurrentUser(null);
        setUserRolesResources(null); // Reset roles and resources
        localStorage.clear();
      }
    });
  };

  const value: AuthContextType = {
    createUser,
    signIn,
    currentUser,
    userRolesResources,
    logout,
    signupProvider,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
