// Professional World Map Data for Geomatician
class WorldMapGeo {
    constructor() {
        this.modal = document.getElementById('map-modal');
        this.modalOverlay = document.getElementById('map-modal-overlay');
        this.closeBtn = document.getElementById('close-map-modal');
        this.openMapBtn = null; // Will be set in setupEventListeners
        this.svg = document.getElementById('world-map');
        this.tooltip = document.getElementById('country-tooltip');
        
        this.countries = this.getTargetCountries();
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Target countries with realistic geographic data
    getTargetCountries() {
        return {
            africa: {
                priority: 1,
                description: "Le besoin le plus critique en raison de l'éloignement des centres de santé en zone rurale",
                countries: [
                    {code: 'SEN', name: 'Sénégal', region: 'west-africa'},
                    {code: 'MLI', name: 'Mali', region: 'west-africa'},
                    {code: 'NER', name: 'Niger', region: 'west-africa'},
                    {code: 'BFA', name: 'Burkina Faso', region: 'west-africa'},
                    {code: 'GIN', name: 'Guinée', region: 'west-africa'},
                    {code: 'CIV', name: 'Côte d\'Ivoire', region: 'west-africa'},
                    {code: 'NGA', name: 'Nigeria', region: 'west-africa'},
                    {code: 'GHA', name: 'Ghana', region: 'west-africa'},
                    {code: 'ETH', name: 'Éthiopie', region: 'east-africa'},
                    {code: 'KEN', name: 'Kenya', region: 'east-africa'},
                    {code: 'UGA', name: 'Ouganda', region: 'east-africa'},
                    {code: 'TZA', name: 'Tanzanie', region: 'east-africa'},
                    {code: 'RWA', name: 'Rwanda', region: 'east-africa'},
                    {code: 'MDG', name: 'Madagascar', region: 'east-africa'},
                    {code: 'COD', name: 'RDC', region: 'central-africa'},
                    {code: 'CAF', name: 'Centrafrique', region: 'central-africa'},
                    {code: 'TCD', name: 'Tchad', region: 'central-africa'},
                    {code: 'CMR', name: 'Cameroun', region: 'central-africa'},
                    {code: 'MOZ', name: 'Mozambique', region: 'southern-africa'},
                    {code: 'AGO', name: 'Angola', region: 'southern-africa'},
                    {code: 'MWI', name: 'Malawi', region: 'southern-africa'},
                    {code: 'ZMB', name: 'Zambie', region: 'southern-africa'}
                ]
            },
            asia: {
                priority: 2,
                description: "Le défi est souvent lié au relief (Himalaya) ou à l'éparpillement des îles",
                countries: [
                    {code: 'IND', name: 'Inde', region: 'south-asia'},
                    {code: 'PAK', name: 'Pakistan', region: 'south-asia'},
                    {code: 'BGD', name: 'Bangladesh', region: 'south-asia'},
                    {code: 'NPL', name: 'Népal', region: 'south-asia'},
                    {code: 'BTN', name: 'Bhoutan', region: 'south-asia'},
                    {code: 'IDN', name: 'Indonésie', region: 'southeast-asia'},
                    {code: 'PHL', name: 'Philippines', region: 'southeast-asia'},
                    {code: 'MMR', name: 'Myanmar', region: 'southeast-asia'},
                    {code: 'LAO', name: 'Laos', region: 'southeast-asia'},
                    {code: 'KHM', name: 'Cambodge', region: 'southeast-asia'},
                    {code: 'VNM', name: 'Vietnam', region: 'southeast-asia'},
                    {code: 'AFG', name: 'Afghanistan', region: 'central-asia'},
                    {code: 'UZB', name: 'Ouzbékistan', region: 'central-asia'},
                    {code: 'TJK', name: 'Tadjikistan', region: 'central-asia'}
                ]
            },
            latinAmerica: {
                priority: 3,
                description: "Les cliniques mobiles sont essentielles pour atteindre les populations indigènes en Amazonie ou dans les Andes",
                countries: [
                    {code: 'BRA', name: 'Brésil', region: 'south-america'},
                    {code: 'BOL', name: 'Bolivie', region: 'south-america'},
                    {code: 'PER', name: 'Pérou', region: 'south-america'},
                    {code: 'COL', name: 'Colombie', region: 'south-america'},
                    {code: 'ECU', name: 'Équateur', region: 'south-america'},
                    {code: 'PRY', name: 'Paraguay', region: 'south-america'},
                    {code: 'GTM', name: 'Guatemala', region: 'central-america'},
                    {code: 'HND', name: 'Honduras', region: 'central-america'},
                    {code: 'HTI', name: 'Haïti', region: 'caribbean'},
                    {code: 'NIC', name: 'Nicaragua', region: 'central-america'}
                ]
            },
            middleEast: {
                priority: 4,
                description: "Le défi est principalement lié aux zones désertiques et aux zones de reconstruction post-conflit",
                countries: [
                    {code: 'YEM', name: 'Yémen', region: 'middle-east'},
                    {code: 'SYR', name: 'Syrie', region: 'middle-east'},
                    {code: 'IRQ', name: 'Irak', region: 'middle-east'},
                    {code: 'MAR', name: 'Maroc', region: 'north-africa'},
                    {code: 'MRT', name: 'Mauritanie', region: 'north-africa'}
                ]
            }
        };
    }

    init() {
        this.createWorldMap();
        this.setupEventListeners();
        this.setupLanguageSupport();
    }

    // Create professional world map SVG
    createWorldMap() {
        if (!this.svg) return;

        // Clear existing content
        this.svg.innerHTML = '';

        // Create world map background
        this.createMapBackground();
        
        // Create country paths
        this.createCountryPaths();
        
        // Create map grid
        this.createMapGrid();
        
        console.log('Professional world map created with', this.getAllCountries().length, 'countries');
    }

    // Create map background
    createMapBackground() {
        // Ocean background
        const ocean = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        ocean.setAttribute('width', '100%');
        ocean.setAttribute('height', '100%');
        ocean.setAttribute('fill', '#e6f3ff');
        ocean.setAttribute('rx', '2');
        this.svg.appendChild(ocean);

        // Grid lines
        const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gridGroup.setAttribute('class', 'map-grid');
        
        // Latitude lines
        for (let lat = -60; lat <= 80; lat += 20) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('x2', '1000');
            line.setAttribute('y1', this.latToY(lat));
            line.setAttribute('y2', this.latToY(lat));
            line.setAttribute('stroke', '#ccc');
            line.setAttribute('stroke-width', '0.5');
            line.setAttribute('opacity', '0.3');
            gridGroup.appendChild(line);
        }
        
        // Longitude lines
        for (let lon = -180; lon <= 180; lon += 30) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', this.lonToX(lon));
            line.setAttribute('x2', this.lonToX(lon));
            line.setAttribute('y1', '0');
            line.setAttribute('y2', '500');
            line.setAttribute('stroke', '#ccc');
            line.setAttribute('stroke-width', '0.5');
            line.setAttribute('opacity', '0.3');
            gridGroup.appendChild(line);
        }
        
