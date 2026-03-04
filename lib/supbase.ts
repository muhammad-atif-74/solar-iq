import { Selected_Room } from '@/types';
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
            is_onboarded: false
        })

        if (error) throw error;

        return data;
    }
    catch (err: any) {
        console.error('Error creating user:', err.message);
        throw new Error(err.message);
    }
}

export const updateUser = async (userid: string, is_onboarded: boolean) => {
    try {
        const { data, error } = await supabase.from('users').update({ is_onboarded }).eq('userid', userid).select().single();

        if (error) throw error;

        return data;
    }
    catch (err: any) {
        console.error('Error updating user:', err.message);
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
        // await createNewHome(data.user!.id, username);

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

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (err: any) {
        console.error('Error signing out:', err.message);
        throw new Error(err.message);
    }
};

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

export const createNewHome = async (userid: string, home_name: string | null, location: string | null, has_solar: boolean, solar_capacity_kw: number | null) => {
    try {
        const { data, error } = await supabase.from("homes").insert({
            home_name: home_name,
            user_id: userid,
            location: location,
            has_solar: has_solar,
            solar_capacity_kw: solar_capacity_kw
        })
        if (error) throw error;

        return data;
    }
    catch (err: any) {
        console.error('Error:', err.message);
        throw new Error(err.message);
    }
}

export const createRoom = async (user_id: string, room_id: string, room_name: string) => {
    try {
        const { data, error } = await supabase.from("rooms")
            .insert({
                room_id, room_name, user_id
            });

        if (error) throw error;

        return data;
    }
    catch (err: any) {
        console.error('Error:', err.message);
        throw new Error(err.message);
    }
}

export const createUserRooms = async (
    userId: string,
    selectedRooms: Selected_Room[]
  ) => {
    try {
      if (!selectedRooms?.length) return;
  
      const roomsToInsert = selectedRooms.flatMap(room =>
        Array.from({ length: room.qty }, () => ({
          user_id: userId,
          room_id: room.id,
          room_name: room.name,
        }))
      );
  
      const { data, error } = await supabase
        .from("rooms")
        .insert(roomsToInsert);
  
      if (error) throw error;
  
      return data;
    } catch (err: any) {
      console.error("Create rooms error:", err.message);
      throw err;
    }
  };
  