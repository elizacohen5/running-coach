import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:5555/home', {
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            if (data.user) {
                setUser(data.user);
            } else {
                setMessage(data.message);
            }
        };
        fetchData();
    }, []);

    return (
        <UserContext.Provider value={{ user, message, setUser }}>
            {children}
        </UserContext.Provider>
    )
} 

export const useUser = () => useContext(UserContext)