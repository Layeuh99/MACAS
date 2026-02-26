// Leaflet Interactive Map for Health On Wheels
class LeafletMapModal {
    constructor() {
        this.modal = document.getElementById('map-modal');
        this.modalOverlay = document.getElementById('map-modal-overlay');
        this.closeBtn = document.getElementById('close-map-modal');
        this.openMapBtn = null;
        this.map = null;
        this.geoJsonLayer = null;
        
        this.targetCountries = {
            // Afrique
            'SN': 'Sénégal', 'ML': 'Mali', 'NE': 'Niger', 'BF': 'Burkina Faso',
            'GN': 'Guinée', 'CI': 'Côte d\'Ivoire', 'NG': 'Nigeria', 'GH': 'Ghana',
            'ET': 'Éthiopie', 'KE': 'Kenya', 'UG': 'Ouganda', 'TZ': 'Tanzanie',
            'RW': 'Rwanda', 'MG': 'Madagascar', 'CD': 'RDC', 'CF': 'Centrafrique',
            'TD': 'Tchad', 'CM': 'Cameroun', 'MZ': 'Mozambique', 'AO': 'Angola',
            'MW': 'Malawi', 'ZM': 'Zambie',
            
            // Asie & Pacifique
            'IN': 'Inde', 'PK': 'Pakistan', 'BD': 'Bangladesh', 'NP': 'Népal',
            'BT': 'Bhoutan', 'ID': 'Indonésie', 'PH': 'Philippines', 'MM': 'Myanmar',
            'LA': 'Laos', 'KH': 'Cambodge', 'VN': 'Vietnam', 'AF': 'Afghanistan',
            'UZ': 'Ouzbékistan', 'TJ': 'Tadjikistan',
            
            // Amérique latine & Caraïbes
            'BR': 'Brésil', 'BO': 'Bolivie', 'PE': 'Pérou', 'CO': 'Colombie',
            'EC': 'Équateur', 'PY': 'Paraguay', 'GT': 'Guatemala', 'HN': 'Honduras',
            'HT': 'Haïti', 'NI': 'Nicaragua',
            
            // Moyen-Orient & Afrique du Nord
            'YE': 'Yémen', 'SY': 'Syrie', 'IQ': 'Irak', 'MA': 'Maroc', 'MR': 'Mauritanie'
        };

        this.regionColors = {
            africa: '#ff6b35',
            asia: '#ffd93d',
            latin: '#6bcf7f',
            middleEast: '#4a90e2',
            other: '#e0e0e0'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLanguageSupport();
        this.loadLeaflet();
    }

    loadLeaflet() {
        // Charger Leaflet CSS si pas déjà chargé
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            const leafletCSS = document.createElement('link');
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(leafletCSS);
        }

        // Charger Leaflet JS si pas déjà chargé
        if (!window.L) {
            const leafletJS = document.createElement('script');
            leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletJS.onload = () => this.initializeMap();
            document.head.appendChild(leafletJS);
        } else {
            this.initializeMap();
        }
    }

