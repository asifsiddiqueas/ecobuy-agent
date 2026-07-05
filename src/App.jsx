import { useState } from 'react';
import { Plane, Calendar, MapPin, Sun, Check, Compass, Briefcase, Map } from 'lucide-react';

// Components
const WeatherWidget = ({ destination }) => {
  return (
    <div className="glass-panel animate-fade-in delay-1">
      <div className="weather-header">
        <h2><Sun style={{ color: 'var(--accent-color)' }} /> Weather in {destination}</h2>
        <div className="temp">72°F</div>
      </div>
      <p className="weather-desc">Partly Cloudy. Perfect for sightseeing!</p>
    </div>
  );
};

const Itinerary = () => {
  const days = [
    { day: 1, title: 'Arrival & City Exploration', desc: 'Settle in and visit the main square. Enjoy local cuisine for dinner.' },
    { day: 2, title: 'Historical Tour & Museums', desc: 'Guided tour of the old town and afternoon at the national museum.' },
    { day: 3, title: 'Nature Walk & Departure', desc: 'Morning hike in the nearby park, followed by souvenir shopping.' }
  ];

  return (
    <div className="glass-panel animate-fade-in delay-2">
      <h2><Map style={{ color: 'var(--accent-color)' }} /> 3-Day Itinerary</h2>
      <div className="itinerary-list">
        {days.map(d => (
          <div key={d.day} className="itinerary-day">
            <h3>Day {d.day}: {d.title}</h3>
            <p>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PackingList = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Light Jacket (for evenings)', checked: false },
    { id: 2, text: 'Comfortable Walking Shoes', checked: false },
    { id: 3, text: 'Sunscreen & Sunglasses', checked: false },
    { id: 4, text: 'Travel Umbrella', checked: false },
    { id: 5, text: 'Portable Charger', checked: false }
  ]);

  const toggle = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="glass-panel animate-fade-in delay-3">
      <h2><Briefcase style={{ color: 'var(--accent-color)' }} /> Packing List</h2>
      <ul className="packing-list">
        {items.map(item => (
          <li key={item.id} className="packing-item" onClick={() => toggle(item.id)}>
            <div className={`checkbox ${item.checked ? 'checked' : ''}`}>
              {item.checked && <Check size={16} color="white" />}
            </div>
            <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripData, setTripData] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!destination || !dates) return;
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setTripData({ destination, dates });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="app-container">
      {!tripData ? (
        <div className="glass-panel hero-section animate-fade-in">
          <h1>Smart Travel<br/>Concierge</h1>
          <p style={{ marginBottom: '2rem' }}>Plan your perfect trip with AI. Just tell us where and when.</p>
          
          <form onSubmit={handleGenerate}>
            <div className="input-group">
              <label>Where to?</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '1.1rem', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Paris, France" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>
            
            <div className="input-group">
              <label>When?</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={20} style={{ position: 'absolute', left: '1rem', top: '1.1rem', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. Oct 15 - Oct 18" 
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            <button type="submit" disabled={isGenerating || !destination || !dates}>
              {isGenerating ? <Compass className="animate-spin" /> : <Plane />}
              {isGenerating ? 'Generating Itinerary...' : 'Plan My Trip'}
            </button>
          </form>
        </div>
      ) : (
        <div className="dashboard animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '3rem', margin: 0 }}>Your Trip to <span style={{color: 'var(--accent-color)'}}>{tripData.destination}</span></h1>
            <button onClick={() => setTripData(null)} style={{width: 'auto', padding: '0.5rem 1.5rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}}>
              Plan Another Trip
            </button>
          </div>
          
          <WeatherWidget destination={tripData.destination} />
          
          <div className="grid-layout" style={{ marginTop: '2rem' }}>
            <Itinerary />
            <PackingList />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
