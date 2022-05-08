import { createContext, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/store';
import Main from './components/Main';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

function App() {
	return (
		<Provider store={store}>
			<Router>
				<Main />
			</Router>
		</Provider>
	);
}

export default App;
