import { getUserDetails, supabase } from "@/lib/supbase";
import { User } from "@/types";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface OnboardingData {
  is_solar: boolean;
  solar_capacity_kw: number;

}

type GlobalContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    session: any;
    setSession: React.Dispatch<React.SetStateAction<any>>;
    isLoading: boolean;
    userData: any;
    setUserData: React.Dispatch<React.SetStateAction<any>>;

    onboardingData: OnboardingData | null;
    setOnboardingData: React.Dispatch<React.SetStateAction<any>>;
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
    const [userData, setUserData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const [onboardingData, setOnboardingData] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          getUserDetails(session?.user.id!).then(userData => {
            setSession(session);
            setUserData(userData);
            setIsLoggedIn(!!session);
            setIsLoading(false);
          })
         
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
        <GlobalContext.Provider value={{isLoggedIn, setIsLoggedIn, session, setSession, isLoading, userData, setUserData, onboardingData, setOnboardingData}}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;