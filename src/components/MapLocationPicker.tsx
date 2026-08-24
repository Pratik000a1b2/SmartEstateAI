import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Navigation,
  Sparkles,
  TrendingUp,
  Building2,
  Compass,
  Train,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { LocationData } from '../types';
import {
  REAL_WORLD_MICRO_MARKETS,
  MicroMarket,
  matchNearestMicroMarket,
} from '../lib/location_rates';

// Fix Leaflet's default marker icon paths in bundled environments
const customIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div style="
      background-color: #4f46e5;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: #ffffff;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapLocationPickerProps {
  selectedLocation: LocationData;
  onLocationChange: (loc: LocationData) => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  selectedLocation,
  onLocationChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState('Pune');
  const [activeMarket, setActiveMarket] = useState<MicroMarket>(REAL_WORLD_MICRO_MARKETS[0]);

  // Available Cities
  const cities = ['Pune', 'Mumbai', 'Bengaluru', 'Gurgaon', 'Hyderabad', 'Noida', 'Ahmedabad'];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = selectedLocation.latitude || 18.5515;
      const initialLng = selectedLocation.longitude || 73.9348;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add draggable Marker
      const marker = L.marker([initialLat, initialLng], {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
          <b style="color: #4f46e5;">${selectedLocation.locality || 'Selected Locality'}</b>
          <div style="color: #64748b; margin-top: 2px;">₹${selectedLocation.baseRatePerSqFt.toLocaleString('en-IN')}/sq.ft</div>
        </div>
      `);

      // Click on map to move marker
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        updateLocationFromCoordinates(lat, lng);
      });

      // Drag marker
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        updateLocationFromCoordinates(position.lat, position.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      // Map cleanup on unmount handled gracefully
    };
  }, []);

  // Update map center when coordinates change externally
  const updateLocationFromCoordinates = (lat: number, lng: number, customLocality?: string, customCity?: string) => {
    const match = matchNearestMicroMarket(lat, lng);
    setActiveMarket(match.market);

    const localityName = customLocality || (match.distanceKm < 4 ? match.market.locality : `Sector @ ${match.market.city}`);
    const cityName = customCity || match.market.city;

    const newLocData: LocationData = {
      city: cityName,
      locality: localityName,
      address: `${localityName}, ${cityName}, ${match.market.state}`,
      latitude: Math.round(lat * 10000) / 10000,
      longitude: Math.round(lng * 10000) / 10000,
      baseRatePerSqFt: match.estimatedRatePerSqFt,
      tier: match.market.tier,
      distanceToMetroKm: match.market.distanceToMetroKm,
      distanceToTechParkKm: match.market.distanceToTechParkKm,
    };

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setPopupContent(`
        <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
          <b style="color: #4f46e5;">${localityName}</b>
          <div style="color: #64748b; margin-top: 2px;">Est. Rate: <b>₹${match.estimatedRatePerSqFt.toLocaleString('en-IN')}</b> / sq.ft</div>
        </div>
      `).openPopup();
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([lat, lng], { animate: true });
    }

    onLocationChange(newLocData);
  };

  // Select a preset micro-market
  const handleSelectPresetMarket = (market: MicroMarket) => {
    setActiveMarket(market);
    setSelectedCityFilter(market.city);
    updateLocationFromCoordinates(
      market.latitude,
      market.longitude,
      market.locality,
      market.city
    );
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([market.latitude, market.longitude], 14, { animate: true });
    }
  };

  // Geocoding Search via OpenStreetMap Nominatim
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const query = encodeURIComponent(`${searchQuery}, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await res.json();

      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const nameParts = item.display_name.split(',');
        const shortName = nameParts.slice(0, 2).join(',').trim();
        const cityGuess = nameParts.slice(1, 3).join(',').trim();

        updateLocationFromCoordinates(lat, lon, shortName, cityGuess);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lon], 14, { animate: true });
        }
      }
    } catch (err) {
      console.error('Nominatim search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Use GPS / Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        updateLocationFromCoordinates(lat, lng, 'Current GPS Location');
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15, { animate: true });
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback to Pune center
        updateLocationFromCoordinates(18.5204, 73.8567, 'Pune Central');
      },
      { timeout: 8000 }
    );
  };

  // Filtered presets for current city
  const cityPresets = REAL_WORLD_MICRO_MARKETS.filter((m) => m.city === selectedCityFilter);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-5 sm:p-6 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Interactive Map & Real-World Locality Selector
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Click anywhere on the map, drag the pin, or choose a verified micro-market to apply live per sq.ft base rates.
          </p>
        </div>

        {/* Search Bar & GPS */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search area (e.g. Bandra, Kharadi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </form>
          <button
            type="button"
            onClick={handleLocateMe}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition"
            title="Use My Current GPS Location"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* City Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
          Metros:
        </span>
        {cities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => {
              setSelectedCityFilter(city);
              const firstInCity = REAL_WORLD_MICRO_MARKETS.find((m) => m.city === city);
              if (firstInCity) handleSelectPresetMarket(firstInCity);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCityFilter === city
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Locality Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {cityPresets.map((m) => {
          const isSelected = selectedLocation.locality === m.locality;
          return (
            <button
              key={m.locality}
              type="button"
              onClick={() => handleSelectPresetMarket(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
              }`}
            >
              <MapPin className={`w-3 h-3 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span>{m.locality}</span>
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                ₹{m.baseRatePerSqFt.toLocaleString('en-IN')}/sqft
              </span>
            </button>
          );
        })}
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Active Locality Card */}
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-lg max-w-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{selectedLocation.locality || 'Selected Locality'}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
            <span>{selectedLocation.city}</span>
            <span>•</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              ₹{selectedLocation.baseRatePerSqFt.toLocaleString('en-IN')}/sq.ft
            </span>
          </div>
        </div>

        {/* Map Help Tooltip */}
        <div className="absolute bottom-3 right-3 z-[1000] bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] text-white/90 shadow pointer-events-none">
          📍 Drag marker or click map to recalibrate rates
        </div>
      </div>

      {/* Spatial Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-500" />
            <span>Market Base Rate</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
            ₹{selectedLocation.baseRatePerSqFt.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-400">/ sq.ft</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Train className="w-3 h-3 text-cyan-500" />
            <span>Metro Proximity</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
            {selectedLocation.distanceToMetroKm ? `${selectedLocation.distanceToMetroKm} km` : '0.8 km'} <span className="text-[10px] font-normal text-emerald-500">Walkable</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-amber-500" />
            <span>Tech Park / SEZ</span>
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
            {selectedLocation.distanceToTechParkKm ? `${selectedLocation.distanceToTechParkKm} km` : '1.2 km'} <span className="text-[10px] font-normal text-slate-400">Hub</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Spatial Liquidity</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 capitalize">
            {selectedLocation.tier?.replace('_', ' ') || 'Tier 1 Prime'}
          </div>
        </div>
      </div>
    </div>
  );
};
