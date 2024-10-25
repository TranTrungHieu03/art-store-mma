import AsyncStorage from '@react-native-async-storage/async-storage';
import {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface WishlistContextType {
    wishlist: string[];
    addWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    clearWishlist: () => Promise<void>;
    removeMultipleFromWishlist: (productIds: string[]) => Promise<void>;
    isWishlisted: (productId: string) => boolean;
    isWishlistLoaded: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
    wishlist: [],
    addWishlist: async () => {
    },
    removeFromWishlist: async () => {
    },
    clearWishlist: async () => {
    },
    removeMultipleFromWishlist: async () => {
    },
    isWishlisted: () => false,
    isWishlistLoaded: false
});

export function WishlistProvider({children}: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Set<string>>(new Set<string>());
    const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);
    
    useEffect(() => {
        loadWishlist();
    }, []);
    
    const loadWishlist = async () => {
        try {
            const storedWishlist = await AsyncStorage.getItem('wishlist');
            if (storedWishlist !== null) {
                setWishlist(new Set(JSON.parse(storedWishlist)));
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
        } finally {
            setIsWishlistLoaded(true);
        }
    };
    const addWishlist = async (id: string) => {
        try {
            const updatedWishlist = new Set(wishlist);
            updatedWishlist.add(id);
            setWishlist(updatedWishlist)
            console.log("Add", wishlist, updatedWishlist, [...updatedWishlist]);
            await AsyncStorage.setItem('wishlist', JSON.stringify([...updatedWishlist]));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }
    
    const removeFromWishlist = async (id: string) => {
        try {
            const updatedWishlist = new Set(wishlist);
            updatedWishlist.delete(id);
            console.log("remove", updatedWishlist)
            setWishlist(updatedWishlist)
            await AsyncStorage.setItem('wishlist', JSON.stringify([...updatedWishlist]));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    }
    
    const removeMultipleFromWishlist = async (productIds: string[]) => {
        const updatedWishlist = new Set(wishlist);
        productIds.forEach(id => updatedWishlist.delete(id));
        setWishlist(updatedWishlist);
        try {
            await AsyncStorage.setItem('wishlist', JSON.stringify([...updatedWishlist]));
        } catch (error) {
            console.error('Error saving wishlist after multiple delete:', error);
        }
    };
    const clearWishlist = async () => {
        setWishlist(new Set());
        try {
            await AsyncStorage.removeItem('wishlist');
        } catch (error) {
            console.error('Error clearing wishlist:', error);
        }
    };
    
    return (
        <WishlistContext.Provider
            value={{
                wishlist: [...wishlist],
                addWishlist,
                removeFromWishlist,
                clearWishlist,
                removeMultipleFromWishlist,
                isWishlisted: (productId: string) => wishlist.has(productId),
                isWishlistLoaded
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}