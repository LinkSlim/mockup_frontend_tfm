import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Send } from 'lucide-react';
import './ImageUploader.css';

export default function ImageUploader({ onImageSelect }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Form states
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [location, setLocation] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && preview) {
      onImageSelect(selectedFile, preview, { age, sex, location });
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      {!preview ? (
        <div 
          className={`uploader-zone ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleChange} 
          />
          <div className="uploader-content">
            <div className="icon-circle">
              <UploadCloud size={40} className="upload-icon" />
            </div>
            <h3 className="uploader-title">Sube o arrastra la imagen</h3>
            <p className="uploader-desc">Archivos soportados: JPG, PNG, WEBP (hasta 10MB)</p>
            <button className="btn btn-primary mt-4" style={{ margin: '1rem auto 0', display: 'flex' }}>Explorar archivos</button>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <div className="preview-mini" style={{ marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden', height: '200px', border: '1px solid var(--color-border)' }}>
            <img src={preview} alt="Selected lesion" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <h3 style={{ marginBottom: '1.2rem', color: 'var(--color-text-main)', textAlign: 'center' }}>Datos Clínicos del Paciente</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Edad (años)</label>
                <input 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                  required 
                  min="0"
                  max="120"
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
                  placeholder="Ej. 45"
                />
              </div>
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Sexo</label>
                <select 
                  value={sex} 
                  onChange={(e) => setSex(e.target.value)} 
                  required
                  style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
                >
                  <option value="" style={{ color: 'black' }}>Seleccione...</option>
                  <option value="m" style={{ color: 'black' }}>Masculino</option>
                  <option value="f" style={{ color: 'black' }}>Femenino</option>
                  <option value="o" style={{ color: 'black' }}>Otro</option>
                </select>
              </div>
            </div>
            
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Localización de la Lesión</label>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
                style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }}
              >
                <option value="" style={{ color: 'black' }}>Seleccione...</option>
                <option value="tronco" style={{ color: 'black' }}>Tronco</option>
                <option value="espalda" style={{ color: 'black' }}>Espalda</option>
                <option value="extremidad_superior" style={{ color: 'black' }}>Extremidad superior</option>
                <option value="extremidad_inferior" style={{ color: 'black' }}>Extremidad inferior</option>
                <option value="abdomen" style={{ color: 'black' }}>Abdomen</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => { setPreview(null); setSelectedFile(null); }}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <Send size={18} /> Analizar Lesión
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
