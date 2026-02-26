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
        const openMapBtn = document.querySelector('.hero-cta .btn-primary');
        const closeMapBtn = document.querySelector('.modal-close');
        const modalOverlay = document.querySelector('.map-modal-overlay');
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
            
            // Créer le dashboard avec les données
            this.createDashboard();

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
            div.style.cssText = `
                background: white;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 13px;
                min-width: 180px;
            `;
            
            div.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 14px; font-weight: 600;">50 Pays Ciblés</h4>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <div style="width: 14px; height: 14px; background: #ff6b35; border-radius: 3px;"></div>
                    <span>Afrique (22 pays)</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <div style="width: 14px; height: 14px; background: #ffd93d; border-radius: 3px;"></div>
                    <span>Asie & Pacifique (14 pays)</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <div style="width: 14px; height: 14px; background: #6bcf7f; border-radius: 3px;"></div>
                    <span>Amérique Latine (10 pays)</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <div style="width: 14px; height: 14px; background: #4a90e2; border-radius: 3px;"></div>
                    <span>Moyen-Orient (4 pays)</span>
                </div>
                
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div style="width: 14px; height: 14px; background: #e0e0e0; border-radius: 3px;"></div>
                    <span>Autres pays</span>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 8px 0;">
                
                <div style="font-size: 11px; color: #64748b; line-height: 1.4;">
                    <div style="margin-bottom: 4px;"> Total: <strong>50 pays</strong></div>
                    <div style="margin-bottom: 4px;"> Population: <strong>5.2M</strong></div>
                    <div> Cliniques: <strong>55</strong></div>
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

    createDashboard() {
        const dashboardContainer = document.getElementById('dashboard-content');
        console.log('Dashboard container found:', dashboardContainer);
        
        if (!dashboardContainer) {
            console.error('Dashboard container not found!');
            return;
        }

        const regionStats = {
            africa: { countries: 22, population: '1.2M', clinics: 15 },
            asia: { countries: 14, population: '2.8M', clinics: 20 },
            latin: { countries: 10, population: '800K', clinics: 12 },
            middleEast: { countries: 4, population: '400K', clinics: 8 }
        };

        console.log('Creating dashboard with stats:', regionStats);

        dashboardContainer.innerHTML = `
            <div style="padding: 20px; height: 100%; overflow-y: auto;">
                <h3 style="margin-bottom: 20px; color: #1e293b; font-size: 18px;">Statistiques par Région</h3>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div style="width: 16px; height: 16px; background: #ff6b35; border-radius: 4px;"></div>
                        <span style="font-weight: 600;">Afrique</span>
                    </div>
                    <div style="margin-left: 24px; font-size: 14px; color: #64748b;">
                        <div>📍 ${regionStats.africa.countries} pays ciblés</div>
                        <div>👥 ${regionStats.africa.population} personnes desservies</div>
                        <div>🏥 ${regionStats.africa.clinics} cliniques mobiles</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div style="width: 16px; height: 16px; background: #ffd93d; border-radius: 4px;"></div>
                        <span style="font-weight: 600;">Asie & Pacifique</span>
                    </div>
                    <div style="margin-left: 24px; font-size: 14px; color: #64748b;">
                        <div>📍 ${regionStats.asia.countries} pays ciblés</div>
                        <div>👥 ${regionStats.asia.population} personnes desservies</div>
                        <div>🏥 ${regionStats.asia.clinics} cliniques mobiles</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div style="width: 16px; height: 16px; background: #6bcf7f; border-radius: 4px;"></div>
                        <span style="font-weight: 600;">Amérique Latine</span>
                    </div>
                    <div style="margin-left: 24px; font-size: 14px; color: #64748b;">
                        <div>📍 ${regionStats.latin.countries} pays ciblés</div>
                        <div>👥 ${regionStats.latin.population} personnes desservies</div>
                        <div>🏥 ${regionStats.latin.clinics} cliniques mobiles</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div style="width: 16px; height: 16px; background: #4a90e2; border-radius: 4px;"></div>
                        <span style="font-weight: 600;">Moyen-Orient & Afrique du Nord</span>
                    </div>
                    <div style="margin-left: 24px; font-size: 14px; color: #64748b;">
                        <div>📍 ${regionStats.middleEast.countries} pays ciblés</div>
                        <div>👥 ${regionStats.middleEast.population} personnes desservies</div>
                        <div>🏥 ${regionStats.middleEast.clinics} cliniques mobiles</div>
                    </div>
                </div>

                <div style="margin-top: 30px; padding: 16px; background: #f8fafc; border-radius: 8px;">
                    <h4 style="margin-bottom: 12px; color: #1e293b; font-size: 16px;">Impact Global</h4>
                    <div style="font-size: 14px; color: #64748b;">
                        <div>🌍 <strong>50 pays</strong> au total</div>
                        <div>👥 <strong>5.2M</strong> personnes desservies</div>
                        <div>🏥 <strong>55</strong> cliniques mobiles déployées</div>
                        <div>💊 <strong>2000+</strong> consultations par mois</div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Dashboard HTML set successfully');
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
