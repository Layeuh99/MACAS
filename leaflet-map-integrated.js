// Leaflet Interactive Map for Health On Wheels - VERSION FINALE CORRIGÉE
class LeafletMap {
    constructor() {
        this.map = null;
        this.geoJsonLayer = null;
        this.labelLayer = null;
        this.targetCountries = {
            'SN': 'Sénégal', 'ML': 'Mali', 'NE': 'Niger', 'BF': 'Burkina Faso', 'GN': 'Guinée',
            'CI': "Côte d'Ivoire", 'NG': 'Nigeria', 'GH': 'Ghana', 'ET': 'Éthiopie', 'KE': 'Kenya',
            'UG': 'Ouganda', 'TZ': 'Tanzanie', 'RW': 'Rwanda', 'MG': 'Madagascar', 'CD': 'Congo',
            'CF': 'Centrafrique', 'TD': 'Tchad', 'CM': 'Cameroun', 'MZ': 'Mozambique', 'AO': 'Angola',
            'MW': 'Malawi', 'ZM': 'Zambie', 'IN': 'Inde', 'PK': 'Pakistan', 'BD': 'Bangladesh',
            'NP': 'Népal', 'BT': 'Bhoutan', 'ID': 'Indonésie', 'PH': 'Philippines', 'MM': 'Myanmar',
            'LA': 'Laos', 'KH': 'Cambodge', 'VN': 'Viêt Nam', 'AF': 'Afghanistan', 'UZ': 'Ouzbékistan',
            'TJ': 'Tadjikistan', 'BR': 'Brésil', 'BO': 'Bolivie', 'PE': 'Pérou', 'CO': 'Colombie',
            'EC': 'Équateur', 'PY': 'Paraguay', 'GT': 'Guatemala', 'HN': 'Honduras', 'HT': 'Haïti',
            'NI': 'Nicaragua', 'YE': 'Yémen', 'SY': 'Syrie', 'IQ': 'Irak', 'MA': 'Maroc',
            'MR': 'Mauritanie'
        };
        
        console.log('LeafletMap: Constructor completed');
    }

    setupModalListeners() {
        const openMapBtn = document.getElementById('open-map-btn');
        const closeMapBtn = document.getElementById('close-map-modal');
        const modalOverlay = document.getElementById('map-modal-overlay');
        const modal = document.getElementById('map-modal');

        console.log('LeafletMap: Setting up event listeners...');

        if (openMapBtn) {
            openMapBtn.addEventListener('click', (e) => {
                console.log('LeafletMap: Open button clicked!');
                e.preventDefault();
                e.stopPropagation();
                this.showModal();
            });
        }

        if (closeMapBtn) {
            closeMapBtn.addEventListener('click', () => {
                console.log('LeafletMap: Close button clicked');
                this.hideModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                console.log('LeafletMap: Overlay clicked');
                this.hideModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                console.log('LeafletMap: Escape key pressed');
                this.hideModal();
            }
        });
    }

