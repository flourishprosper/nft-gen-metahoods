import React, { useState, useEffect } from 'react'
    import './App.css'

    const LAYER_ORDER = [
      'Body',
      'Head',
      'Ears',
      'Expression',
      'Shirt',
      'Pants',
      'Belt',
      'Belt Buckle',
      'Accessory',
      'Head Accessories',
      'Tattoos',
      'Location'
    ]

    function App() {
      const [layers, setLayers] = useState({})
      const [selectedTraits, setSelectedTraits] = useState({})

      useEffect(() => {
        async function loadLayers() {
          const layers = {}
          for (const layer of LAYER_ORDER) {
            try {
              const response = await fetch(`/layers/${layer}`)
              const text = await response.text()
              const parser = new DOMParser()
              const html = parser.parseFromString(text, 'text/html')
              const files = Array.from(html.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.endsWith('.png'))
              layers[layer] = files
            } catch (error) {
              console.error(`Error loading ${layer}:`, error)
            }
          }
          setLayers(layers)
        }
        loadLayers()
      }, [])

      const handleTraitChange = (layer, trait) => {
        setSelectedTraits(prev => ({
          ...prev,
          [layer]: trait
        }))
      }

      return (
        <div className="App">
          <h1>NFT Image Generator</h1>
          <div className="image-container">
            {LAYER_ORDER.map(layer => (
              selectedTraits[layer] && (
                <img
                  key={layer}
                  src={selectedTraits[layer]}
                  alt={layer}
                  className="layer"
                />
              )
            ))}
          </div>
          <div className="controls">
            {Object.entries(layers).map(([layer, traits]) => (
              <div key={layer} className="layer-control">
                <h3>{layer}</h3>
                <div className="trait-selector">
                  {traits.map(trait => (
                    <img
                      key={trait}
                      src={trait}
                      alt={trait}
                      onClick={() => handleTraitChange(layer, trait)}
                      className={`trait ${selectedTraits[layer] === trait ? 'selected' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    export default App
