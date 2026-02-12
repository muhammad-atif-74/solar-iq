import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sakrycxelyehtxvxgmgl.supabase.co';
const supabaseAnonKey = 'sb_publishable_hIJLc7ZfDHflH7-_Zzwmtw_AhG0j6j8';
const supabaseProjectPassword = "solar-iq@1122"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export const createUser = async (userid: string, username: string, email: string) => {
    try {
        const { data, error } = await supabase.from('users').insert({
            username,
            email,
            status: 'active',
            userid: userid,
        })

        if (error) throw error;

        return data;
    }
    catch (err: any) {
        console.error('Error creating user:', err.message);
        throw new Error(err.message);
    }
}

export const signUp = async (username: string, email: string, password: string) => {
    try {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) throw error;

        await createUser(data.user!.id, username, email);

        return data;

    }
    catch (err: any) {
        console.error('Error signing up:', err.message);
        throw new Error(err.message);
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
    catch (err: any) {
        console.error('Error signing up:', err.message);
        throw new Error(err.message);
    }
}

export const getSession = async () => {
    try {
        const { data, error } = await supabase.auth.getSession()

        if (error) throw error;

        return data;
    }
    catch (err: any) {
        console.error('Error signing up:', err.message);
        throw new Error(err.message);
    }
}

export const getUserDetails = async (userid: string) => {
    try {
        const { data, error } = await supabase.from("users").select("*").eq("userid", userid).single()

        if (error) throw error;

        return data;
    }
    catch (err: any) {
        console.error('Error:', err.message);
        throw new Error(err.message);
    }
}