// Leaflet Interactive Map for Health On Wheels - VERSION FINALE CORRIGÉE
class LeafletMap {
    constructor() {
        this.map = null;
        this.geoJsonLayer = null;
        this.labelLayer = null;
        this.selectedRegion = null;
        this.hoverRegion = null;
        this.regionLabels = {
            africa: [],
            asia: [],
            latin: [],
            middleEast: [],
            other: []
        };
        this.regionColors = {
            africa: '#ff6b35',
            asia: '#ffd93d',
            latin: '#6bcf7f',
            middleEast: '#4a90e2',
            other: '#e0e0e0'
        };
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
        this.targetCountryNameMap = this.buildTargetCountryNameMap();
        
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
                worldCopyJump: true
            });
            
            console.log('LeafletMap: Map instance created:', this.map);
            
            // Ajouter les tiles OpenStreetMap
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            });
            
            tileLayer.addTo(this.map);
            console.log('LeafletMap: Tile layer added');

            // UI overlay in map
            this.ensureMapOverlay();

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
                    renderer: L.svg(),
                    interactive: true,
                    bubblingMouseEvents: true,
                    style: (feature) => {
                        const info = this.getCountryInfo(feature);
                        const region = info ? info.region : 'other';
                        const isTarget = Boolean(info);
                        
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
                        const info = this.getCountryInfo(feature);
                        const region = info ? info.region : 'other';
                        
                        if (info) {
                            // Label permanent sur la carte
                            this.addPermanentLabel(feature, region, info.displayName);
                        }

                        // Interaction: clic pour focus région + dashboard (même si non ciblé)
                        layer.on('click', () => {
                            if (info) {
                                this.setSelectedRegion(region);
                            } else {
                                this.clearSelection();
                            }
                        });
                        layer.on('mouseover', () => {
                            if (info) this.setHoverRegion(region);
                        });
                        layer.on('mouseout', () => this.clearHoverRegion());
                    }
                }).addTo(this.map);

                // Fallback click handler for map -> region (in case layer clicks fail)
                this.bindMapClickFallback();
                
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

    addPermanentLabel(feature, region, countryNameFr) {
        const lang = window.languageManager && typeof window.languageManager.getCurrentLanguage === 'function'
            ? window.languageManager.getCurrentLanguage()
            : 'fr';
        const countryName = lang === 'en' ? (feature.properties && feature.properties.name ? feature.properties.name : countryNameFr) : countryNameFr;
        // Obtenir le centre géométrique du pays (compat avec Polygon et MultiPolygon)
        let bounds;
        try {
            bounds = L.geoJSON(feature).getBounds();
        } catch (e) {
            console.warn('LeafletMap: Unable to compute bounds for label', feature, e);
            return;
        }
        if (!bounds || !bounds.isValid || !bounds.isValid()) {
            return;
        }
        const center = bounds.getCenter();
        
        const tooltip = L.tooltip({
            permanent: true,
            direction: 'center',
            className: 'country-label-tooltip',
            opacity: 1,
            interactive: false
        })
            .setLatLng(center)
            .setContent(`<div class="country-label">${countryName}</div>`);

        tooltip.addTo(this.map);
        if (this.regionLabels[region]) {
            this.regionLabels[region].push(tooltip);
        } else {
            this.regionLabels.other.push(tooltip);
        }
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

    normalizeCountryName(name) {
        return (name || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
    }

    buildTargetCountryNameMap() {
        const map = new Map();
        const add = (name, displayName, region) => {
            map.set(this.normalizeCountryName(name), { displayName, region });
        };

        // Base list (English names mapped to display name in French)
        add('Senegal', 'Sénégal', 'africa');
        add('Mali', 'Mali', 'africa');
        add('Niger', 'Niger', 'africa');
        add('Burkina Faso', 'Burkina Faso', 'africa');
        add('Guinea', 'Guinée', 'africa');
        add('Cote d\'Ivoire', "Côte d'Ivoire", 'africa');
        add('Ivory Coast', "Côte d'Ivoire", 'africa');
        add('Nigeria', 'Nigeria', 'africa');
        add('Ghana', 'Ghana', 'africa');
        add('Ethiopia', 'Éthiopie', 'africa');
        add('Kenya', 'Kenya', 'africa');
        add('Uganda', 'Ouganda', 'africa');
        add('Tanzania', 'Tanzanie', 'africa');
        add('United Republic of Tanzania', 'Tanzanie', 'africa');
        add('Rwanda', 'Rwanda', 'africa');
        add('Madagascar', 'Madagascar', 'africa');
        add('Democratic Republic of the Congo', 'Congo (RDC)', 'africa');
        add('Dem. Rep. Congo', 'Congo (RDC)', 'africa');
        add('Congo, Dem. Rep.', 'Congo (RDC)', 'africa');
        add('Central African Republic', 'Centrafrique', 'africa');
        add('Central African Rep.', 'Centrafrique', 'africa');
        add('Chad', 'Tchad', 'africa');
        add('Cameroon', 'Cameroun', 'africa');
        add('Mozambique', 'Mozambique', 'africa');
        add('Angola', 'Angola', 'africa');
        add('Malawi', 'Malawi', 'africa');
        add('Zambia', 'Zambie', 'africa');

        add('India', 'Inde', 'asia');
        add('Pakistan', 'Pakistan', 'asia');
        add('Bangladesh', 'Bangladesh', 'asia');
        add('Nepal', 'Népal', 'asia');
        add('Bhutan', 'Bhoutan', 'asia');
        add('Indonesia', 'Indonésie', 'asia');
        add('Philippines', 'Philippines', 'asia');
        add('Myanmar', 'Myanmar', 'asia');
        add('Laos', 'Laos', 'asia');
        add('Lao PDR', 'Laos', 'asia');
        add('Cambodia', 'Cambodge', 'asia');
        add('Vietnam', 'Viêt Nam', 'asia');
        add('Viet Nam', 'Viêt Nam', 'asia');
        add('Afghanistan', 'Afghanistan', 'asia');
        add('Uzbekistan', 'Ouzbékistan', 'asia');
        add('Tajikistan', 'Tadjikistan', 'asia');

        add('Brazil', 'Brésil', 'latin');
        add('Bolivia', 'Bolivie', 'latin');
        add('Peru', 'Pérou', 'latin');
        add('Colombia', 'Colombie', 'latin');
        add('Ecuador', 'Équateur', 'latin');
        add('Paraguay', 'Paraguay', 'latin');
        add('Guatemala', 'Guatemala', 'latin');
        add('Honduras', 'Honduras', 'latin');
        add('Haiti', 'Haïti', 'latin');
        add('Nicaragua', 'Nicaragua', 'latin');

        add('Yemen', 'Yémen', 'middleEast');
        add('Syria', 'Syrie', 'middleEast');
        add('Syrian Arab Republic', 'Syrie', 'middleEast');
        add('Iraq', 'Irak', 'middleEast');
        add('Morocco', 'Maroc', 'middleEast');
        add('Mauritania', 'Mauritanie', 'middleEast');

        return map;
    }

    getCountryInfo(feature) {
        if (!feature || !feature.properties || !feature.properties.name) return null;
        const nameKey = this.normalizeCountryName(feature.properties.name);
        return this.targetCountryNameMap.get(nameKey) || null;
    }

    getRegionColor(region) {
        return this.regionColors[region] || this.regionColors.other;
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

    getRegionNameT(region) {
        const keys = {
            africa: 'region-africa-name',
            asia: 'region-asia-name',
            latin: 'region-latin-name',
            middleEast: 'region-middle-east-name'
        };
        if (keys[region]) {
            return this.t(keys[region], this.getRegionName(region));
        }
        return this.getRegionName(region);
    }

    t(key, fallback) {
        if (window.languageManager && typeof window.languageManager.getTranslation === 'function') {
            const value = window.languageManager.getTranslation(key);
            if (value && value !== key) return value;
        }
        return fallback || key;
    }

    refreshLanguage() {
        this.createDashboard();
        this.updateSelectionUI();
        this.refreshLabels();
    }

    refreshLabels() {
        if (!this.map || !this.geoJsonLayer) return;
        Object.values(this.regionLabels).forEach(labels => {
            labels.forEach(label => {
                try {
                    this.map.removeLayer(label);
                } catch (e) {
                    // ignore
                }
            });
        });
        this.regionLabels = {
            africa: [],
            asia: [],
            latin: [],
            middleEast: [],
            other: []
        };

        this.geoJsonLayer.eachLayer(layer => {
            const info = this.getCountryInfo(layer.feature);
            if (info) {
                this.addPermanentLabel(layer.feature, info.region, info.displayName);
            }
        });

        this.updateLabelVisibility(this.selectedRegion || this.hoverRegion);
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
            middleEast: { countries: 5, population: '400K', clinics: 8 }
        };

        console.log('Creating dashboard with stats:', regionStats);

        const totalCountriesAll = Object.values(regionStats).reduce((sum, r) => sum + r.countries, 0);
        const totalClinicsAll = Object.values(regionStats).reduce((sum, r) => sum + r.clinics, 0);
        const totalPopulationAll = '5.2M';

        const selected = this.selectedRegion;
        const selectedLabel = selected ? this.getRegionNameT(selected) : this.t('region-all-name', 'Toutes les régions');
        const selectedStats = selected ? regionStats[selected] : null;
        const totalCountries = selectedStats ? selectedStats.countries : totalCountriesAll;
        const totalClinics = selectedStats ? selectedStats.clinics : totalClinicsAll;
        const totalPopulation = selectedStats ? selectedStats.population : totalPopulationAll;

        const donutResult = this.buildDonutData(regionStats, totalCountriesAll, selected);
        const donut = donutResult.gradient;
        this.donutSegments = donutResult.segments;
        const bars = this.buildBarData(regionStats, selected);

        dashboardContainer.innerHTML = `
            <div class="dash-wrap">
                <div class="dash-header">
                    <div class="dash-title">${this.t('dashboard-title', 'Tableau de bord')}</div>
                    <div class="dash-subtitle">${this.t('dashboard-subtitle', 'Clic sur une région de la carte pour filtrer')}</div>
                </div>

                <div class="dash-filters">
                    <button class="filter-chip ${selected ? '' : 'is-active'}" data-region="all">${this.t('filter-all', 'Toutes')}</button>
                    <button class="filter-chip ${selected === 'africa' ? 'is-active' : ''}" data-region="africa">${this.t('filter-africa', 'Afrique')}</button>
                    <button class="filter-chip ${selected === 'asia' ? 'is-active' : ''}" data-region="asia">${this.t('filter-asia', 'Asie & Pacifique')}</button>
                    <button class="filter-chip ${selected === 'latin' ? 'is-active' : ''}" data-region="latin">${this.t('filter-latin', 'Amérique Latine')}</button>
                    <button class="filter-chip ${selected === 'middleEast' ? 'is-active' : ''}" data-region="middleEast">${this.t('filter-middle-east', 'Moyen-Orient')}</button>
                </div>

                <div class="dash-kpis">
                    <div class="dash-kpi">
                        <div class="kpi-label">${this.t('kpi-countries', 'Pays ciblés')}</div>
                        <div class="kpi-value">${totalCountries}</div>
                    </div>
                    <div class="dash-kpi">
                        <div class="kpi-label">${this.t('kpi-population', 'Population')}</div>
                        <div class="kpi-value">${totalPopulation}</div>
                    </div>
                    <div class="dash-kpi">
                        <div class="kpi-label">${this.t('kpi-clinics', 'Cliniques')}</div>
                        <div class="kpi-value">${totalClinics}</div>
                    </div>
                </div>

                <div class="dash-section">
                    <div class="dash-section-title">${this.t('section-distribution', 'Répartition des pays')}</div>
                    <div class="dash-donut" style="background: conic-gradient(${donut});" data-cycle="true"></div>
                    <div class="dash-legend">
                        <button class="legend-item ${selected === 'africa' ? 'is-active' : ''}" data-region="africa">
                            <span class="legend-dot" style="background:${this.getRegionColor('africa')}"></span> ${this.getRegionNameT('africa')} (${regionStats.africa.countries})
                        </button>
                        <button class="legend-item ${selected === 'asia' ? 'is-active' : ''}" data-region="asia">
                            <span class="legend-dot" style="background:${this.getRegionColor('asia')}"></span> ${this.getRegionNameT('asia')} (${regionStats.asia.countries})
                        </button>
                        <button class="legend-item ${selected === 'latin' ? 'is-active' : ''}" data-region="latin">
                            <span class="legend-dot" style="background:${this.getRegionColor('latin')}"></span> ${this.getRegionNameT('latin')} (${regionStats.latin.countries})
                        </button>
                        <button class="legend-item ${selected === 'middleEast' ? 'is-active' : ''}" data-region="middleEast">
                            <span class="legend-dot" style="background:${this.getRegionColor('middleEast')}"></span> ${this.getRegionNameT('middleEast')} (${regionStats.middleEast.countries})
                        </button>
                    </div>
                </div>

                <div class="dash-section">
                    <div class="dash-section-title">${this.t('section-clinics', 'Cliniques par région')}</div>
                    <div class="dash-bars">
                        ${bars}
                    </div>
                </div>

                <div class="dash-section dash-focus">
                    <div class="dash-section-title">${selected ? this.t('section-selected', 'Région sélectionnée') : this.t('section-global', 'Vue globale')}</div>
                    <div class="focus-card">
                        <div class="focus-title">${selectedLabel}</div>
                        <div class="focus-metrics">
                            <div>${totalCountries} ${this.t('label-countries', 'pays')}</div>
                            <div>${totalPopulation} ${this.t('label-people', 'personnes desservies')}</div>
                            <div>${totalClinics} ${this.t('label-clinics', 'cliniques mobiles')}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Dashboard HTML set successfully');

        // Bind legend clicks for interaction
        dashboardContainer.querySelectorAll('.legend-item, .bar-row').forEach(btn => {
            btn.addEventListener('click', () => {
                const region = btn.getAttribute('data-region');
                this.setSelectedRegion(region);
            });
            btn.addEventListener('mouseenter', () => {
                const region = btn.getAttribute('data-region');
                this.setHoverRegion(region);
            });
            btn.addEventListener('mouseleave', () => {
                this.clearHoverRegion();
            });
        });

        dashboardContainer.querySelectorAll('.filter-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                const region = btn.getAttribute('data-region');
                if (region === 'all') {
                    this.clearSelection();
                } else {
                    this.setSelectedRegion(region);
                }
            });
        });

        const donutEl = dashboardContainer.querySelector('.dash-donut');
        if (donutEl) {
            donutEl.addEventListener('click', (e) => {
                const region = this.getDonutRegionFromClick(e, donutEl);
                if (region) {
                    this.setSelectedRegion(region);
                }
            });
        }
    }

    buildDonutData(regionStats, totalCountries, selectedRegion) {
        if (selectedRegion) {
            return {
                gradient: `${this.getRegionColor(selectedRegion)} 0deg 360deg`,
                segments: [{ region: selectedRegion, start: 0, end: 360, color: this.getRegionColor(selectedRegion) }]
            };
        }

        const parts = [
            { region: 'africa', color: this.getRegionColor('africa'), value: regionStats.africa.countries },
            { region: 'asia', color: this.getRegionColor('asia'), value: regionStats.asia.countries },
            { region: 'latin', color: this.getRegionColor('latin'), value: regionStats.latin.countries },
            { region: 'middleEast', color: this.getRegionColor('middleEast'), value: regionStats.middleEast.countries }
        ];
        let acc = 0;
        const segments = parts.map(p => {
            const start = (acc / totalCountries) * 360;
            acc += p.value;
            const end = (acc / totalCountries) * 360;
            return { region: p.region, start, end, color: p.color };
        });
        return {
            gradient: segments.map(s => `${s.color} ${s.start}deg ${s.end}deg`).join(', '),
            segments
        };
    }


    buildBarData(regionStats, selectedRegion) {
        const max = Math.max(
            regionStats.africa.clinics,
            regionStats.asia.clinics,
            regionStats.latin.clinics,
            regionStats.middleEast.clinics
        );
        const items = [
            { region: 'africa', label: this.getRegionNameT('africa'), color: this.getRegionColor('africa'), value: regionStats.africa.clinics },
            { region: 'asia', label: this.getRegionNameT('asia'), color: this.getRegionColor('asia'), value: regionStats.asia.clinics },
            { region: 'latin', label: this.getRegionNameT('latin'), color: this.getRegionColor('latin'), value: regionStats.latin.clinics },
            { region: 'middleEast', label: this.getRegionNameT('middleEast'), color: this.getRegionColor('middleEast'), value: regionStats.middleEast.clinics }
        ];
        return items.map(i => {
            const width = Math.round((i.value / max) * 100);
            const isActive = i.region === selectedRegion ? 'is-active' : '';
            return `
                <button class="bar-row ${isActive}" data-region="${i.region}">
                    <span class="bar-label">${i.label}</span>
                    <span class="bar-track">
                        <span class="bar-fill" style="width:${width}%; background:${i.color}"></span>
                    </span>
                    <span class="bar-value">${i.value}</span>
                </button>
            `;
        }).join('');
    }

    setSelectedRegion(region) {
        this.selectedRegion = region;
        this.createDashboard();
        this.highlightRegion();
        this.updateSelectionUI();
        this.zoomToRegion(region);
    }

    clearSelection() {
        this.selectedRegion = null;
        this.hoverRegion = null;
        this.createDashboard();
        this.highlightRegion();
        this.updateSelectionUI();
    }

    setHoverRegion(region) {
        this.hoverRegion = region;
        this.highlightRegion();
    }

    clearHoverRegion() {
        this.hoverRegion = null;
        this.highlightRegion();
    }

    highlightRegion() {
        if (!this.geoJsonLayer) return;
        const activeRegion = this.selectedRegion || this.hoverRegion;
        this.geoJsonLayer.eachLayer(layer => {
            const info = this.getCountryInfo(layer.feature);
            if (!info) return;
            const isTarget = activeRegion && info.region === activeRegion;
            layer.setStyle({
                fillOpacity: activeRegion ? (isTarget ? 0.85 : 0) : 0.7,
                opacity: activeRegion ? (isTarget ? 1 : 0) : 1,
                weight: activeRegion ? (isTarget ? 2 : 1) : 1
            });
        });
        this.updateLabelVisibility(activeRegion);
    }

    updateLabelVisibility(activeRegion) {
        const showAll = !activeRegion;
        Object.entries(this.regionLabels).forEach(([region, labels]) => {
            const shouldShow = showAll || region === activeRegion;
            labels.forEach(label => {
                const el = label.getElement && label.getElement();
                if (el) {
                    el.style.display = shouldShow ? '' : 'none';
                }
            });
        });
    }

    zoomToRegion(region) {
        if (!this.map || !this.geoJsonLayer) return;
        const bounds = this.getRegionBounds(region);
        if (bounds && bounds.isValid && bounds.isValid()) {
            this.map.fitBounds(bounds, { padding: [20, 20], maxZoom: 6 });
        }
    }

    getRegionBounds(region) {
        let bounds = null;
        this.geoJsonLayer.eachLayer(layer => {
            const info = this.getCountryInfo(layer.feature);
            if (!info || info.region !== region) return;
            const layerBounds = layer.getBounds ? layer.getBounds() : null;
            if (!layerBounds || !layerBounds.isValid || !layerBounds.isValid()) return;
            if (!bounds) {
                bounds = L.latLngBounds(layerBounds.getSouthWest(), layerBounds.getNorthEast());
            } else {
                bounds.extend(layerBounds);
            }
        });
        return bounds;
    }

    bindMapClickFallback() {
        if (!this.map || !this.geoJsonLayer) return;
        if (this._mapClickBound) return;
        this._mapClickBound = true;

        this.map.on('click', (e) => {
            const hitRegion = this.getRegionAtLatLng(e.latlng);
            if (hitRegion) {
                this.setSelectedRegion(hitRegion);
            } else {
                this.clearSelection();
            }
        });
    }

    getRegionAtLatLng(latlng) {
        let foundRegion = null;
        this.geoJsonLayer.eachLayer(layer => {
            if (foundRegion) return;
            const info = this.getCountryInfo(layer.feature);
            if (!info) return;
            if (layer.getBounds && layer.getBounds().contains(latlng)) {
                foundRegion = info.region;
            }
        });
        return foundRegion;
    }

    getDonutRegionFromClick(event, donutEl) {
        if (!this.donutSegments || !donutEl) return null;
        const rect = donutEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = rect.width / 2;

        // Ignore clicks outside donut radius
        if (distance > radius) return null;

        // Compute angle (0deg at top, clockwise)
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360;

        for (const seg of this.donutSegments) {
            if (angle >= seg.start && angle < seg.end) {
                return seg.region;
            }
        }
        return null;
    }

    ensureMapOverlay() {
        const mapContainer = document.getElementById('leaflet-map');
        if (!mapContainer) return;
        let overlay = mapContainer.querySelector('.map-selection-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'map-selection-overlay';
            mapContainer.appendChild(overlay);
        }
        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const mapContainer = document.getElementById('leaflet-map');
        if (!mapContainer) return;
        const overlay = mapContainer.querySelector('.map-selection-overlay');
        if (!overlay) return;

        const region = this.selectedRegion;
        const regionLabel = region ? this.getRegionNameT(region) : this.t('region-all-name', 'Toutes les régions');
        const stats = {
            africa: { countries: 22, population: '1.2M', clinics: 15 },
            asia: { countries: 14, population: '2.8M', clinics: 20 },
            latin: { countries: 10, population: '800K', clinics: 12 },
            middleEast: { countries: 4, population: '400K', clinics: 8 }
        };

        let content = '';
        if (region && stats[region]) {
            const r = stats[region];
            content = `
                <div class="map-overlay-title">${this.t('map-overlay-title', 'Région sélectionnée')}</div>
                <div class="map-overlay-sub">${regionLabel}</div>
                <div class="map-overlay-metrics">
                    <span>${r.countries} ${this.t('label-countries', 'pays')}</span>
                    <span>${r.population} ${this.t('label-people', 'personnes desservies')}</span>
                    <span>${r.clinics} ${this.t('label-clinics', 'cliniques mobiles')}</span>
                </div>
            `;
        } else {
            content = `<div class="map-overlay-title">${regionLabel}</div>`;
        }

        overlay.innerHTML = content;
        overlay.classList.remove('is-flash');
        // Trigger flash animation
        void overlay.offsetWidth;
        overlay.classList.add('is-flash');
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
