import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Brain, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

const KNNGame = () => {
  const [residents, setResidents] = useState([
    { x: 15, y: 20, class: 'rap/trap', color: '#8B5CF6' },
    { x: 25, y: 15, class: 'rap/trap', color: '#8B5CF6' },
    { x: 20, y: 30, class: 'rap/trap', color: '#8B5CF6' },
    { x: 26, y: 25, class: 'rap/trap', color: '#8B5CF6' },
    { x: 20, y: 26, class: 'rap/trap', color: '#8B5CF6' },
    { x: 30, y: 31, class: 'rap/trap', color: '#8B5CF6' },
    
    { x: 70, y: 70, class: 'pagode', color: '#EF4444' },
    { x: 75, y: 65, class: 'pagode', color: '#EF4444' },
    { x: 80, y: 75, class: 'pagode', color: '#EF4444' },
    { x: 82, y: 90, class: 'pagode', color: '#EF4444' },
    { x: 86, y: 79, class: 'pagode', color: '#EF4444' },
    { x: 72, y: 80, class: 'pagode', color: '#EF4444' },
    
    { x: 80, y: 20, class: 'mpb', color: '#10B981' },
    { x: 85, y: 25, class: 'mpb', color: '#10B981' },
    { x: 75, y: 18, class: 'mpb', color: '#10B981' },
    { x: 82, y: 28, class: 'mpb', color: '#10B981' },
    { x: 89, y: 20, class: 'mpb', color: '#10B981' },
    { x: 89, y: 28, class: 'mpb', color: '#10B981' },
    
    { x: 25, y: 75, class: 'blues', color: '#F59E0B' },
    { x: 20, y: 80, class: 'blues', color: '#F59E0B' },
    { x: 30, y: 74, class: 'blues', color: '#F59E0B' },
    { x: 22, y: 72, class: 'blues', color: '#F59E0B' },
    { x: 35, y: 80, class: 'blues', color: '#F59E0B' },
    { x: 26, y: 70, class: 'blues', color: '#F59E0B' }
  ]);
  
  const [newPerson, setNewPerson] = useState({ x: 50, y: 50 });
  const [k, setK] = useState(3);
  const [prediction, setPrediction] = useState(null);
  const [distances, setDistances] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const mapRef = useRef(null);

  // Atualiza classificação em tempo real
  useEffect(() => {
    if (isActive && newPerson) {
      classifyPerson();
    }
  }, [newPerson, k, isActive]);

  // Controle por teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return;
      
      const step = 2;
      let newX = newPerson.x;
      let newY = newPerson.y;

      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newY = Math.max(0, newPerson.y - step);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newY = Math.min(100, newPerson.y + step);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newX = Math.max(0, newPerson.x - step);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newX = Math.min(100, newPerson.x + step);
          break;
        default:
          return;
      }

      setNewPerson({ x: newX, y: newY });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newPerson, isActive]);

  const calculateDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setNewPerson({ x, y });
    setIsActive(true);
  };

  const classifyPerson = () => {
    if (!newPerson) return;
    
    const dists = residents.map(r => ({
      ...r,
      distance: calculateDistance(newPerson, r)
    })).sort((a, b) => a.distance - b.distance);
    
    setDistances(dists);
    
    const nearest = dists.slice(0, k);
    const classCounts = {};
    
    nearest.forEach(n => {
      classCounts[n.class] = (classCounts[n.class] || 0) + 1;
    });
    
    const predictedClass = Object.keys(classCounts).reduce((a, b) => 
      classCounts[a] > classCounts[b] ? a : b
    );
    
    const classColor = nearest.find(n => n.class === predictedClass).color;
    
    setPrediction({ class: predictedClass, color: classColor, votes: classCounts });
  };

  const startGame = () => {
    setNewPerson({ x: 50, y: 50 });
    setIsActive(true);
    if (mapRef.current) {
      mapRef.current.focus();
    }
  };

  const resetGame = () => {
    setNewPerson({ x: 50, y: 50 });
    setPrediction(null);
    setDistances([]);
    setIsActive(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10" />
            KNN: Que música você vai ouvir?
          </h1>
          <p className="text-slate-300 text-lg">
            Clique no mapa ou use as setas do teclado ⬆️⬇️⬅️➡️ para mover a pessoa!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Mapa da Cidade
                </h2>
                <div className="flex items-center gap-3">
                  <label className="text-sm">K = </label>
                  <input 
                    type="number" 
                    min="1" 
                    max="15" 
                    value={k}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isNaN(value)) return;
                      setK(Math.max(1, Math.min(15, value)));
                    }}
                    className="w-16 px-2 py-1 bg-slate-700 rounded border border-slate-600 text-center"
                  />
                </div>
              </div>
              
              <div 
                ref={mapRef}
                tabIndex={0}
                className="relative w-full h-96 bg-slate-700 rounded-lg cursor-crosshair border-2 border-slate-600 hover:border-slate-500 transition-colors focus:outline-none focus:border-blue-500"
                onClick={handleMapClick}
              >
                {residents.map((r, i) => (
                  <div key={i}>
                    <div
                      className="absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${r.x}%`,
                        top: `${r.y}%`,
                        backgroundColor: r.color,
                        boxShadow: `0 0 10px ${r.color}80`
                      }}
                    />
                    {isActive && distances.slice(0, k).find(d => d.x === r.x && d.y === r.y) && (
                      <div
                        className="absolute rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                        style={{
                          left: `${r.x}%`,
                          top: `${r.y}%`,
                          width: '20px',
                          height: '20px',
                          borderColor: r.color
                        }}
                      />
                    )}
                  </div>
                ))}
                
                {newPerson && isActive && (
                  <div>
                    <div
                      className="absolute w-5 h-5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-slate-900 shadow-lg"
                      style={{
                        left: `${newPerson.x}%`,
                        top: `${newPerson.y}%`,
                        boxShadow: prediction ? `0 0 20px ${prediction.color}` : '0 0 20px white'
                      }}
                    />
                    {distances.slice(0, k).map((d, i) => (
                      <svg
                        key={i}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ opacity: 0.3 }}
                      >
                        <line
                          x1={`${newPerson.x}%`}
                          y1={`${newPerson.y}%`}
                          x2={`${d.x}%`}
                          y2={`${d.y}%`}
                          stroke={d.color}
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                {!isActive ? (
                  <button
                    onClick={startGame}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Iniciar Jogo
                  </button>
                ) : (
                  <div className="flex-1 px-6 py-3 bg-blue-600 rounded-lg font-semibold text-center flex items-center justify-center gap-2">
                    <div className="flex gap-1">
                      <ArrowUp className="w-4 h-4" />
                      <ArrowDown className="w-4 h-4" />
                      <ArrowLeft className="w-4 h-4" />
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    Use as setas do teclado
                  </div>
                )}
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Resetar
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gênero Musical
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
                  <span>Rap/Trap</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                  <span>Pagode</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10B981' }} />
                  <span>MPB</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                  <span>Blues</span>
                </div>
              </div>
            </div>

            {isActive && prediction && (
              <div className="bg-slate-800 rounded-xl p-6 shadow-2xl border-2 transition-all" style={{ borderColor: prediction.color }}>
                <h3 className="text-lg font-semibold mb-4">Classificação em Tempo Real</h3>
                <div className="space-y-3">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${prediction.color}20` }}>
                    <div className="text-2xl font-bold mb-2" style={{ color: prediction.color }}>
                      {prediction.class.toUpperCase()}
                    </div>
                    <div className="text-sm text-slate-300">Classe Prevista</div>
                  </div>
                  
                  <div className="text-sm text-slate-300">
                    <div className="font-semibold mb-2">Votos dos {k} vizinhos mais próximos:</div>
                    {Object.entries(prediction.votes).map(([cls, count]) => (
                      <div key={cls} className="flex justify-between py-1">
                        <span>{cls}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold mb-3">Como jogar?</h3>
              <div className="text-sm text-slate-300 space-y-2">
                <p>1. Clique em "Iniciar Jogo"</p>
                <p>2. Use as <strong>setas do teclado</strong> (⬆️⬇️⬅️➡️) para mover</p>
                <p>3. Ou clique no mapa para teleportar</p>
                <p>4. A classificação atualiza em tempo real!</p>
                <p className="text-xs text-slate-400 mt-3">Uma dica 💡: Mude o valor de K para ver diferentes resultados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KNNGame;