    initializeMap() {
        if (!this.modal) return;

        // Créer le conteneur pour la carte s'il n'existe pas
        let mapContainer = this.modal.querySelector('#leaflet-world-map');
        if (!mapContainer) {
            // Trouver où insérer la carte (après les cartes contextuelles)
            const regionCards = this.modal.querySelector('.region-context-cards');
            const mapContainerDiv = document.createElement('div');
            mapContainerDiv.className = 'map-container';
            mapContainerDiv.id = 'leaflet-world-map';
            mapContainerDiv.style.cssText = `
                width: 100%;
                height: 400px;
                border-radius: 8px;
                margin: 20px 40px;
                position: relative;
                background: white;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            `;
            
            if (regionCards) {
                regionCards.parentNode.insertBefore(mapContainerDiv, regionCards.nextSibling);
            } else {
                this.modal.insertBefore(mapContainerDiv, this.modal.querySelector('.map-legend'));
            }
            
            mapContainer = mapContainerDiv;
        }

        // S'assurer que le conteneur est visible
        mapContainer.style.display = 'block';
        mapContainer.style.visibility = 'visible';
        mapContainer.style.opacity = '1';

        console.log('LeafletMap: Map container created/found:', mapContainer);

        // Initialiser la carte Leaflet avec un petit délai
        setTimeout(() => {
            try {
                if (this.map) {
                    this.map.remove();
                }
                
                this.map = L.map('leaflet-world-map', {
                    center: [20, 0],
                    zoom: 2.5,
                    minZoom: 2,
                    maxZoom: 6,
                    worldCopyJump: true,
                    attributionControl: false,
                    zoomControl: true
                });

                console.log('LeafletMap: Map initialized');

                // Ajouter le fond de carte OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19
                }).addTo(this.map);

                console.log('LeafletMap: Tile layer added');

                // Ajouter la légende personnalisée
                this.addCustomLegend();
                
                // Ajouter les labels des pays ciblés
                this.addCountryLabels();

                // Charger les données GeoJSON
                this.loadGeoJSON();
            } catch (error) {
                console.error('LeafletMap: Error initializing map:', error);
                this.showMapError();
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
                
                // Supprimer l'ancienne couche si elle existe
                if (this.geoJsonLayer) {
                    this.map.removeLayer(this.geoJsonLayer);
                }
                
                this.geoJsonLayer = L.geoJSON(data, {
                    style: (feature) => this.getCountryStyle(feature),
                    onEachFeature: (feature, layer) => this.setupFeatureEvents(feature, layer)
                }).addTo(this.map);

                console.log('LeafletMap: GeoJSON layer added to map');

                // Ajouter les labels sur les pays ciblés
                this.addLabelsToCountries();

                // Adapter la vue pour montrer tous les pays ciblés
                setTimeout(() => {
                    const bounds = this.geoJsonLayer.getBounds();
                    if (bounds.isValid()) {
                        this.map.fitBounds(bounds, { padding: [20, 20] });
                        console.log('LeafletMap: Map bounds fitted');
                    }
                }, 100);
                
                // Mettre à jour les statistiques
                this.updateStatistics();
            })
            .catch(error => {
                console.error('LeafletMap: Error loading GeoJSON:', error);
                this.showMapError();
            });
    }

    getCountryStyle(feature) {
        const countryCode = feature.properties.iso_a2;
        const isTarget = this.targetCountries.hasOwnProperty(countryCode);
        const region = this.getRegion(countryCode);
        
        // Couleurs exactes comme dans la légende
        const regionColors = {
            africa: '#ff6b35',      // Orange exact
            asia: '#ffd93d',        // Jaune exact
            latin: '#6bcf7f',       // Vert exact
            middleEast: '#4a90e2',  // Bleu exact
            other: '#e0e0e0'        // Gris exact
        };
        
        const regionStrokes = {
            africa: '#e55a2b',      // Orange foncé
            asia: '#e6c230',        // Jaune foncé
            latin: '#5ab86a',       // Vert foncé
            middleEast: '#3a7bc8',  // Bleu foncé
            other: '#c0c0c0'        // Gris foncé
        };
        
        return {
            fillColor: regionColors[region],
            weight: isTarget ? 2 : 1,
            opacity: 1,
            color: regionStrokes[region],
            fillOpacity: isTarget ? 0.8 : 0.3
        };
    }

    setupFeatureEvents(feature, layer) {
        const countryCode = feature.properties.iso_a2;
        const countryName = feature.properties.name;
        const isTarget = this.targetCountries.hasOwnProperty(countryCode);
        const region = this.getRegion(countryCode);
        const regionName = this.getRegionName(region);
        
        // Tooltip
        const tooltipContent = isTarget 
            ? `<strong>${this.targetCountries[countryCode] || countryName}</strong><br><em>${regionName}</em>`
            : `<strong>${countryName}</strong><br><em>Pays non ciblé</em>`;
        
        layer.bindTooltip(tooltipContent, {
            permanent: false,
            sticky: true,
            direction: 'top',
            offset: [0, -10],
            className: 'country-tooltip'
        });
        
        // Hover effects avec couleurs exactes
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                if (isTarget) {
                    // Couleurs de survol plus vives mais cohérentes
                    const hoverColors = {
                        africa: '#ff8c42',
                        asia: '#ffe066',
                        latin: '#7dd87d',
                        middleEast: '#5ba0f2',
                        other: '#f0f0f0'
                    };
                    
                    const hoverStrokes = {
                        africa: '#cc4a20',
                        asia: '#cca020',
                        latin: '#4a9a4a',
                        middleEast: '#2a80c0',
                        other: '#a0a0a0'
                    };
                    
                    layer.setStyle({
                        weight: 3,
                        color: hoverStrokes[region],
                        fillOpacity: 0.95,
                        fillColor: hoverColors[region]
                    });
                }
            },
            mouseout: (e) => {
                const layer = e.target;
                // Restaurer les couleurs originales exactes
                layer.setStyle(this.getCountryStyle(feature));
            }
        });
        
        // Click sur pays ciblés
        if (isTarget) {
            layer.on('click', (e) => {
                const popupContent = `
                    <div style="min-width: 200px;">
                        <h3 style="margin: 0 0 10px 0; color: #0ea5e9;">${this.targetCountries[countryCode]}</h3>
                        <p style="margin: 0 0 10px 0;"><strong>Région:</strong> ${regionName}</p>
                        <p style="margin: 0; font-size: 0.9rem; color: #666;">
                            Health On Wheels intervient dans ce pays pour apporter des soins de santé essentiels aux populations les plus vulnérables.
                        </p>
                    </div>
                `;
                layer.bindPopup(popupContent).openPopup();
            });
        }
    }

    getRegion(countryCode) {
        const africaCountries = ['SN', 'ML', 'NE', 'BF', 'GN', 'CI', 'NG', 'GH', 'ET', 'KE', 'UG', 'TZ', 'RW', 'MG', 'CD', 'CF', 'TD', 'CM', 'MZ', 'AO', 'MW', 'ZM'];
        const asiaCountries = ['IN', 'PK', 'BD', 'NP', 'BT', 'ID', 'PH', 'MM', 'LA', 'KH', 'VN', 'AF', 'UZ', 'TJ'];
        const latinCountries = ['BR', 'BO', 'PE', 'CO', 'EC', 'PY', 'GT', 'HN', 'HT', 'NI'];
        const middleEastCountries = ['YE', 'SY', 'IQ', 'MA', 'MR'];
        
        if (africaCountries.includes(countryCode)) return 'africa';
        if (asiaCountries.includes(countryCode)) return 'asia';
        if (latinCountries.includes(countryCode)) return 'latin';
        if (middleEastCountries.includes(countryCode)) return 'middleEast';
        return 'other';
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

    // Ajouter la légende personnalisée avec style standard et icônes
    addCustomLegend() {
        const legend = L.control({ position: 'bottomleft' });
        
        legend.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'leaflet-custom-legend');
            div.style.cssText = `
                background: white;
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 13px;
                line-height: 1.5;
                width: 220px;
                max-width: 220px;
                border: 1px solid #e2e8f0;
                margin: 10px;
                position: relative;
                z-index: 1000;
            `;
            
            // Calculer les statistiques exactes
            const africaCount = this.getRegionCountriesCount('africa');
            const asiaCount = this.getRegionCountriesCount('asia');
            const latinCount = this.getRegionCountriesCount('latin');
            const middleEastCount = this.getRegionCountriesCount('middleEast');
            
            // Calculer le total des pays ciblés
            const totalTargetCountries = africaCount + asiaCount + latinCount + middleEastCount;
            
            div.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 12px; color: #1e293b; font-size: 14px; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                    📍 Localisation des Interventions
                </div>
                
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                            <div style="
                                width: 16px;
                                height: 16px;
                                background: #ff6b35;
                                border: 2px solid white;
                                border-radius: 50%;
                                position: relative;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 6px;
                                    height: 6px;
                                    background: white;
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                        <div style="min-width: 0;">
                            <div style="font-weight: 600; color: #1e293b; font-size: 12px; white-space: nowrap;">Afrique</div>
                            <div style="font-size: 10px; color: #64748b;">${africaCount} pays ciblés</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                            <div style="
                                width: 16px;
                                height: 16px;
                                background: #ffd93d;
                                border: 2px solid white;
                                border-radius: 50%;
                                position: relative;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 6px;
                                    height: 6px;
                                    background: white;
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                        <div style="min-width: 0;">
                            <div style="font-weight: 600; color: #1e293b; font-size: 12px; white-space: nowrap;">Asie & Pacifique</div>
                            <div style="font-size: 10px; color: #64748b;">${asiaCount} pays ciblés</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                            <div style="
                                width: 16px;
                                height: 16px;
                                background: #6bcf7f;
                                border: 2px solid white;
                                border-radius: 50%;
                                position: relative;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 6px;
                                    height: 6px;
                                    background: white;
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                        <div style="min-width: 0;">
                            <div style="font-weight: 600; color: #1e293b; font-size: 12px; white-space: nowrap;">Amérique latine</div>
                            <div style="font-size: 10px; color: #64748b;">${latinCount} pays ciblés</div>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 6px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                            <div style="
                                width: 16px;
                                height: 16px;
                                background: #4a90e2;
                                border: 2px solid white;
                                border-radius: 50%;
                                position: relative;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 6px;
                                    height: 6px;
                                    background: white;
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                        <div style="min-width: 0;">
                            <div style="font-weight: 600; color: #1e293b; font-size: 12px; white-space: nowrap;">Moyen-Orient</div>
                            <div style="font-size: 10px; color: #64748b;">${middleEastCount} pays ciblés</div>
                        </div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
                    <div style="display: flex; align-items: center; padding: 6px; background: #f8fafc; border-radius: 6px; border: 1px solid #e2e8f0;">
                        <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
                            <div style="
                                width: 16px;
                                height: 16px;
                                background: #e0e0e0;
                                border: 2px solid white;
                                border-radius: 50%;
                                position: relative;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 6px;
                                    height: 6px;
                                    background: white;
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                        <div style="min-width: 0;">
                            <div style="font-weight: 600; color: #64748b; font-size: 12px; white-space: nowrap;">Autres pays</div>
                            <div style="font-size: 10px; color: #64748b;">126 pays non ciblés</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 12px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                    📊 ${totalTargetCountries} pays ciblés • 🌍 Source: Natural Earth Data
                </div>
            `;
            
            return div;
        };
        
        legend.addTo(this.map);
        console.log('LeafletMap: Standard legend with normal location markers added');
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

    // Ajouter les labels des pays ciblés avec icônes de localisation standards
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

        // Ajouter les labels pour les pays ciblés avec icônes de localisation standards
        Object.entries(capitalCoordinates).forEach(([code, coords]) => {
            if (this.targetCountries[code]) {
                const countryName = this.targetCountries[code];
                const region = this.getRegion(code);
                
                // Couleurs des icônes selon la région
                const iconColors = {
                    africa: '#ff6b35',
                    asia: '#ffd93d',
                    latin: '#6bcf7f',
                    middleEast: '#4a90e2'
                };
                
                // Adapter le nom pour les longs noms
                const displayName = countryName.length > 12 ? countryName.substring(0, 10) + '...' : countryName;
                
                const label = L.divIcon({
                    className: 'country-label',
                    html: `<div style="
                        display: flex;
                        align-items: center;
                        background: rgba(255, 255, 255, 0.95);
                        padding: 6px 12px;
                        border-radius: 8px;
                        border: 2px solid #e2e8f0;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        pointer-events: none;
                    ">
                        <div style="
                            width: 20px;
                            height: 20px;
                            margin-right: 8px;
                            flex-shrink: 0;
                        ">
                            <div style="
                                width: 16px;
                                height: 16px;
                                background: ${iconColors[region]};
                                border: 3px solid white;
                                border-radius: 50%;
                                position: relative;
                                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 8px;
                                    height: 8px;
                                    background: white;
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                        <div style="
                            font-size: 11px;
                            font-weight: 700;
                            color: #1e293b;
                            white-space: nowrap;
                            max-width: 100px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${displayName}</div>
                    </div>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                });
                
                L.marker(coords, { icon: label }).addTo(this.map);
            }
        });

        console.log('LeafletMap: Country labels added with standard location markers');
    }

    // Ajouter les labels sur les pays GeoJSON avec icônes de localisation standards
    addLabelsToCountries() {
        if (!this.geoJsonLayer) return;

        this.geoJsonLayer.eachLayer((layer) => {
            const feature = layer.feature;
            const countryCode = feature.properties.iso_a2;
            const countryName = this.targetCountries[countryCode];
            
            if (countryName) {
                // Calculer le centre du polygone
                const bounds = layer.getBounds();
                const center = bounds.getCenter();
                const region = this.getRegion(countryCode);
                
                // Couleurs des icônes selon la région
                const iconColors = {
                    africa: '#ff6b35',
                    asia: '#ffd93d',
                    latin: '#6bcf7f',
                    middleEast: '#4a90e2'
                };
                
                // Adapter le nom pour les longs noms
                const displayName = countryName.length > 12 ? countryName.substring(0, 10) + '...' : countryName;
                
                // Créer un label avec icône de localisation standard
                const label = L.divIcon({
                    className: 'country-label-geo',
                    html: `<div style="
                        display: flex;
                        align-items: center;
                        background: rgba(255, 255, 255, 0.95);
                        padding: 6px 12px;
                        border-radius: 8px;
                        border: 2px solid #e2e8f0;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        pointer-events: none;
                    ">
                        <div style="
                            width: 20px;
                            height: 20px;
                            margin-right: 8px;
                            flex-shrink: 0;
                        ">
                            <div style="
                                width: 16px;
                                height: 16px;
                                background: ${iconColors[region]};
                                border: 3px solid white;
                                border-radius: 50%;
                                position: relative;
                                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
                            ">
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    width: 8px;
                                    height: 8px;
                                    background: white;
                                    border-radius: 50%;
                                "></div>
                            </div>
                        </div>
                        <div style="
                            font-size: 11px;
                            font-weight: 700;
                            color: #1e293b;
                            white-space: nowrap;
                            max-width: 100px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${displayName}</div>
                    </div>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0]
                });
                
                L.marker(center, { icon: label }).addTo(this.map);
            }
        });

        console.log('LeafletMap: GeoJSON country labels added with standard location markers');
    }

    
    // Mettre à jour les statistiques avec données enrichies et cohérentes
    updateStatistics() {
        const statsContainer = this.modal.querySelector('.map-stats');
        if (statsContainer) {
            const totalCountries = Object.keys(this.targetCountries).length;
            const regions = new Set();
            
            // Compter les régions
            Object.keys(this.targetCountries).forEach(code => {
                regions.add(this.getRegion(code));
            });
            
            // Calculer les comptes exacts par région
            const africaCount = this.getRegionCountriesCount('africa');
            const asiaCount = this.getRegionCountriesCount('asia');
            const latinCount = this.getRegionCountriesCount('latin');
            const middleEastCount = this.getRegionCountriesCount('middleEast');
            
            // Calculer les populations estimées
            const populationData = {
                africa: { countries: africaCount, population: '1.4B', density: '45/km²' },
                asia: { countries: asiaCount, population: '4.6B', density: '150/km²' },
                latin: { countries: latinCount, population: '650M', density: '32/km²' },
                middleEast: { countries: middleEastCount, population: '450M', density: '25/km²' }
            };
            
            const totalPopulation = Object.values(populationData).reduce((sum, data) => {
                return sum + (data.population === '2B+' ? 2000000000 : parseInt(data.population.replace(/[^0-9]/g, '')) * 1000000);
            }, 0);
            
            statsContainer.innerHTML = `
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e8f2f7 100%); border-radius: 12px; padding: 20px; margin: 20px 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                    <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 16px; text-align: center;">📊 Statistiques des Interventions</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 16px;">
                        <div style="background: white; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 24px; font-weight: 700; color: #0ea5e9; margin-bottom: 4px;">${totalCountries}</div>
                            <div style="font-size: 12px; color: #64748b; font-weight: 500;">Pays ciblés</div>
                        </div>
                        
                        <div style="background: white; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 24px; font-weight: 700; color: #10b981; margin-bottom: 4px;">${regions.size}</div>
                            <div style="font-size: 12px; color: #64748b; font-weight: 500;">Régions couvertes</div>
                        </div>
                        
                        <div style="background: white; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 24px; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">${this.formatPopulation(totalPopulation)}</div>
                            <div style="font-size: 12px; color: #64748b; font-weight: 500;">Population totale</div>
                        </div>
                        
                        <div style="background: white; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
                            <div style="font-size: 24px; font-weight: 700; color: #8b5cf6; margin-bottom: 4px;">177</div>
                            <div style="font-size: 12px; color: #64748b; font-weight: 500;">Pays au total</div>
                        </div>
                    </div>
                    
                    <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0;">
                        <h4 style="font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 12px;">📈 Répartition par Région</h4>
                        
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="display: flex; align-items: center; padding: 8px; background: rgba(255, 107, 53, 0.1); border-radius: 6px;">
                                <div style="width: 12px; height: 12px; background: #ff6b35; border-radius: 2px; margin-right: 8px;"></div>
                                <div>
                                    <div style="font-weight: 600; color: #ff6b35;">Afrique</div>
                                    <div style="font-size: 10px; color: #64748b;">${africaCount} pays • ${populationData.africa.population}</div>
                                </div>
                            </div>
                            
                            <div style="display: flex; align-items: center; padding: 8px; background: rgba(255, 217, 61, 0.1); border-radius: 6px;">
                                <div style="width: 12px; height: 12px; background: #ffd93d; border-radius: 2px; margin-right: 8px;"></div>
                                <div>
                                    <div style="font-weight: 600; color: #d97706;">Asie & Pacifique</div>
                                    <div style="font-size: 10px; color: #64748b;">${asiaCount} pays • ${populationData.asia.population}</div>
                                </div>
                            </div>
                            
                            <div style="display: flex; align-items: center; padding: 8px; background: rgba(107, 207, 127, 0.1); border-radius: 6px;">
                                <div style="width: 12px; height: 12px; background: #6bcf7f; border-radius: 2px; margin-right: 8px;"></div>
                                <div>
                                    <div style="font-weight: 600; color: #059669;">Amérique latine</div>
                                    <div style="font-size: 10px; color: #64748b;">${latinCount} pays • ${populationData.latin.population}</div>
                                </div>
                            </div>
                            
                            <div style="display: flex; align-items: center; padding: 8px; background: rgba(74, 144, 226, 0.1); border-radius: 6px;">
                                <div style="width: 12px; height: 12px; background: #4a90e2; border-radius: 2px; margin-right: 8px;"></div>
                                <div>
                                    <div style="font-weight: 600; color: #2563eb;">Moyen-Orient & Afrique du Nord</div>
                                    <div style="font-size: 10px; color: #64748b;">${middleEastCount} pays • ${populationData.middleEast.population}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            console.log('LeafletMap: Enhanced statistics updated with exact counts');
        }
    }

    // Formater pour les nombres
    formatPopulation(num) {
        if (num >= 1000000000) {
            return (num / 1000000).toFixed(1) + 'B';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'M';
        }
        return num.toString();
    }

    showMapError() {
        console.log('LeafletMap: Showing map error');
        const mapContainer = document.getElementById('leaflet-world-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px; background: #f8f9fa;">
                    <div>
                        <h3 style="color: #e74c3c; margin-bottom: 15px;">Erreur de chargement</h3>
                        <p style="color: #666; margin-bottom: 15px;">Impossible de charger les données de la carte.</p>
                        <button onclick="location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Réessayer
                        </button>
                    </div>
                </div>
            `;
        }
    }

    setupEventListeners() {
        setTimeout(() => {
            // Open map button
            this.openMapBtn = document.getElementById('open-map-btn');
            if (this.openMapBtn) {
                this.openMapBtn.addEventListener('click', (e) => {
                    console.log('LeafletMap: Button clicked!');
                    e.preventDefault();
                    this.showModal();
                });
                console.log('LeafletMap: Button listener attached');
            }

            // Close modal
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.hideModal());
            }

            // Close on overlay
            if (this.modalOverlay) {
                this.modalOverlay.addEventListener('click', () => this.hideModal());
            }

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                    this.hideModal();
                }
            });

            // Global click backup
            document.addEventListener('click', (e) => {
                if (e.target === this.openMapBtn || e.target.closest('#open-map-btn')) {
                    this.showModal();
                }
            });
        }, 200);
    }

    setupLanguageSupport() {
        // Écouter les changements de langue
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                setTimeout(() => this.applyTranslations(), 150);
            }
        });
    }

    applyTranslations() {
        const currentLang = localStorage.getItem('language') || 'fr';
        
        if (!this.modal) return;
        
        // Appliquer les traductions
        const translatableElements = this.modal.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (window.translations && window.translations[currentLang] && window.translations[currentLang][key]) {
                element.textContent = window.translations[currentLang][key];
            }
        });
    }

    showModal() {
        console.log('LeafletMap: showModal called');
        if (this.modal) {
            console.log('LeafletMap: Modal found, showing...');
            
            // Forcer l'affichage du modal
            this.modal.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0, 0, 0, 0.8) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 999999 !important;
                opacity: 1 !important;
                visibility: visible !important;
            `;
            
            this.modal.classList.add('show');
            this.applyTranslations();
            document.body.style.overflow = 'hidden';
            
            console.log('LeafletMap: Modal should now be visible');
            
            // Initialiser la carte avec un délai plus long
            setTimeout(() => {
                console.log('LeafletMap: Initializing map after modal show...');
                this.initializeMap();
            }, 500);
        } else {
            console.error('LeafletMap: Modal not found!');
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

// Initialiser la carte Leaflet
let leafletMapInstance;

document.addEventListener('DOMContentLoaded', () => {
    leafletMapInstance = new LeafletMapModal();
});

if (document.readyState !== 'loading') {
    leafletMapInstance = new LeafletMapModal();
}

// Support des changements de langue
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lang-btn')) {
        setTimeout(() => {
            if (leafletMapInstance && leafletMapInstance.modal) {
                leafletMapInstance.applyTranslations();
            }
        }, 150);
    }
});
