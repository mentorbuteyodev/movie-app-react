import { Client, Databases, Query, ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const API_BASE_URL = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(API_BASE_URL)
    .setProject(PROJECT_ID);

const database = new Databases(client);

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
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_url}`,
             })
            
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }

}