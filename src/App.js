import Navbar from './components/Navbar'
import Minting from './components/Minting'

function App() {
    return (
        <div className="min-h-screen bg-primary font-rubik text-white">
            <div className="px-12 py-8">
                <Navbar />
            </div>
            <div className="px-48 py-10">
                <Minting />
            </div>
        </div>
    )
}

export default App
