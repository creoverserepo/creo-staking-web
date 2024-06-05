import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import { WalletProvider } from "./helpers/WalletHelper";

function App() {
	return (
		<WalletProvider>
			<Header />
			<Home />
			<Footer />
		</WalletProvider>
	);
}

export default App;
