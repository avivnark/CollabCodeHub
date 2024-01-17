import React, { useState, useEffect } from 'react';

function Student({ socket, id }) {
    const [code, setCode] = useState('');
    const [isSuccess, setIsSuccess] = useState(null);

    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);

        // Emit 'code_change' event to the server
        socket.emit('code_change', { code: newCode, id: parseInt(id, 10) });
    };

    useEffect(() => {
        const handleCodeChangeResult = (data) => {
            // Check if the code change was successful
            setIsSuccess(data.success);
        };

        // Add an event listener for the 'receive_code' event
        socket.on('receive_code', handleCodeChangeResult);

        // Clean up event listener when the component unmounts
        return () => {
            socket.off('receive_code', handleCodeChangeResult);
        };
    }, [socket, id]);

    return (
        <div>
            <textarea
                placeholder="Enter code here..."
                value={code}
                onChange={handleCodeChange}
                rows={10}
                cols={50}
            />
            {isSuccess !== null && (
                <div>
                    {isSuccess ? (
                        <span role="img" aria-label="smiley-face">😊 Code is correct!</span>
                    ) : (
                        <span role="img" aria-label="sad-face">😞 Code doesn't match the solution.</span>
                    )}
                </div>
            )}
        </div>
    );
}

export default Student;
