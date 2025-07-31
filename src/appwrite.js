import { Client, Databases, Query, ID } from "appwrite";
import { useState } from "react";

// Environment variables for Appwrite configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const API_BASE_URL = import.meta.env.VITE_APPWRITE_ENDPOINT;

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(API_BASE_URL)
    .setProject(PROJECT_ID);

const database = new Databases(client);

// Function to fetch movies from TMDB API
export const updateSearchCount = async (searchTerm, movie) => {
    // 1. Use Appwrite SDK to check if the user has already searched for this term
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [ 
            Query.equal('searchTerm', searchTerm),
        ])

        // 2. If it does, increment the count
        if(result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument( DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            }) 
        } 
        
        // 3. If it doesn't, create a new document with the search term and count    
        else {
             await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
             })
            
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }

}

// Custom hook to fetch trending movies with loading state
export function useTrendingMovies() {
    const [isTrendingLoading, setIsTrendingLoading] = useState(false);

    const fetchTrendingMovies = async () => {
        setIsTrendingLoading(true);
        try {
            const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
                Query.orderDesc('count'),
                Query.limit(5),
            ]);
            return result.documents;
        } catch (err) {
            console.error('Error fetching trending movies:', err);
        } finally {
            setIsTrendingLoading(false);
        }
    };

    return { fetchTrendingMovies, isTrendingLoading };
}
