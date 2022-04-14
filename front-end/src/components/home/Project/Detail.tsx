import React from 'react';
import { useParams } from 'react-router-dom';

const Detail: React.FC = () => {
	const { id } = useParams();
	console.log(id);

	return <div>Detail</div>;
};

export default Detail;