    showModal() {
        const modal = document.getElementById('map-modal');
        console.log('LeafletMap: Showing modal...');
        
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                if (!this.map) {
                    console.log('LeafletMap: Initializing map...');
                    this.initializeMap();
                } else {
                    console.log('LeafletMap: Map already exists, invalidating size...');
                    this.map.invalidateSize();
                }
            }, 100);
        } else {
            console.error('LeafletMap: Modal not found!');
        }
    }

    hideModal() {
        const modal = document.getElementById('map-modal');
        console.log('LeafletMap: Hiding modal...');
        
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    initializeMap() {
        console.log('LeafletMap: Initializing map...');
        
        try {
            // Vérifier que Leaflet est disponible
            if (typeof L === 'undefined') {
                console.error('LeafletMap: Leaflet library not loaded!');
                this.showMapError();
                return;
            }
            
            // Vérifier que le conteneur existe
            const mapContainer = document.getElementById('leaflet-map');
            if (!mapContainer) {
                console.error('LeafletMap: Map container not found!');
                this.showMapError();
                return;
            }
            
            console.log('LeafletMap: Map container found:', mapContainer);
            
            // S'assurer que le conteneur a une taille
            mapContainer.style.width = '100%';
            mapContainer.style.height = '100%';
            mapContainer.style.minHeight = '400px';
            
            // Supprimer l'ancienne carte si elle existe
            if (this.map) {
                this.map.remove();
                this.map = null;
            }
            
            console.log('LeafletMap: Creating map instance...');
            
            // Créer la carte avec des options optimales
            this.map = L.map('leaflet-map', {
                center: [20, 0],
                zoom: 2.5,
                minZoom: 2,
                maxZoom: 18,
                worldCopyJump: true,
                preferCanvas: true
            });
            
            console.log('LeafletMap: Map instance created:', this.map);
            
            // Ajouter les tiles OpenStreetMap
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            });
            
            tileLayer.addTo(this.map);
            console.log('LeafletMap: Tile layer added');

            // Charger le GeoJSON et créer les labels
            this.loadGeoJSONWithLabels();

            console.log('LeafletMap: Map initialized successfully');
            
        } catch (error) {
            console.error('LeafletMap: Error initializing map:', error);
            this.showMapError();
        }
    }

    loadGeoJSONWithLabels() {
        console.log('LeafletMap: Loading GeoJSON data with labels...');
        
        // URL GeoJSON du monde réel
        const geoJsonUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
        
        fetch(geoJsonUrl)
            .then(response => {
                console.log('LeafletMap: GeoJSON response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('LeafletMap: GeoJSON data loaded, features:', data.features.length);
                
                // Créer le layer GeoJSON avec style et labels
                this.geoJsonLayer = L.geoJSON(data, {
                    style: (feature) => {
                        const countryCode = feature.properties.iso_a2;
                        const region = this.getRegion(countryCode);
                        const isTarget = this.targetCountries[countryCode];
                        
                        return {
                            fillColor: isTarget ? this.getRegionColor(region) : '#e0e0e0',
                            weight: 1,
                            opacity: 1,
                            color: 'white',
                            dashArray: isTarget ? '3' : '1',
                            fillOpacity: isTarget ? 0.7 : 0.3
                        };
                    },
                    onEachFeature: (feature, layer) => {
                        const countryCode = feature.properties.iso_a2;
                        const countryName = this.targetCountries[countryCode];
                        const region = this.getRegion(countryCode);
                        
                        if (countryName) {
                            // Tooltip au survol
                            layer.bindTooltip(`
                                <div style="padding: 8px;">
                                    <strong style="color: #1e293b; font-size: 14px;">${countryName}</strong><br>
                                    <span style="color: #64748b; font-size: 12px;">Région: ${this.getRegionName(region)}</span>
                                </div>
                            `, {
                                permanent: false,
                                sticky: true,
                                className: 'country-tooltip'
                            });
                            
                            // Label permanent sur la carte
                            this.addPermanentLabel(feature, countryName, region);
                        }
                    }
                }).addTo(this.map);
                
                // Créer la légende
                this.createLegend();
                
                // Ajuster la vue pour montrer tous les pays
                if (this.geoJsonLayer) {
                    this.map.fitBounds(this.geoJsonLayer.getBounds());
                }
                
                console.log('LeafletMap: GeoJSON layer with labels added to map');
            })
            .catch(error => {
                console.error('LeafletMap: Error loading GeoJSON:', error);
                this.showMapError();
            });
    }

    addPermanentLabel(feature, countryName, region) {
        // Obtenir le centre géométrique du pays
        const bounds = feature.geometry.type === 'Polygon' 
            ? L.polygon(feature.geometry.coordinates).getBounds()
            : L.multiPolygon(feature.geometry.coordinates).getBounds();
        
        const center = bounds.getCenter();
        
        // Créer un label permanent avec fond semi-transparent
        const labelIcon = L.divIcon({
            className: 'permanent-country-label',
            html: `
                <div style="
                    background: rgba(255, 255, 255, 0.9);
                    border: 2px solid ${this.getRegionColor(region)};
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-size: 11px;
                    font-weight: 600;
                    color: #1e293b;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
                ">
                    ${countryName}
                </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
        });
        
        L.marker(center, { icon: labelIcon }).addTo(this.map);
    }

    createLegend() {
        const legend = L.control({ position: 'topright' });
        
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'map-legend');
            div.style.background = 'rgba(255, 255, 255, 0.95)';
            div.style.padding = '15px';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
            div.style.maxWidth = '200px';
            
            div.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; font-weight: 700;">50 Pays Ciblés</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #ff6b35; border-radius: 3px; border: 1px solid white;"></div>
                        <span style="color: #1e293b; font-size: 13px;">Afrique (22 pays)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #ffd93d; border-radius: 3px; border: 1px solid white;"></div>
                        <span style="color: #1e293b; font-size: 13px;">Asie & Pacifique (14 pays)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #6bcf7f; border-radius: 3px; border: 1px solid white;"></div>
                        <span style="color: #1e293b; font-size: 13px;">Amérique Latine (10 pays)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 16px; height: 16px; background: #4a90e2; border-radius: 3px; border: 1px solid white;"></div>
                        <span style="color: #1e293b; font-size: 13px;">Moyen-Orient (4 pays)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <div style="width: 16px; height: 16px; background: #e0e0e0; border-radius: 3px; border: 1px solid white;"></div>
                        <span style="color: #64748b; font-size: 13px;">Autres pays</span>
                    </div>
                </div>
            `;
            
            return div;
        };
        
        legend.addTo(this.map);
    }

    getRegion(countryCode) {
        const regionCountries = {
            africa: ['SN', 'ML', 'NE', 'BF', 'GN', 'CI', 'NG', 'GH', 'ET', 'KE', 'UG', 'TZ', 'RW', 'MG', 'CD', 'CF', 'TD', 'CM', 'MZ', 'AO', 'MW', 'ZM'],
            asia: ['IN', 'PK', 'BD', 'NP', 'BT', 'ID', 'PH', 'MM', 'LA', 'KH', 'VN', 'AF', 'UZ', 'TJ'],
            latin: ['BR', 'BO', 'PE', 'CO', 'EC', 'PY', 'GT', 'HN', 'HT', 'NI'],
            middleEast: ['YE', 'SY', 'IQ', 'MA', 'MR']
        };
        
        for (const [region, countries] of Object.entries(regionCountries)) {
            if (countries.includes(countryCode)) {
                return region;
            }
        }
        return 'other';
    }

    getRegionColor(region) {
        const colors = {
            africa: '#ff6b35',
            asia: '#ffd93d',
            latin: '#6bcf7f',
            middleEast: '#4a90e2',
            other: '#e0e0e0'
        };
        return colors[region] || colors.other;
    }

    getRegionName(region) {
        const regionNames = {
            africa: 'Afrique',
            asia: 'Asie & Pacifique',
            latin: 'Amérique Latine',
            middleEast: 'Moyen-Orient & Afrique du Nord',
            other: 'Autre'
        };
        return regionNames[region] || 'Autre';
    }

    showMapError() {
        const mapContainer = document.getElementById('leaflet-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    flex-direction: column;
                    text-align: center;
                    padding: 20px;
                    color: #64748b;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                ">
                    <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                    <h3 style="margin-bottom: 8px; color: #1e293b;">Carte non disponible</h3>
                    <p>Impossible de charger la carte interactive. Veuillez réessayer plus tard.</p>
                </div>
            `;
        }
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('LeafletMap: DOM loaded, initializing map...');
    
    // Créer l'instance immédiatement
    window.leafletMapInstance = new LeafletMap();
    
    // Setup event listeners immédiatement
    window.leafletMapInstance.setupModalListeners();
    
    console.log('LeafletMap: Setup completed');
});
