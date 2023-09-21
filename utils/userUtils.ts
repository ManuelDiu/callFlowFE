

export const DEFAULT_TOKEN_SESSION_KEY = "auth_token";

export const handleStorageToken = (token: string) => {
    sessionStorage.setItem(DEFAULT_TOKEN_SESSION_KEY, token);
}


export const handleGetToken = (): string => {
    if (typeof window === "undefined") {
        return "";
    } else {
        return sessionStorage.getItem(DEFAULT_TOKEN_SESSION_KEY) || "";
    }
}

export const handleRemoveToken = () => {
    sessionStorage.removeItem(DEFAULT_TOKEN_SESSION_KEY);
}