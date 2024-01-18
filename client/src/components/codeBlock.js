import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import codeBlocks from './codeBlocksData';
import '../App.css'; 
import Mentor from './Mentor';
import Student from './Student';


const socket = io.connect('http://localhost:3001');

function CodeBlock() {
    const { id } = useParams();
    const selectedCodeBlock = codeBlocks.find((block) => block.id === parseInt(id, 10));
    const [connectionStatus, setConnectionStatus] = useState(null);


    useEffect(() => {
        // Function to get the value of a cookie
        const getCookie = (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        };

        // Function to set the value of a cookie
        const setCookie = (name, value) => {
            document.cookie = `${name}=${value}; path=/`;
        };

        const setCookieIfNotExists = (name, value) => {
            if (!getCookie(name)) {
                setCookie(name, value);
                setConnectionStatus(`${value} connected`);
            } else {
                const role = getCookie(name);
                setConnectionStatus(`${role} connected`);
            }
        };


        // Send a request to join the code block when the component mounts
        socket.emit('joinCodeBlock', parseInt(id, 10));

        // Listen for server responses
        socket.on('mentorConnected', () => {
            // Set the "mentor" cookie if it doesn't exist
            setCookieIfNotExists(`role_${id}`, 'mentor');
        });

        socket.on('mentorConnectedAlready', () => {
            // Set the "student" cookie if it doesn't exist
            setCookieIfNotExists(`role_${id}`, 'student');
        });

        // Clean up event listeners when the component unmounts
        return () => {
            socket.off('mentorConnected');
            socket.off('mentorConnectedAlready');
        };
    }, [id]);


    return (
        <div className="CodeBlock">
            <h1>Code Block {selectedCodeBlock.name}</h1>
            <h2>{selectedCodeBlock.description}</h2>
            {connectionStatus === 'mentor connected' && (
                <Mentor socket={socket} id={id} />
            )}
            {connectionStatus === 'student connected' && (
                <Student socket={socket} id={id} />
            )}
            {!connectionStatus && <p>Error: Connection status not available</p>}
        </div>
    );

}

export default CodeBlock;