        this.svg.appendChild(gridGroup);
    }

    // Create realistic country paths
    createCountryPaths() {
        const allCountries = this.getAllCountries();
        
        allCountries.forEach(country => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', this.getCountryPath(country.code));
            path.setAttribute('class', 'country-path');
            path.setAttribute('data-country', country.code);
            path.setAttribute('data-name', country.name);
            path.setAttribute('data-region', country.region);
            path.setAttribute('fill', this.getRegionColor(country.region));
            path.setAttribute('stroke', this.getRegionStroke(country.region));
            path.setAttribute('stroke-width', '0.5');
            path.setAttribute('opacity', '0.8');
            path.setAttribute('cursor', 'pointer');
            
            // Add hover effects
            path.addEventListener('mouseenter', (e) => this.showTooltip(e));
            path.addEventListener('mouseleave', () => this.hideTooltip());
            path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
            
            this.svg.appendChild(path);
        });
    }

    // Create map grid
    createMapGrid() {
        // Add continent labels
        const continents = [
            {name: 'AFRIQUE', x: 500, y: 280},
            {name: 'ASIE', x: 700, y: 200},
            {name: 'AMÉRIQUE', x: 300, y: 380},
            {name: 'EUROPE', x: 500, y: 120},
            {name: 'OCÉANIE', x: 850, y: 350},
            {name: 'AMÉRIQUE DU NORD', x: 200, y: 120}
        ];

        continents.forEach(continent => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', continent.x);
            text.setAttribute('y', continent.y);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#666');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('opacity', '0.5');
            text.textContent = continent.name;
            this.svg.appendChild(text);
        });
    }

    // Get realistic country path (simplified but recognizable)
    getCountryPath(countryCode) {
        const paths = {
            // Africa
            'SEN': 'M 180 265 L 195 260 L 200 275 L 190 280 L 175 275 L 170 265 Z',
            'MLI': 'M 175 245 L 210 240 L 215 255 L 180 260 Z',
            'NER': 'M 215 235 L 250 230 L 255 250 L 220 245 Z',
            'BFA': 'M 190 250 L 220 245 L 225 265 L 195 270 Z',
            'GIN': 'M 165 270 L 185 265 L 190 285 L 170 290 Z',
            'CIV': 'M 180 285 L 210 280 L 215 300 L 185 305 Z',
            'NGA': 'M 225 270 L 265 265 L 270 285 L 230 290 Z',
            'GHA': 'M 210 295 L 235 290 L 240 310 L 215 315 Z',
            'ETH': 'M 285 270 L 325 265 L 330 285 L 290 290 Z',
            'KEN': 'M 295 295 L 325 290 L 330 310 L 300 315 Z',
            'UGA': 'M 275 285 L 305 280 L 310 300 L 280 305 Z',
            'TZA': 'M 300 315 L 335 310 L 340 330 L 305 335 Z',
            'RWA': 'M 270 290 L 290 285 L 295 305 L 275 310 Z',
            'MDG': 'M 345 330 L 365 325 L 370 345 L 350 350 Z',
            'COD': 'M 245 285 L 285 280 L 290 325 L 250 330 Z',
            'CAF': 'M 235 265 L 265 260 L 270 285 L 240 290 Z',
            'TCD': 'M 225 245 L 255 240 L 260 265 L 230 270 Z',
            'CMR': 'M 235 275 L 265 270 L 270 295 L 240 300 Z',
            'MOZ': 'M 310 325 L 345 320 L 350 340 L 315 345 Z',
            'AGO': 'M 235 325 L 265 320 L 270 345 L 240 350 Z',
            'MWI': 'M 300 315 L 325 310 L 330 330 L 305 335 Z',
            'ZMB': 'M 275 315 L 305 310 L 310 335 L 280 340 Z',
            
            // Asia
            'IND': 'M 445 195 L 495 190 L 500 245 L 450 250 Z',
            'PAK': 'M 415 195 L 445 190 L 450 235 L 420 240 Z',
            'BGD': 'M 495 225 L 515 220 L 520 245 L 500 250 Z',
            'NPL': 'M 475 185 L 495 180 L 500 205 L 480 210 Z',
            'BTN': 'M 490 185 L 510 180 L 515 205 L 495 210 Z',
            'IDN': 'M 515 305 L 575 300 L 580 325 L 520 330 Z',
            'PHL': 'M 505 285 L 525 280 L 530 305 L 510 310 Z',
            'MMR': 'M 495 265 L 525 260 L 530 285 L 500 290 Z',
            'LAO': 'M 485 265 L 515 260 L 520 285 L 490 290 Z',
            'KHM': 'M 500 285 L 530 280 L 535 305 L 505 310 Z',
            'VNM': 'M 510 265 L 540 260 L 545 285 L 515 290 Z',
            'AFG': 'M 425 175 L 455 170 L 460 195 L 430 200 Z',
            'UZB': 'M 440 155 L 480 150 L 485 175 L 445 180 Z',
            'TJK': 'M 455 155 L 485 150 L 490 175 L 460 180 Z',
            
            // Latin America
            'BRA': 'M 145 375 L 195 370 L 200 425 L 150 430 Z',
            'BOL': 'M 135 405 L 165 400 L 170 425 L 140 430 Z',
            'PER': 'M 115 395 L 145 390 L 150 435 L 120 440 Z',
            'COL': 'M 95 375 L 125 370 L 130 405 L 100 410 Z',
            'ECU': 'M 85 405 L 115 400 L 120 425 L 90 430 Z',
            'PRY': 'M 135 425 L 165 420 L 170 445 L 140 450 Z',
            'GTM': 'M 75 355 L 105 350 L 110 385 L 80 390 Z',
            'HND': 'M 85 365 L 115 360 L 120 395 L 90 400 Z',
            'HTI': 'M 105 355 L 125 350 L 130 385 L 110 390 Z',
            'NIC': 'M 75 385 L 105 380 L 110 415 L 80 420 Z',
            
            // Middle East & North Africa
            'YEM': 'M 335 225 L 365 220 L 370 245 L 340 250 Z',
            'SYR': 'M 315 185 L 345 180 L 350 205 L 320 210 Z',
            'IRQ': 'M 325 205 L 355 200 L 360 225 L 330 230 Z',
            'MAR': 'M 155 205 L 185 200 L 190 225 L 160 230 Z',
            'MRT': 'M 165 225 L 195 220 L 200 245 L 170 250 Z'
        };
        
        return paths[countryCode] || '';
    }

    // Get all countries from all regions
    getAllCountries() {
        const allCountries = [];
        Object.values(this.countries).forEach(region => {
            if (region.countries) {
                allCountries.push(...region.countries);
            }
        });
        return allCountries;
    }

    // Convert longitude to SVG x coordinate
    lonToX(lon) {
        return ((lon + 180) / 360) * 1000;
    }

    // Convert latitude to SVG y coordinate
    latToY(lat) {
        return ((90 - lat) / 150) * 500;
    }

    // Get region color
    getRegionColor(region) {
        const colors = {
            'west-africa': '#16a34a',
            'east-africa': '#22c55e',
            'central-africa': '#059669',
            'southern-africa': '#059669',
            'south-asia': '#dc2626',
            'southeast-asia': '#dc2626',
            'central-asia': '#dc2626',
            'south-america': '#2563eb',
            'central-america': '#2563eb',
            'caribbean': '#2563eb',
            'middle-east': '#ca8a04',
            'north-africa': '#ca8a04'
        };
        return colors[region] || '#e5e7eb';
    }

    // Get region stroke color
    getRegionStroke(region) {
        const strokes = {
            'west-africa': '#15803d',
            'east-africa': '#16a34a',
            'central-africa': '#047857',
            'southern-africa': '#047857',
            'south-asia': '#b91c1c',
            'southeast-asia': '#b91c1c',
            'central-asia': '#b91c1c',
            'south-america': '#1d4ed8',
            'central-america': '#1d4ed8',
            'caribbean': '#1d4ed8',
            'middle-east': '#a16207',
            'north-africa': '#a16207'
        };
        return strokes[region] || '#9ca3af';
    }

    // Setup event listeners
    setupEventListeners() {
        // Wait a bit to ensure DOM is ready
        setTimeout(() => {
            // Open map button from hero section
            this.openMapBtn = document.getElementById('open-map-btn');
            console.log('WorldMapGeo: Looking for open-map-btn button:', this.openMapBtn);
            
            if (this.openMapBtn) {
                // Add click listener
                this.openMapBtn.addEventListener('click', (e) => {
                    console.log('WorldMapGeo: Button clicked! Opening modal...');
                    e.preventDefault();
                    e.stopPropagation();
                    this.showModal();
                });
                
                console.log('WorldMapGeo: Map button found and event listener attached');
            } else {
                console.error('WorldMapGeo: Map button not found!');
                
                // Try to find any button with similar text
                const allButtons = document.querySelectorAll('button');
                console.log('WorldMapGeo: All buttons on page:', allButtons.length);
                allButtons.forEach((btn, index) => {
                    if (btn.textContent.includes('Pays') || btn.textContent.includes('Découvrir')) {
                        console.log(`WorldMapGeo: Button ${index}:`, btn.textContent, btn.id);
                    }
                });
            }

            // Close modal
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', (e) => {
                    console.log('WorldMapGeo: Close button clicked');
                    e.preventDefault();
                    this.hideModal();
                });
                console.log('WorldMapGeo: Close button listener attached');
            } else {
                console.log('WorldMapGeo: Close button not found');
            }

            // Close on overlay click
            if (this.modalOverlay) {
                this.modalOverlay.addEventListener('click', (e) => {
                    console.log('WorldMapGeo: Overlay clicked');
                    e.preventDefault();
                    this.hideModal();
                });
                console.log('WorldMapGeo: Overlay listener attached');
            } else {
                console.log('WorldMapGeo: Overlay not found');
            }

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
                    console.log('WorldMapGeo: Escape key pressed');
                    this.hideModal();
                }
            });

            // Add a global click listener as backup
            document.addEventListener('click', (e) => {
                if (e.target === this.openMapBtn || e.target.closest('#open-map-btn')) {
                    console.log('WorldMapGeo: Global click listener caught the button click!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.showModal();
                }
            });
        }, 200);
    }

    // Setup language support
    setupLanguageSupport() {
        this.applyTranslations();
        
        // Listen for language changes
        const languageSwitcher = document.getElementById('languageSwitcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('click', () => {
                setTimeout(() => this.applyTranslations(), 100);
            });
        }
    }

    // Apply translations
    applyTranslations() {
        const currentLang = localStorage.getItem('language') || 'fr';
        
        if (!this.modal) return;
        
        // Apply translations to all elements with data-translate attributes
        const translatableElements = this.modal.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (window.translations && window.translations[currentLang] && window.translations[currentLang][key]) {
                element.textContent = window.translations[currentLang][key];
            }
        });
    }

    // Show modal
    showModal() {
        console.log('WorldMapGeo: showModal called, modal:', this.modal);
        if (this.modal) {
            console.log('WorldMapGeo: Modal found, showing...');
            
            // Force display with styles
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
                transform: none !important;
                clip: auto !important;
                clip-path: none !important;
                pointer-events: auto !important;
            `;
            
            console.log('WorldMapGeo: Modal styles applied');
            
            // Also add show class
            this.modal.classList.add('show');
            
            this.applyTranslations(); // Apply translations when modal opens
            console.log('WorldMapGeo: Modal should now be visible');
            
            // Force body scroll lock
            document.body.style.overflow = 'hidden';
            
            // Check if modal is actually visible
            setTimeout(() => {
                const rect = this.modal.getBoundingClientRect();
                console.log('WorldMapGeo: Modal rect:', rect);
                console.log('WorldMapGeo: Modal display:', window.getComputedStyle(this.modal).display);
                console.log('WorldMapGeo: Modal visibility:', window.getComputedStyle(this.modal).visibility);
                console.log('WorldMapGeo: Modal opacity:', window.getComputedStyle(this.modal).opacity);
                console.log('WorldMapGeo: Modal z-index:', window.getComputedStyle(this.modal).zIndex);
                
                if (rect.width === 0 || rect.height === 0) {
                    console.error('WorldMapGeo: Modal has no dimensions!');
                } else {
                    console.log('WorldMapGeo: Modal has proper dimensions');
                }
            }, 100);
            
        } else {
            console.error('WorldMapGeo: Modal not found!');
        }
    }

    // Hide modal
    hideModal() {
        console.log('WorldMapGeo: hideModal called');
        if (this.modal) {
            console.log('WorldMapGeo: Removing show class');
            this.modal.classList.remove('show');
            
            // Also hide with styles
            this.modal.style.display = 'none';
            this.modal.style.opacity = '0';
            this.modal.style.visibility = 'hidden';
            
            setTimeout(() => {
                console.log('WorldMapGeo: Modal hidden');
                document.body.style.overflow = '';
            }, 300);
        } else {
            console.log('WorldMapGeo: Modal not found for hiding');
        }
    }

    // Show country tooltip
    showTooltip(event) {
        const path = event.target;
        const countryName = path.getAttribute('data-name');
        const countryCode = path.getAttribute('data-country');
        const region = path.getAttribute('data-region');

        if (!this.tooltip || !countryName) return;

        const titleElement = this.tooltip.querySelector('.tooltip-title');
        const regionElement = this.tooltip.querySelector('.tooltip-region');

        titleElement.textContent = countryName;
        
        // Add contextual region information
        const regionInfo = this.getRegionContext(region);
        regionElement.textContent = regionInfo;

        this.tooltip.classList.add('show');
    }

    // Hide tooltip
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('show');
        }
    }

    // Update tooltip position
    updateTooltipPosition(event) {
        if (!this.tooltip) return;

        const rect = this.svg.getBoundingClientRect();
        const x = event.clientX - rect.left + 10;
        const y = event.clientY - rect.top - 30;

        this.tooltip.style.left = `${x}px`;
        this.tooltip.style.top = `${y}px`;
    }

    // Get contextual region information
    getRegionContext(region) {
        const regionContexts = {
            'west-africa': {
                fr: '🌍 Afrique de l\'Ouest - Éloignement des centres de santé en zone rurale',
                en: '🌍 West Africa - Remote healthcare centers in rural areas'
            },
            'east-africa': {
                fr: '🌍 Afrique de l\'Est - Défis d\'accès aux soins de santé',
                en: '🌍 East Africa - Healthcare access challenges'
            },
            'central-africa': {
                fr: '🌍 Afrique Centrale - Zones de reconstruction post-conflit',
                en: '🌍 Central Africa - Post-conflict reconstruction zones'
            },
            'southern-africa': {
                fr: '🌍 Afrique Australe - Défis logistiques et géographiques',
                en: '🌍 Southern Africa - Logistical and geographical challenges'
            },
            'south-asia': {
                fr: '🏔️ Asie du Sud - Densité de population et relief',
                en: '🏔️ South Asia - Population density and terrain'
            },
            'southeast-asia': {
                fr: '🏔️ Asie du Sud-Est - Îles et archipels',
                en: '🏔️ Southeast Asia - Islands and archipelagos'
            },
            'central-asia': {
                fr: '🏔️ Asie Centrale - Zones montagneuses et isolées',
                en: '🏔️ Central Asia - Mountainous and isolated areas'
            },
            'south-america': {
                fr: '🌎️ Amérique du Sud - Forêt amazonienne et andes',
                en: '🌎️ South America - Amazon rainforest and Andes'
            },
            'central-america': {
                fr: '🌎️ Amérique Centrale - Populations indigènes',
                en: '🌎️ Central America - Indigenous populations'
            },
            'caribbean': {
                fr: '🌎️ Caraïbes - Îles et accès maritime',
                en: '🌎️ Caribbean - Islands and maritime access'
            },
            'middle-east': {
                fr: '🏜️ Moyen-Orient - Zones désertiques et reconstruction',
                en: '🏜️ Middle East - Desert zones and reconstruction'
            },
            'north-africa': {
                fr: '🏜️ Afrique du Nord - Zones montagneuses et côtes',
                en: '🏜️ North Africa - Mountainous regions and coasts'
            }
        };

        const currentLang = localStorage.getItem('language') || 'fr';
        return region && regionContexts[region] 
            ? regionContexts[region][currentLang] 
            : (currentLang === 'fr' ? 'Zone d\'intervention' : 'Intervention zone');
    }
}

// Initialize professional world map when DOM is ready
let worldMapInstance;

document.addEventListener('DOMContentLoaded', () => {
    worldMapInstance = new WorldMapGeo();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    worldMapInstance = new WorldMapGeo();
}

// Re-apply translations when language changes
const originalLanguageManager = window.LanguageManager;
if (originalLanguageManager) {
    const originalSwitchLanguage = originalLanguageManager.prototype.switchLanguage;
    originalLanguageManager.prototype.switchLanguage = function(lang) {
        originalSwitchLanguage.call(this, lang);
        // Re-apply translations to modal when language changes
        if (worldMapInstance && worldMapInstance.modal) {
            setTimeout(() => worldMapInstance.applyTranslations(), 100);
        }
    };
}

// Also listen for language switcher clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lang-btn')) {
        setTimeout(() => {
            if (worldMapInstance && worldMapInstance.modal) {
                worldMapInstance.applyTranslations();
            }
        }, 150);
    }
});
