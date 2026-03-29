import { useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { useDisasterStore } from "../store/disasterStore";
import { saveSOSPin } from "../services/firebaseService";

export default function SOSButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addSOSPin } = useDisasterStore();

  const handleSOSClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request geolocation permission
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Save to Firebase
          const pin = await saveSOSPin(latitude, longitude);

          if (pin) {
            // Add to local store
            addSOSPin(pin);
            setIsGranted(true);

            // Show success message
            setTimeout(() => {
              setIsGranted(false);
            }, 3000);
          } else {
            setError("Failed to send SOS. Please try again.");
          }

          setIsLoading(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to access your location. Please enable location services.");
          setIsLoading(false);
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
        }
      );
    } catch (err) {
      console.error("SOS Error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleSOSClick}
        disabled={isLoading || isGranted}
        className={`
          relative px-8 py-4 rounded-lg font-bold text-lg
          flex items-center justify-center gap-2
          transition-all duration-200 whitespace-nowrap
          ${
            isGranted
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-600/50"
          }
          ${isLoading ? "opacity-75" : ""}
          ${isGranted ? "" : "animate-pulse"}
        `}
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : isGranted ? (
          <>
            <AlertTriangle className="w-5 h-5" />
            SOS Sent!
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5" />
            Report Emergency
          </>
        )}
      </button>

      {error && (
        <div className="px-4 py-2 bg-red-900 border border-red-600 text-red-100 text-sm rounded-lg max-w-sm text-center">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-400 text-center max-w-sm">
        Tap to report an emergency and share your location with rescue teams
      </p>
    </div>
  );
}
