// Leaflet Interactive Map for Health On Wheels
class LeafletMap {
    constructor() {
        this.map = null;
        this.geoJsonLayer = null;
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
        console.log('Open button:', openMapBtn);
        console.log('Close button:', closeMapBtn);
        console.log('Modal:', modal);

        if (openMapBtn) {
            openMapBtn.addEventListener('click', (e) => {
                console.log('LeafletMap: Open button clicked!');
                e.preventDefault();
                this.showModal();
            });
        } else {
            console.error('LeafletMap: Open button not found!');
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

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                console.log('LeafletMap: Escape key pressed');
                this.hideModal();
            }
        });
    }

    showModal() {
        const modal = document.getElementById('map-modal');
        console.log('LeafletMap: Showing modal...', modal);
        
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Initialiser la carte quand le modal s'ouvre
            setTimeout(() => {
                if (!this.map) {
                    console.log('LeafletMap: Initializing map...');
                    this.initializeMap();
                } else {
                    console.log('LeafletMap: Invalidating map size...');
                    this.map.invalidateSize();
                }
            }, 300);
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
        
        setTimeout(() => {
            try {
                if (this.map) {
                    this.map.remove();
                }
                
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
                
                // Créer la carte dans le conteneur du modal
                this.map = L.map('leaflet-map', {
                    center: [20, 0],
                    zoom: 2.5,
                    minZoom: 2
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: 'OpenStreetMap contributors'
                }).addTo(this.map);

                console.log('LeafletMap: Map initialized successfully');

                // Load GeoJSON data (continue même si erreur)
                this.loadGeoJSON();

                // Add custom legend (qui crée le dashboard)
                this.addCustomLegend();

                // Add country labels (continue même si erreur)
                this.addCountryLabels();

                // Add labels to GeoJSON countries (continue même si erreur)
                this.addLabelsToCountries();

                console.log('LeafletMap: All map components loaded');
            } catch (error) {
                console.error('LeafletMap: Error initializing map:', error);
                // Ne pas afficher l'erreur immédiatement, essayer de continuer
                console.log('LeafletMap: Attempting to continue despite error...');
            }
        }, 300);
    }

    loadGeoJSON() {
        console.log('LeafletMap: Loading GeoJSON data...');
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(response => {
                console.log('LeafletMap: GeoJSON response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('LeafletMap: GeoJSON data loaded, features:', data.features.length);
                
                // Add GeoJSON layer to map
                this.geoJsonLayer = L.geoJSON(data, {
                    style: (feature) => {
                        const countryCode = feature.properties.iso_a2;
                        const region = this.getRegion(countryCode);
                        return {
                            fillColor: this.getRegionColor(region),
                            weight: 1,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        };
                    },
                    onEachFeature: (feature, layer) => {
                        const countryName = this.targetCountries[feature.properties.iso_a2];
                        if (countryName) {
                            layer.bindTooltip(countryName, {
                                permanent: false,
                                sticky: true,
                                className: 'country-tooltip'
                            });
                        }
                    }
                }).addTo(this.map);
                
                // Fit map to show all countries
                if (this.geoJsonLayer) {
                    this.map.fitBounds(this.geoJsonLayer.getBounds());
                }
                
                console.log('LeafletMap: GeoJSON layer added to map');
            })
            .catch(error => {
                console.error('LeafletMap: Error loading GeoJSON:', error);
                // Continuer sans GeoJSON
                console.log('LeafletMap: Continuing without GeoJSON data...');
            });
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
            latin: 'Amérique latine',
            middleEast: 'Moyen-Orient & Afrique du Nord',
            other: 'Autre'
        };
        return regionNames[region] || 'Autre';
    }

    // Ajouter un dashboard premium sous la carte
    addCustomLegend() {
        // Le dashboard sera inséré dans la section dashboard du HTML
        const dashboardContainer = document.getElementById('dashboard-content');
        if (dashboardContainer) {
            // Calculer les statistiques exactes
            const africaCount = this.getRegionCountriesCount('africa');
            const asiaCount = this.getRegionCountriesCount('asia');
            const latinCount = this.getRegionCountriesCount('latin');
            const middleEastCount = this.getRegionCountriesCount('middleEast');
            
            // Calculer le total des pays ciblés
            const totalTargetCountries = africaCount + asiaCount + latinCount + middleEastCount;
            
            dashboardContainer.innerHTML = `
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        width: 16px;
                        height: 16px;
                        background: #ff6b35;
                        border: 2px solid white;
                        border-radius: 3px;
                        margin-right: 12px;
                        flex-shrink: 0;
                        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
                    "></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 2px;">Afrique</div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 500;">Priorité Absolue</div>
                    </div>
                    <div style="
                        font-size: 18px;
                        font-weight: 800;
                        color: #ff6b35;
                        text-shadow: 0 2px 4px rgba(255, 107, 53, 0.2);
                    ">${africaCount}</div>
                </div>
                
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        width: 16px;
                        height: 16px;
                        background: #ffd93d;
                        border: 2px solid white;
                        border-radius: 3px;
                        margin-right: 12px;
                        flex-shrink: 0;
                        box-shadow: 0 2px 8px rgba(255, 217, 61, 0.3);
                    "></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 2px;">Asie & Pacifique</div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 500;">Priorité 2</div>
                    </div>
                    <div style="
                        font-size: 18px;
                        font-weight: 800;
                        color: #ffd93d;
                        text-shadow: 0 2px 4px rgba(255, 217, 61, 0.2);
                    ">${asiaCount}</div>
                </div>
                
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        width: 16px;
                        height: 16px;
                        background: #6bcf7f;
                        border: 2px solid white;
                        border-radius: 3px;
                        margin-right: 12px;
                        flex-shrink: 0;
                        box-shadow: 0 2px 8px rgba(107, 207, 127, 0.3);
                    "></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 2px;">Amérique Latine</div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 500;">Priorité 3</div>
                    </div>
                    <div style="
                        font-size: 18px;
                        font-weight: 800;
                        color: #6bcf7f;
                        text-shadow: 0 2px 4px rgba(107, 207, 127, 0.2);
                    ">${latinCount}</div>
                </div>
                
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        width: 16px;
                        height: 16px;
                        background: #4a90e2;
                        border: 2px solid white;
                        border-radius: 3px;
                        margin-right: 12px;
                        flex-shrink: 0;
                        box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
                    "></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 2px;">Moyen-Orient</div>
                        <div style="font-size: 12px; color: #64748b; font-weight: 500;">Priorité 4</div>
                    </div>
                    <div style="
                        font-size: 18px;
                        font-weight: 800;
                        color: #4a90e2;
                        text-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
                    ">${middleEastCount}</div>
                </div>
                
                <div style="
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(30, 41, 59, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        width: 20px;
                        height: 20px;
                        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                        border: 3px solid white;
                        border-radius: 50%;
                        margin-right: 16px;
                        flex-shrink: 0;
                        box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
                    "></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 800; color: white; font-size: 16px; margin-bottom: 4px;">Total Mondial</div>
                        <div style="font-size: 13px; color: #cbd5e1; font-weight: 500;">Pays ciblés</div>
                    </div>
                    <div style="
                        font-size: 24px;
                        font-weight: 900;
                        color: #fbbf24;
                        text-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
                    ">${totalTargetCountries}</div>
                </div>
            `;
            
            // Ajouter des animations d'entrée
            const items = dashboardContainer.querySelectorAll('div');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }

    // Compter les pays par région (corrigé)
    getRegionCountriesCount(region) {
        const regionCountries = {
            africa: ['SN', 'ML', 'NE', 'BF', 'GN', 'CI', 'NG', 'GH', 'ET', 'KE', 'UG', 'TZ', 'RW', 'MG', 'CD', 'CF', 'TD', 'CM', 'MZ', 'AO', 'MW', 'ZM'],
            asia: ['IN', 'PK', 'BD', 'NP', 'BT', 'ID', 'PH', 'MM', 'LA', 'KH', 'VN', 'AF', 'UZ', 'TJ'],
            latin: ['BR', 'BO', 'PE', 'CO', 'EC', 'PY', 'GT', 'HN', 'HT', 'NI'],
            middleEast: ['YE', 'SY', 'IQ', 'MA', 'MR']
        };
        
        if (!regionCountries[region]) return 0;
        return regionCountries[region].filter(code => this.targetCountries[code]).length;
    }

    // Ajouter les labels des pays ciblés avec marqueurs carrés très simples
    addCountryLabels() {
        // Coordonnées approximatives des capitales pour les labels
        const capitalCoordinates = {
            'SN': [14.7, -17.5],    // Dakar
            'ML': [12.6, -8.0],     // Bamako
            'NE': [13.5, 2.1],      // Niamey
            'BF': [12.4, -1.5],     // Ouagadougou
            'GN': [9.6, -13.6],     // Conakry
            'CI': [5.3, -4.0],      // Yamoussoukro
            'NG': [9.1, 7.4],       // Abuja
            'GH': [5.6, -0.2],      // Accra
            'ET': [9.0, 40.1],      // Addis Abeba
            'KE': [-1.3, 36.8],     // Nairobi
            'UG': [0.3, 32.6],      // Kampala
            'TZ': [-6.2, 35.7],     // Dodoma
            'RW': [-1.9, 30.1],     // Kigali
            'MG': [-18.9, 47.5],    // Antananarivo
            'CD': [-4.3, 15.3],     // Kinshasa
            'CF': [4.4, 20.6],      // Bangui
            'TD': [15.6, 18.4],     // N'Djamena
            'CM': [3.9, 11.5],      // Yaoundé
            'MZ': [-25.9, 32.6],    // Maputo
            'AO': [-11.5, 17.9],    // Luanda
            'MW': [-13.3, 34.1],    // Lilongwe
            'ZM': [-15.4, 28.3],    // Lusaka
            'IN': [28.6, 77.2],      // New Delhi
            'PK': [33.7, 73.0],     // Islamabad
            'BD': [23.8, 90.4],     // Dhaka
            'NP': [27.7, 85.3],     // Kathmandu
            'BT': [27.5, 89.6],     // Thimphu
            'ID': [-6.2, 106.8],    // Jakarta
            'PH': [14.6, 121.0],    // Manila
            'MM': [19.9, 95.1],     // Naypyidaw
            'LA': [17.9, 102.6],    // Vientiane
            'KH': [11.6, 104.9],    // Phnom Penh
            'VN': [21.0, 105.8],    // Hanoi
            'AF': [33.9, 67.7],     // Kabul
            'UZ': [41.3, 69.8],     // Tashkent
            'TJ': [38.6, 68.8],     // Dushanbe
            'BR': [-15.8, -47.9],   // Brasília
            'BO': [-16.5, -68.1],   // La Paz
            'PE': [-12.0, -77.0],   // Lima
            'CO': [4.6, -74.1],     // Bogotá
            'EC': [-0.2, -78.5],    // Quito
            'PY': [-25.3, -57.6],   // Asunción
            'GT': [14.6, -90.5],    // Guatemala City
            'HN': [14.1, -87.2],    // Tegucigalpa
            'HT': [18.6, -72.3],    // Port-au-Prince
            'NI': [12.1, -86.2],    // Managua
            'YE': [15.4, 44.2],     // Sana'a
            'SY': [33.5, 36.3],     // Damascus
            'IQ': [33.3, 44.4],     // Baghdad
            'MA': [33.9, -6.9],     // Rabat
            'MR': [18.1, -15.9]     // Nouakchott
        };

        try {
            // Ajouter les labels pour les pays ciblés avec marqueurs carrés très simples
            Object.entries(capitalCoordinates).forEach(([code, coords]) => {
                if (this.targetCountries[code]) {
                    const countryName = this.targetCountries[code];
                    const region = this.getRegion(code);
                    
                    // Couleurs des marqueurs selon la région
                    const markerColors = {
                        africa: '#ff6b35',
                        asia: '#ffd93d',
                        latin: '#6bcf7f',
                        middleEast: '#4a90e2'
                    };
                    
                    // Adapter le nom pour les longs noms
                    const displayName = countryName.length > 15 ? countryName.substring(0, 13) + '...' : countryName;
                    
                    // Créer un label très simple
                    const label = L.divIcon({
                        className: 'country-label',
                        html: `<div style="
                            display: flex;
                            align-items: center;
                            pointer-events: none;
                        ">
                            <div style="
                                width: 12px;
                                height: 12px;
                                background: ${markerColors[region]};
                                border: 2px solid white;
                                border-radius: 2px;
                                margin-right: 6px;
                                flex-shrink: 0;
                            "></div>
                            <div style="
                                font-size: 11px;
                                font-weight: 600;
                                color: #1e293b;
                                white-space: nowrap;
                                text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
                            ">${displayName}</div>
                        </div>`,
                        iconSize: [0, 0],
                        iconAnchor: [0, 0]
                    });
                    
                    L.marker(coords, { icon: label }).addTo(this.map);
                }
            });

            console.log('LeafletMap: Country labels added with very simple square markers');
        } catch (error) {
            console.error('LeafletMap: Error adding country labels:', error);
            console.log('LeafletMap: Continuing without country labels...');
        }
    }

    // Ajouter les labels sur les pays GeoJSON avec marqueurs carrés très simples
    addLabelsToCountries() {
        if (!this.geoJsonLayer) {
            console.log('LeafletMap: No GeoJSON layer found, skipping labels');
            return;
        }

        try {
            this.geoJsonLayer.eachLayer((layer) => {
                const feature = layer.feature;
                const countryCode = feature.properties.iso_a2;
                const countryName = this.targetCountries[countryCode];
                
                if (countryName) {
                    // Calculer le centre du polygone
                    const bounds = layer.getBounds();
                    const center = bounds.getCenter();
                    const region = this.getRegion(countryCode);
                    
                    // Couleurs des marqueurs selon la région
                    const markerColors = {
                        africa: '#ff6b35',
                        asia: '#ffd93d',
                        latin: '#6bcf7f',
                        middleEast: '#4a90e2'
                    };
                    
                    // Adapter le nom pour les longs noms
                    const displayName = countryName.length > 15 ? countryName.substring(0, 13) + '...' : countryName;
                    
                    // Créer un label très simple
                    const label = L.divIcon({
                        className: 'country-label-geo',
                        html: `<div style="
                            display: flex;
                            align-items: center;
                            pointer-events: none;
                        ">
                            <div style="
                                width: 10px;
                                height: 10px;
                                background: ${markerColors[region]};
                                border: 2px solid white;
                                border-radius: 2px;
                                margin-right: 5px;
                                flex-shrink: 0;
                            "></div>
                            <div style="
                                font-size: 10px;
                                font-weight: 600;
                                color: #1e293b;
                                white-space: nowrap;
                                text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
                            ">${displayName}</div>
                        </div>`,
                        iconSize: [0, 0],
                        iconAnchor: [0, 0]
                    });
                    
                    L.marker(center, { icon: label }).addTo(this.map);
                }
            });

            console.log('LeafletMap: GeoJSON country labels added with very simple square markers');
        } catch (error) {
            console.error('LeafletMap: Error adding GeoJSON labels:', error);
            console.log('LeafletMap: Continuing without GeoJSON labels...');
        }
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
    window.leafletMapInstance = new LeafletMap();
    
    // Setup event listeners after a short delay to ensure DOM is ready
    setTimeout(() => {
        window.leafletMapInstance.setupModalListeners();
    }, 100);
});
