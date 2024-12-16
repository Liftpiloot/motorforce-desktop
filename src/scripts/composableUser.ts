import { API_URL } from "@/config";
import {Route} from "./composableRoute";
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
}

export const ComposableUser = () => {
    async function getRoutes(userId: number, count: number): Promise<{route: Route}> {
        const response = await fetch(`${API_URL}/GetRoutes?userId=${userId}&count=${count}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get routes");
        }
        return await response.json();
    }

    return {
        getRoutes,
    }
}