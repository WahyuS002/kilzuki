import Navbar from './components/Navbar'
import Minting from './components/Minting'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    return (
        <div className="min-h-screen bg-primary font-rubik text-white">
            <ToastContainer />
            <div className="px-12 py-8">
                <Navbar />
            </div>
            <div className="px-6 md:px-48 py-10">
                <Minting />
            </div>
        </div>
    )
}

export default App
