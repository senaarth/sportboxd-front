import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../lib/firebase";
import { FirebaseError } from "firebase/app";
import { SignUpModal } from "../components/signup-modal";
import { LoginModal } from "../components/login-modal";
import { useToast } from "../hooks/use-toast";
import { Loading } from "@/components/loading";

type AuthContextType = {
  isAuthenticated: boolean;
  handleLoginWithEmail: (email: string, password: string) => void;
  user: User | null;
  openLoginModal: () => void;
  openSignUpModal: () => void;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isSignUpOpen, setSignUpOpen] = useState<boolean>(false);
  const [isLoginOpen, setLoginOpen] = useState<boolean>(false);

  async function handleLoginWithEmail(username: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(auth, username, password);

      setUser(res.user);

      setLoginOpen(false);

      toast({ title: "Login realizado com sucesso!" });
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.message);
      }
    }
  }

  async function handleSignupWithEmail(
    username: string,
    email: string,
    password: string
  ) {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, { displayName: username });

      setUser(res.user);

      setSignUpOpen(false);

      toast({ title: "Conta criada com sucesso!" });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error.message);
      }
      toast({ title: "Erro na criação da conta." });
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error(error.message);
      }
    }
  }

  async function initializeUser(userToInitialize: User | null) {
    if (userToInitialize) setUser({ ...userToInitialize });
    else setUser(null);
    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        handleLoginWithEmail,
        openLoginModal: () => setLoginOpen(true),
        openSignUpModal: () => setSignUpOpen(true),
        handleLogout,
      }}
    >
      {isLoading ? (
        <div className="w-full h-svh flex flex-col gap-2 items-center justify-center">
          <img
            alt="Logo sportboxd, imagem com nome do site escrito"
            className="h-5"
            src="sportboxd.svg"
          />
          <Loading size="xs" />
        </div>
      ) : (
        children
      )}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setSignUpOpen(false)}
        openLoginModal={() => setLoginOpen(true)}
        onSubmit={handleSignupWithEmail}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        openSignUpModal={() => setSignUpOpen(true)}
        onSubmit={handleLoginWithEmail}
      />
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
