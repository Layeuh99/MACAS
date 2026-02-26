// Enhanced map modal with contextual information
class MapModal {
    constructor() {
        this.modal = document.getElementById('map-modal');
        this.modalOverlay = document.getElementById('map-modal-overlay');
        this.closeBtn = document.getElementById('close-map-modal');
        this.openMapBtn = null; // Will be set in setupEventListeners
        this.svg = document.getElementById('world-map');
        this.tooltip = document.getElementById('country-tooltip');
        
        this.countries = this.getTargetCountries();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    // Target countries with contextual information
    getTargetCountries() {
        return {
            africa: {
                priority: 1,
                description: "Le besoin le plus critique en raison de l'éloignement des centres de santé en zone rurale",
                west: ['SEN', 'MLI', 'NER', 'BFA', 'GIN', 'CIV', 'NGA', 'GHA'],
                east: ['ETH', 'KEN', 'UGA', 'TZA', 'RWA', 'MDG'],
                central: ['COD', 'CAF', 'TCD', 'CMR'],
                south: ['MOZ', 'AGO', 'MWI', 'ZMB']
            },
            asia: {
                priority: 2,
                description: "Le défi est souvent lié au relief (Himalaya) ou à l'éparpillement des îles",
                south: ['IND', 'PAK', 'BGD', 'NPL', 'BTN'],
                southeast: ['IDN', 'PHL', 'MMR', 'LAO', 'KHM', 'VNM'],
                central: ['AFG', 'UZB', 'TJK']
            },
            latinAmerica: {
                priority: 3,
                description: "Les cliniques mobiles sont essentielles pour atteindre les populations indigènes en Amazonie ou dans les Andes",
                south: ['BRA', 'BOL', 'PER', 'COL', 'ECU', 'PRY'],
                central: ['GTM', 'HND', 'HTI', 'NIC']
            },
            middleEast: {
                priority: 4,
                description: "Le défi est principalement lié aux zones désertiques et aux zones de reconstruction post-conflit",
                countries: ['YEM', 'SYR', 'IRQ', 'MAR', 'MRT']
            }
        };
    }

    init() {
        // Wait for DOM to be ready before setting up
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    this.createWorldMap();
                    this.setupEventListeners();
                    this.setupLanguageSupport();
                }, 100);
            });
        } else {
            setTimeout(() => {
                this.createWorldMap();
                this.setupEventListeners();
                this.setupLanguageSupport();
            }, 100);
        }
    }

    // Setup language support
    setupLanguageSupport() {
        // Apply translations to modal elements
        this.applyTranslations();
        
        // Listen for language changes
        const languageSwitcher = document.getElementById('languageSwitcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('click', () => {
                setTimeout(() => this.applyTranslations(), 100);
            });
        }
    }

    // Apply translations to modal elements
    applyTranslations() {
        const currentLang = localStorage.getItem('language') || 'fr';
        
        // Apply translations to all elements with data-translate attributes
        const translatableElements = this.modal.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (window.translations && window.translations[currentLang] && window.translations[currentLang][key]) {
                element.textContent = window.translations[currentLang][key];
            }
        });
        
        // Debug: Check if translations are being applied
        console.log('Applying translations for language:', currentLang);
        console.log('Available translations:', window.translations ? 'Yes' : 'No');
        console.log('Modal elements with data-translate:', this.modal.querySelectorAll('[data-translate]').length);
    }

    // Create simplified world map SVG
    createWorldMap() {
        if (!this.svg) return;

        // Clear existing content
        this.svg.innerHTML = '';

        // Simplified world map data (basic country shapes)
        const mapData = this.getSimplifiedMapData();
        
        mapData.forEach(country => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', country.path);
            path.setAttribute('class', 'country-path');
            path.setAttribute('data-country', country.code);
            path.setAttribute('data-name', country.name);
            
            // Add region class if country is targeted
            const region = this.getCountryRegion(country.code);
            if (region) {
                path.classList.add('highlighted');
                path.classList.add(region);
            }
            
            this.svg.appendChild(path);
        });
    }

    // Simplified world map data (more detailed and representative)
    getSimplifiedMapData() {
        return [
            // Africa - More realistic shapes
            { code: 'SEN', name: 'Sénégal', path: 'M 180 250 L 200 245 L 205 265 L 190 270 L 175 265 Z' },
            { code: 'MLI', name: 'Mali', path: 'M 175 230 L 210 225 L 215 250 L 180 255 Z' },
            { code: 'NER', name: 'Niger', path: 'M 215 220 L 250 215 L 255 240 L 220 245 Z' },
            { code: 'BFA', name: 'Burkina Faso', path: 'M 190 245 L 220 240 L 225 265 L 195 270 Z' },
            { code: 'GIN', name: 'Guinée', path: 'M 165 265 L 185 260 L 190 280 L 170 285 Z' },
            { code: 'CIV', name: 'Côte d\'Ivoire', path: 'M 180 280 L 210 275 L 215 295 L 185 300 Z' },
            { code: 'NGA', name: 'Nigeria', path: 'M 225 265 L 265 260 L 270 285 L 230 290 Z' },
            { code: 'GHA', name: 'Ghana', path: 'M 210 290 L 235 285 L 240 305 L 215 310 Z' },
            
            { code: 'ETH', name: 'Éthiopie', path: 'M 285 265 L 325 260 L 330 285 L 290 290 Z' },
            { code: 'KEN', name: 'Kenya', path: 'M 295 290 L 325 285 L 330 305 L 300 310 Z' },
            { code: 'UGA', name: 'Ouganda', path: 'M 275 285 L 305 280 L 310 300 L 280 305 Z' },
            { code: 'TZA', name: 'Tanzanie', path: 'M 300 310 L 335 305 L 340 325 L 305 330 Z' },
            { code: 'RWA', name: 'Rwanda', path: 'M 270 290 L 290 285 L 295 305 L 275 310 Z' },
            { code: 'MDG', name: 'Madagascar', path: 'M 345 325 L 365 320 L 370 340 L 350 345 Z' },
            
            { code: 'COD', name: 'RDC', path: 'M 245 285 L 285 280 L 290 325 L 250 330 Z' },
            { code: 'CAF', name: 'Centrafrique', path: 'M 235 265 L 265 260 L 270 285 L 240 290 Z' },
            { code: 'TCD', name: 'Tchad', path: 'M 225 245 L 255 240 L 260 265 L 230 270 Z' },
            { code: 'CMR', name: 'Cameroun', path: 'M 235 275 L 265 270 L 270 295 L 240 300 Z' },
            
            { code: 'MOZ', name: 'Mozambique', path: 'M 310 325 L 345 320 L 350 340 L 315 345 Z' },
            { code: 'AGO', name: 'Angola', path: 'M 235 325 L 265 320 L 270 345 L 240 350 Z' },
            { code: 'MWI', name: 'Malawi', path: 'M 300 315 L 325 310 L 330 330 L 305 335 Z' },
            { code: 'ZMB', name: 'Zambie', path: 'M 275 315 L 305 310 L 310 335 L 280 340 Z' },
            
            // Asia - More detailed shapes
            { code: 'IND', name: 'Inde', path: 'M 445 195 L 495 190 L 500 245 L 450 250 Z' },
            { code: 'PAK', name: 'Pakistan', path: 'M 415 195 L 445 190 L 450 235 L 420 240 Z' },
            { code: 'BGD', name: 'Bangladesh', path: 'M 495 225 L 515 220 L 520 245 L 500 250 Z' },
            { code: 'NPL', name: 'Népal', path: 'M 475 185 L 495 180 L 500 205 L 480 210 Z' },
            { code: 'BTN', name: 'Bhoutan', path: 'M 490 185 L 510 180 L 515 205 L 495 210 Z' },
            
            { code: 'IDN', name: 'Indonésie', path: 'M 515 305 L 575 300 L 580 325 L 520 330 Z' },
            { code: 'PHL', name: 'Philippines', path: 'M 505 285 L 525 280 L 530 305 L 510 310 Z' },
            { code: 'MMR', name: 'Myanmar', path: 'M 495 265 L 525 260 L 530 285 L 500 290 Z' },
            { code: 'LAO', name: 'Laos', path: 'M 485 265 L 515 260 L 520 285 L 490 290 Z' },
            { code: 'KHM', name: 'Cambodge', path: 'M 500 285 L 530 280 L 535 305 L 505 310 Z' },
            { code: 'VNM', name: 'Vietnam', path: 'M 510 265 L 540 260 L 545 285 L 515 290 Z' },
            
            { code: 'AFG', name: 'Afghanistan', path: 'M 425 175 L 455 170 L 460 195 L 430 200 Z' },
            { code: 'UZB', name: 'Ouzbékistan', path: 'M 440 155 L 480 150 L 485 175 L 445 180 Z' },
            { code: 'TJK', name: 'Tadjikistan', path: 'M 455 155 L 485 150 L 490 175 L 460 180 Z' },
            
            // Latin America - Better shapes
            { code: 'BRA', name: 'Brésil', path: 'M 145 375 L 195 370 L 200 425 L 150 430 Z' },
            { code: 'BOL', name: 'Bolivie', path: 'M 135 405 L 165 400 L 170 425 L 140 430 Z' },
            { code: 'PER', name: 'Pérou', path: 'M 115 395 L 145 390 L 150 435 L 120 440 Z' },
            { code: 'COL', name: 'Colombie', path: 'M 95 375 L 125 370 L 130 405 L 100 410 Z' },
            { code: 'ECU', name: 'Équateur', path: 'M 85 405 L 115 400 L 120 425 L 90 430 Z' },
            { code: 'PRY', name: 'Paraguay', path: 'M 135 425 L 165 420 L 170 445 L 140 450 Z' },
            
            { code: 'GTM', name: 'Guatemala', path: 'M 75 355 L 105 350 L 110 385 L 80 390 Z' },
            { code: 'HND', name: 'Honduras', path: 'M 85 365 L 115 360 L 120 395 L 90 400 Z' },
            { code: 'HTI', name: 'Haïti', path: 'M 105 355 L 125 350 L 130 385 L 110 390 Z' },
            { code: 'NIC', name: 'Nicaragua', path: 'M 75 385 L 105 380 L 110 415 L 80 420 Z' },
            
            // Middle East & North Africa - Improved positioning
            { code: 'YEM', name: 'Yémen', path: 'M 335 225 L 365 220 L 370 245 L 340 250 Z' },
            { code: 'SYR', name: 'Syrie', path: 'M 315 185 L 345 180 L 350 205 L 320 210 Z' },
            { code: 'IRQ', name: 'Irak', path: 'M 325 205 L 355 200 L 360 225 L 330 230 Z' },
            { code: 'MAR', name: 'Maroc', path: 'M 155 205 L 185 200 L 190 225 L 160 230 Z' },
            { code: 'MRT', name: 'Mauritanie', path: 'M 165 225 L 195 220 L 200 245 L 170 250 Z' }
        ];
    }

    // Get country region
    getCountryRegion(countryCode) {
        for (const [region, data] of Object.entries(this.countries)) {
            if (region === 'middleEast') {
                if (data.countries.includes(countryCode)) return 'middle-east';
            } else {
                for (const subregion of Object.values(data)) {
                    if (subregion.includes(countryCode)) {
                        return region;
                    }
                }
            }
        }
        return null;
    }

    // Setup event listeners
    setupEventListeners() {
        // Wait a bit to ensure DOM is ready
        setTimeout(() => {
            // Open map button from hero section
            this.openMapBtn = document.getElementById('open-map-btn');
            if (this.openMapBtn) {
                this.openMapBtn.addEventListener('click', () => this.showModal());
                console.log('Map button found and event listener attached');
            } else {
                console.error('Map button not found!');
            }

            // Close modal
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.hideModal());
            }

            // Close on overlay click
            if (this.modalOverlay) {
                this.modalOverlay.addEventListener('click', () => this.hideModal());
            }

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                    this.hideModal();
                }
            });

            // Country hover effects with enhanced information
            const countryPaths = this.svg.querySelectorAll('.country-path');
            countryPaths.forEach(path => {
                path.addEventListener('mouseenter', (e) => this.showTooltip(e));
                path.addEventListener('mouseleave', () => this.hideTooltip());
                path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
            });
        }, 200);
    }

    // Show modal
    showModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            setTimeout(() => {
                this.modal.classList.add('show');
                this.applyTranslations(); // Apply translations when modal opens
            }, 10);
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide modal
    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            setTimeout(() => {
                this.modal.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        }
    }

    // Show country tooltip with contextual information
    showTooltip(event) {
        const path = event.target;
        const countryName = path.getAttribute('data-name');
        const countryCode = path.getAttribute('data-country');
        const region = this.getCountryRegion(countryCode);

        if (!this.tooltip || !countryName) return;

        const titleElement = this.tooltip.querySelector('.tooltip-title');
        const regionElement = this.tooltip.querySelector('.tooltip-region');

        titleElement.textContent = countryName;
        
        // Add contextual region information
        const regionInfo = this.getRegionContext(region);
        regionElement.textContent = regionInfo;

        this.tooltip.classList.add('show');
    }

    // Get contextual region information
    getRegionContext(region) {
        const currentLang = localStorage.getItem('language') || 'fr';
        
        const regionContexts = {
            'africa': {
                fr: '🌍 Afrique (Priorité 1) - Éloignement des centres de santé en zone rurale',
                en: '🌍 Africa (Priority 1) - Remote healthcare centers in rural areas'
            },
            'asia': {
                fr: '🏔️ Asie (Priorité 2) - Relief montagneux et îles éloignées',
                en: '🏔️ Asia (Priority 2) - Mountainous terrain and remote islands'
            },
            'latinAmerica': {
                fr: '🌎️ Amérique Latine (Priorité 3) - Populations indigènes Amazonie/Andes',
                en: '🌎️ Latin America (Priority 3) - Indigenous populations in Amazon/Andes'
            },
            'middle-east': {
                fr: '🏜️ Moyen-Orient (Priorité 4) - Zones désertiques et reconstruction',
                en: '🏜️ Middle East (Priority 4) - Desert zones and reconstruction'
            }
        };

        return region && regionContexts[region] 
            ? regionContexts[region][currentLang] 
            : (currentLang === 'fr' ? 'Zone d\'intervention' : 'Intervention zone');
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

    // Get region name in current language
    getRegionName(region) {
        const translations = {
            'africa': {
                fr: 'Afrique',
                en: 'Africa'
            },
            'asia': {
                fr: 'Asie & Pacifique',
                en: 'Asia & Pacific'
            },
            'latinAmerica': {
                fr: 'Amérique latine & Caraïbes',
                en: 'Latin America & Caribbean'
            },
            'middle-east': {
                fr: 'Moyen-Orient & Afrique du Nord',
                en: 'Middle East & North Africa'
            }
        };

        const currentLang = localStorage.getItem('language') || 'fr';
        return region && translations[region] ? translations[region][currentLang] : '';
    }
}

// Initialize map modal when DOM is ready
let mapModalInstance;

// Wait for DOM to be ready before initializing
function initializeMapModal() {
    mapModalInstance = new MapModal();
}

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMapModal);
} else {
    initializeMapModal();
}

// Re-apply translations when language changes
const originalLanguageManager = window.LanguageManager;
if (originalLanguageManager) {
    const originalSwitchLanguage = originalLanguageManager.prototype.switchLanguage;
    originalLanguageManager.prototype.switchLanguage = function(lang) {
        originalSwitchLanguage.call(this, lang);
        // Re-apply translations to modal when language changes
        if (mapModalInstance && mapModalInstance.modal) {
            setTimeout(() => mapModalInstance.applyTranslations(), 100);
        }
    };
}

// Also listen for language switcher clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lang-btn')) {
        setTimeout(() => {
            if (mapModalInstance && mapModalInstance.modal) {
                mapModalInstance.applyTranslations();
            }
        }, 150);
    }
});
