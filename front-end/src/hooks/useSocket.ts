import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url?: string) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io(`ws://0.0.0.0:4000/${url ?? ''}`);
		setSocket(newSocket);
		return () => {
			socket?.disconnect();
		};
	}, []);

	return socket;
};

export default useSocket;
