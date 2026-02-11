import { supabase } from "@/lib/supbase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect } from "react";

type GlobalContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    session: any;
    setSession: React.Dispatch<React.SetStateAction<any>>;
    isLoading: boolean;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobalContext must be used within GlobalProvider");
    }

    return context;
}

const GlobalProvider = ({children} : {children: React.ReactNode}) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [session, setSession] = React.useState<Session | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          setIsLoggedIn(!!session);
          setIsLoading(false);
        });
      
       
        const { data: subscription } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session);
            setIsLoggedIn(!!session);
          }
        );
      
        return () => {
          subscription.subscription.unsubscribe();
        };
      }, []);

    return (
        <GlobalContext.Provider value={{isLoggedIn, setIsLoggedIn, session, setSession, isLoading}}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;