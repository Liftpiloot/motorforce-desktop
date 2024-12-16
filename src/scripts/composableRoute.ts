import {API_URL} from "../config";
import {dataPoint} from "./composableDataPoint";

export interface Route {
    id: number;
    userId: number;
    distance: number;
    dataPoints: dataPoint[];
}

export const ComposableRoute = () => {

    async function get(routeId: number): Promise<Route[]> {
        const response = await fetch(`${API_URL}/Route?routeId=${routeId}`, {
            method: "GET",
            headers:
                {
                    'content-type': 'application/json',
                },
        });

        if (!response.ok) {
            throw new Error("Failed to get route");
        }
        return await response.json();
    }

    async function deleteRoute(routeId: number): Promise<any> {
        const response = await fetch(`${API_URL}/Route?routeId=${routeId}`, {
            method: "DELETE",
            headers: {
                'content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete route");
        }
    }

    async function getMaxSpeed(routeId: number): Promise<any> {
        const response = await fetch(`${API_URL}/Route/MaxSpeed?routeId=${routeId}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get route max speed");
        }
        const { maxSpeed, highScore } = await response.json();
        return { maxSpeed, highScore };
    }

    async function getMaxLean(routeId: number): Promise<any> {
        const response = await fetch(`${API_URL}/Route/MaxLean?routeId=${routeId}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get route max lean");
        }
        const { maxLean, highScore } = await response.json();
        return { maxLean, highScore };
    }

    async function getMaxG(routeId: number): Promise<any> {
        const response = await fetch(`${API_URL}/Route/MaxG?routeId=${routeId}`, {
            method: "GET",
            headers: {
                "accept": "*/*",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to get route max G");
        }
        const { maxG, highScore } = await response.json();
        return { maxG, highScore };
    }

    return {
        get,
        deleteRoute,
        getMaxSpeed,
        getMaxLean,
        getMaxG,
    }
}