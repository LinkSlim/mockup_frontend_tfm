import React, { useState, useMemo } from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, RefreshCw, Eye, Sparkles } from 'lucide-react';
import './ResultCard.css';

export default function ResultCard({ result, image, onReset }) {
  const [viewMode, setViewMode] = useState('original'); // 'original' | 'xai'
  const [xaiMethod, setXaiMethod] = useState('gradcam'); // 'gradcam' | 'lime' | 'shap'

  // result = { type: 'Melanoma', confidence: 0.92, riskLevel: 'high' }

  const getRiskDetails = (level) => {
    switch (level) {
      case 'high':
        return { icon: <AlertTriangle size={32} />, color: 'var(--color-danger)', text: 'Alto Riesgo', class: 'danger' };
      case 'medium':
        return { icon: <ShieldAlert size={32} />, color: 'var(--color-warn)', text: 'Riesgo Moderado', class: 'warn' };
      case 'low':
      default:
        return { icon: <CheckCircle size={32} />, color: 'var(--color-success)', text: 'Bajo Riesgo', class: 'success' };
    }
  };

  const risk = (result && result.riskLevel) ? getRiskDetails(result.riskLevel) : getRiskDetails('low');

  const limeCircles = useMemo(() => {
    return Array.from({ length: 2 }).map(() => ({
      top: `${Math.random() * 60 + 20}%`,
      left: `${Math.random() * 60 + 20}%`,
      width: `${Math.random() * 50 + 50}px`,
      height: `${Math.random() * 50 + 50}px`,
      // Generar un border-radius irregular aleatorio para que parezcan contornos orgánicos
      borderRadius: `${40 + Math.random() * 30}% ${40 + Math.random() * 30}% ${40 + Math.random() * 30}% ${40 + Math.random() * 30}% / ${40 + Math.random() * 30}% ${40 + Math.random() * 30}% ${40 + Math.random() * 30}% ${40 + Math.random() * 30}%`
    }));
  }, [image]);

  const shapGrid = useMemo(() => {
    const grid = [];
    
    // Generar frecuencias y fases aleatorias para que el patrón cambie en cada imagen, pero sea suave
    const f1x = Math.random() * 0.3 + 0.1;
    const f1y = Math.random() * 0.3 + 0.1;
    const p1 = Math.random() * Math.PI * 2;
    
    const f2x = Math.random() * 0.4 + 0.1;
    const f2y = Math.random() * 0.4 + 0.1;
    const p2 = Math.random() * Math.PI * 2;

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        // Combinar ondas senoidales bidimensionales para transiciones suaves
        let val1 = Math.sin(x * f1x + y * f1y + p1);
        let val2 = Math.cos(x * f2x - y * f2y + p2);
        
        // Normalizar de un rango aprox de -2..2 a 0..1
        let v = (val1 + val2) / 2;
        v = (v + 1) / 2;
        v = Math.max(0, Math.min(1, v));

        // Aplicar la paleta de colores jet al valor suavizado
        const r = Math.max(0, Math.min(1, 1.5 - Math.abs(4 * v - 3)));
        const g = Math.max(0, Math.min(1, 1.5 - Math.abs(4 * v - 2)));
        const b = Math.max(0, Math.min(1, 1.5 - Math.abs(4 * v - 1)));
        
        grid.push(`rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 0.5)`);
      }
    }
    return grid;
  }, [image]);

  return (
    <div className="glass-panel animate-fade-in result-card">
      <div className="result-header">
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: 0 }}>Resultados del Análisis</h2>
      </div>

      <div className="result-content">
        <div className="result-image-box">
          <div className="image-view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'original' ? 'active' : ''}`}
              onClick={() => setViewMode('original')}
            >
              <Eye size={16} /> Original
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'xai' ? 'active' : ''}`}
              onClick={() => setViewMode('xai')}
            >
              <Sparkles size={16} /> Análisis XAI
            </button>
          </div>
          
          {viewMode === 'xai' && (
            <div className="xai-method-toggle" style={{ display: 'flex', background: 'var(--color-bg-base)', padding: '0.5rem', gap: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <button 
                className={`toggle-btn ${xaiMethod === 'gradcam' ? 'active' : ''}`}
                onClick={() => setXaiMethod('gradcam')}
                style={{ fontSize: '0.85rem', padding: '0.25rem' }}
              >
                Grad-CAM
              </button>
              <button 
                className={`toggle-btn ${xaiMethod === 'lime' ? 'active' : ''}`}
                onClick={() => setXaiMethod('lime')}
                style={{ fontSize: '0.85rem', padding: '0.25rem' }}
              >
                LIME
              </button>
              <button 
                className={`toggle-btn ${xaiMethod === 'shap' ? 'active' : ''}`}
                onClick={() => setXaiMethod('shap')}
                style={{ fontSize: '0.85rem', padding: '0.25rem' }}
              >
                SHAP
              </button>
            </div>
          )}
          
          <div className="image-wrapper">
            <img src={image} alt="Lesión analizada" className="result-image" />
            {viewMode === 'xai' && xaiMethod === 'gradcam' && (
              <div className="xai-overlay gradcam"></div>
            )}
            {viewMode === 'xai' && xaiMethod === 'lime' && (
              <div className="xai-overlay lime">
                {limeCircles.map((circle, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    top: circle.top,
                    left: circle.left,
                    width: circle.width,
                    height: circle.height,
                    backgroundColor: 'transparent',
                    border: '3px solid rgba(255, 255, 0, 0.9)',
                    borderRadius: circle.borderRadius,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px rgba(255,255,0,0.6), inset 0 0 10px rgba(255,255,0,0.6)'
                  }} />
                ))}
              </div>
            )}
            {viewMode === 'xai' && xaiMethod === 'shap' && (
              <div className="xai-overlay shap" style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(16, 1fr)' }}>
                {shapGrid.map((color, i) => (
                  <div key={i} style={{ backgroundColor: color }} />
                ))}
              </div>
            )}
            
            {viewMode === 'xai' && (xaiMethod === 'gradcam' || xaiMethod === 'shap') && (
              <div className="xai-legend" style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '70%',
                maxHeight: '200px',
                width: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                padding: '8px 4px',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.75rem',
                justifyContent: 'space-between',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(2px)'
              }}>
                <span style={{ fontWeight: 'bold' }}>{xaiMethod === 'gradcam' ? '1' : '5'}</span>
                <div style={{
                  width: '12px',
                  flex: 1,
                  margin: '6px 0',
                  background: 'linear-gradient(to top, rgba(0,0,128,1) 0%, rgba(0,0,255,1) 12.5%, rgba(0,255,255,1) 37.5%, rgba(255,255,0,1) 62.5%, rgba(255,0,0,1) 87.5%, rgba(128,0,0,1) 100%)',
                  borderRadius: '2px',
                  border: '1px solid rgba(255,255,255,0.4)'
                }}></div>
                <span style={{ fontWeight: 'bold' }}>{xaiMethod === 'gradcam' ? '0' : '-5'}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="result-details">
          <div className={`risk-badge ${risk.class}`}>
            {risk.icon}
            <span className="risk-text">{risk.text}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Tipo detectado:</span>
            <span className="detail-value highlight">{result?.type || 'No identificado'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Confianza IA:</span>
            <div className="confidence-wrapper">
              <span className="detail-value">{result ? Math.round(result.confidence * 100) : 0}%</span>
              <div className="confidence-track">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${result ? Math.round(result.confidence * 100) : 0}%`,
                    backgroundColor: risk.color 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="disclaimer-box">
            <p className="disclaimer-text">
              <strong>Aviso Médico:</strong> Este análisis es generado por inteligencia artificial y tiene fines únicamente informativos. 
              <strong> NO SUSTITUYE</strong> un diagnóstico médico profesional. Si notas cambios en tu piel, acude a un dermatólogo.
            </p>
          </div>
          
          <button className="btn btn-outline reset-btn mt-4" onClick={onReset}>
            <RefreshCw size={18} />
            Analizar nueva imagen
          </button>
        </div>
      </div>
    </div>
  );
}
