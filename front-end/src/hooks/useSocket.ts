import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = (url?: string) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const newSocket = io(`http://192.168.1.171:4000/${url ?? ''}`);
		setSocket(newSocket);
		return () => {
			socket?.disconnect();
		};
	}, []);

	return socket;
};

export default useSocket;
