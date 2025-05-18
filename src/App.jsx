import HeaderBar from './components/HeaderBar';
import SplitScreen from './components/SplitScreen';
import Footer from './components/Footer';
import ControlsBar from './components/ControlsBar';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <HeaderBar />
      {/* Main area is full height minus header/footer/controls */}
      <div className="flex-1 flex flex-col relative">
        <SplitScreen />
      </div>
      <ControlsBar />
      <Footer />
    </div>
  );
}
