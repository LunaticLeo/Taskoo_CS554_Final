import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/store';
import Main from './components/Main';

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
