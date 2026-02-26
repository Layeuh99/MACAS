// World Map Interactive Component
class WorldMap {
    constructor() {
        this.countries = this.getTargetCountries();
        this.svg = document.getElementById('world-map');
        this.tooltip = document.getElementById('country-tooltip');
        this.mapSection = document.getElementById('map-section');
        this.toggleSection = document.getElementById('map-toggle-section');
        this.showMapBtn = document.getElementById('show-map-btn');
        
        this.init();
    }

    // Target countries by region
    getTargetCountries() {
        return {
            africa: {
                west: ['SEN', 'MLI', 'NER', 'BFA', 'GIN', 'CIV', 'NGA', 'GHA'],
                east: ['ETH', 'KEN', 'UGA', 'TZA', 'RWA', 'MDG'],
                central: ['COD', 'CAF', 'TCD', 'CMR'],
                south: ['MOZ', 'AGO', 'MWI', 'ZMB']
            },
            asia: {
                south: ['IND', 'PAK', 'BGD', 'NPL', 'BTN'],
                southeast: ['IDN', 'PHL', 'MMR', 'LAO', 'KHM', 'VNM'],
                central: ['AFG', 'UZB', 'TJK']
            },
            latinAmerica: {
                south: ['BRA', 'BOL', 'PER', 'COL', 'ECU', 'PRY'],
                central: ['GTM', 'HND', 'HTI', 'NIC']
            },
            middleEast: {
                countries: ['YEM', 'SYR', 'IRQ', 'MAR', 'MRT']
            }
        };
    }

    init() {
        this.createWorldMap();
        this.setupEventListeners();
        this.setupLanguageSupport();
    }

    // Create simplified world map SVG
    createWorldMap() {
        if (!this.svg) return;

        // Simplified world map paths (basic shapes for demonstration)
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

    // Simplified world map data (basic country shapes)
    getSimplifiedMapData() {
        return [
            // Africa
            { code: 'SEN', name: 'Sénégal', path: 'M 200 250 L 220 250 L 220 270 L 200 270 Z' },
            { code: 'MLI', name: 'Mali', path: 'M 190 230 L 210 230 L 210 250 L 190 250 Z' },
            { code: 'NER', name: 'Niger', path: 'M 210 220 L 230 220 L 230 240 L 210 240 Z' },
            { code: 'BFA', name: 'Burkina Faso', path: 'M 200 240 L 220 240 L 220 260 L 200 260 Z' },
            { code: 'GIN', name: 'Guinée', path: 'M 180 260 L 200 260 L 200 280 L 180 280 Z' },
            { code: 'CIV', name: 'Côte d\'Ivoire', path: 'M 190 270 L 210 270 L 210 290 L 190 290 Z' },
            { code: 'NGA', name: 'Nigeria', path: 'M 220 260 L 240 260 L 240 280 L 220 280 Z' },
            { code: 'GHA', name: 'Ghana', path: 'M 210 280 L 230 280 L 230 300 L 210 300 Z' },
            
            { code: 'ETH', name: 'Éthiopie', path: 'M 280 260 L 300 260 L 300 280 L 280 280 Z' },
            { code: 'KEN', name: 'Kenya', path: 'M 290 280 L 310 280 L 310 300 L 290 300 Z' },
            { code: 'UGA', name: 'Ouganda', path: 'M 280 280 L 300 280 L 300 300 L 280 300 Z' },
            { code: 'TZA', name: 'Tanzanie', path: 'M 290 300 L 310 300 L 310 320 L 290 320 Z' },
            { code: 'RWA', name: 'Rwanda', path: 'M 270 280 L 290 280 L 290 300 L 270 300 Z' },
            { code: 'MDG', name: 'Madagascar', path: 'M 320 320 L 340 320 L 340 340 L 320 340 Z' },
            
            { code: 'COD', name: 'RDC', path: 'M 250 280 L 270 280 L 270 320 L 250 320 Z' },
            { code: 'CAF', name: 'Centrafrique', path: 'M 240 260 L 260 260 L 260 280 L 240 280 Z' },
            { code: 'TCD', name: 'Tchad', path: 'M 230 240 L 250 240 L 250 260 L 230 260 Z' },
            { code: 'CMR', name: 'Cameroun', path: 'M 230 270 L 250 270 L 250 290 L 230 290 Z' },
            
            { code: 'MOZ', name: 'Mozambique', path: 'M 300 320 L 320 320 L 320 340 L 300 340 Z' },
            { code: 'AGO', name: 'Angola', path: 'M 240 320 L 260 320 L 260 340 L 240 340 Z' },
            { code: 'MWI', name: 'Malawi', path: 'M 290 310 L 310 310 L 310 330 L 290 330 Z' },
            { code: 'ZMB', name: 'Zambie', path: 'M 270 310 L 290 310 L 290 330 L 270 330 Z' },
            
            // Asia
            { code: 'IND', name: 'Inde', path: 'M 450 200 L 480 200 L 480 240 L 450 240 Z' },
            { code: 'PAK', name: 'Pakistan', path: 'M 420 200 L 450 200 L 450 230 L 420 230 Z' },
            { code: 'BGD', name: 'Bangladesh', path: 'M 480 210 L 500 210 L 500 230 L 480 230 Z' },
            { code: 'NPL', name: 'Népal', path: 'M 470 190 L 490 190 L 490 210 L 470 210 Z' },
            { code: 'BTN', name: 'Bhoutan', path: 'M 480 190 L 500 190 L 500 210 L 480 210 Z' },
            
            { code: 'IDN', name: 'Indonésie', path: 'M 520 280 L 560 280 L 560 300 L 520 300 Z' },
            { code: 'PHL', name: 'Philippines', path: 'M 510 260 L 530 260 L 530 280 L 510 280 Z' },
            { code: 'MMR', name: 'Myanmar', path: 'M 500 240 L 520 240 L 520 260 L 500 260 Z' },
            { code: 'LAO', name: 'Laos', path: 'M 490 240 L 510 240 L 510 260 L 490 260 Z' },
            { code: 'KHM', name: 'Cambodge', path: 'M 500 260 L 520 260 L 520 280 L 500 280 Z' },
            { code: 'VNM', name: 'Vietnam', path: 'M 510 240 L 530 240 L 530 260 L 510 260 Z' },
            
            { code: 'AFG', name: 'Afghanistan', path: 'M 430 180 L 450 180 L 450 200 L 430 200 Z' },
            { code: 'UZB', name: 'Ouzbékistan', path: 'M 440 160 L 460 160 L 460 180 L 440 180 Z' },
            { code: 'TJK', name: 'Tadjikistan', path: 'M 450 160 L 470 160 L 470 180 L 450 180 Z' },
            
            // Latin America
            { code: 'BRA', name: 'Brésil', path: 'M 150 380 L 180 380 L 180 420 L 150 420 Z' },
            { code: 'BOL', name: 'Bolivie', path: 'M 140 400 L 160 400 L 160 420 L 140 420 Z' },
            { code: 'PER', name: 'Pérou', path: 'M 120 400 L 140 400 L 140 430 L 120 430 Z' },
            { code: 'COL', name: 'Colombie', path: 'M 100 380 L 120 380 L 120 400 L 100 400 Z' },
            { code: 'ECU', name: 'Équateur', path: 'M 90 400 L 110 400 L 110 420 L 90 420 Z' },
            { code: 'PRY', name: 'Paraguay', path: 'M 140 420 L 160 420 L 160 440 L 140 440 Z' },
            
            { code: 'GTM', name: 'Guatemala', path: 'M 80 360 L 100 360 L 100 380 L 80 380 Z' },
            { code: 'HND', name: 'Honduras', path: 'M 90 370 L 110 370 L 110 390 L 90 390 Z' },
            { code: 'HTI', name: 'Haïti', path: 'M 110 360 L 130 360 L 130 380 L 110 380 Z' },
            { code: 'NIC', name: 'Nicaragua', path: 'M 80 380 L 100 380 L 100 400 L 80 400 Z' },
            
            // Middle East & North Africa
            { code: 'YEM', name: 'Yémen', path: 'M 340 220 L 360 220 L 360 240 L 340 240 Z' },
            { code: 'SYR', name: 'Syrie', path: 'M 320 180 L 340 180 L 340 200 L 320 200 Z' },
            { code: 'IRQ', name: 'Irak', path: 'M 330 200 L 350 200 L 350 220 L 330 220 Z' },
            { code: 'MAR', name: 'Maroc', path: 'M 160 200 L 180 200 L 180 220 L 160 220 Z' },
            { code: 'MRT', name: 'Mauritanie', path: 'M 170 220 L 190 220 L 190 240 L 170 240 Z' }
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
        // Show map button
        if (this.showMapBtn) {
            this.showMapBtn.addEventListener('click', () => this.showMap());
        }

        // Map toggle in navigation
        const mapToggle = document.getElementById('map-toggle');
        if (mapToggle) {
            mapToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMap();
            });
        }

        // Country hover effects
        const countryPaths = this.svg.querySelectorAll('.country-path');
        countryPaths.forEach(path => {
            path.addEventListener('mouseenter', (e) => this.showTooltip(e));
            path.addEventListener('mouseleave', () => this.hideTooltip());
            path.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
        });
    }

    // Show map with animation
    showMap() {
        if (this.toggleSection) {
            this.toggleSection.style.display = 'none';
        }
        
        if (this.mapSection) {
            this.mapSection.style.display = 'block';
            setTimeout(() => {
                this.mapSection.classList.add('active');
            }, 100);
        }

        // Smooth scroll to map
        this.mapSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Show country tooltip
    showTooltip(event) {
        const path = event.target;
        const countryName = path.getAttribute('data-name');
        const countryCode = path.getAttribute('data-country');
        const region = this.getCountryRegion(countryCode);

        if (!this.tooltip || !countryName) return;

        const titleElement = this.tooltip.querySelector('.tooltip-title');
        const regionElement = this.tooltip.querySelector('.tooltip-region');

        titleElement.textContent = countryName;
        regionElement.textContent = this.getRegionName(region);

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

        const x = event.pageX + 10;
        const y = event.pageY - 30;

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

    // Setup language support
    setupLanguageSupport() {
        // Add translations for map elements
        if (typeof window.translations !== 'undefined') {
            this.addMapTranslations();
        }
    }

    // Add map-specific translations
    addMapTranslations() {
        const mapTranslations = {
            fr: {
                'map-title': '50 Pays Ciblés',
                'map-subtitle': 'Notre mission mondiale pour l\'accès aux soins de santé',
                'legend-title': 'Légende',
                'legend-africa': 'Afrique',
                'legend-asia': 'Asie & Pacifique',
                'legend-latin': 'Amérique latine & Caraïbes',
                'legend-middle-east': 'Moyen-Orient & Afrique du Nord',
                'stat-countries': 'Pays ciblés',
                'stat-regions': 'Régions',
                'stat-population': 'Population touchée',
                'toggle-title': 'Découvrez Notre Portée Mondiale',
                'toggle-description': 'Explorez les 50 pays où Health On Wheels apporte des soins de santé essentiels aux populations les plus vulnérables.',
                'show-map-btn': 'Voir la Carte Interactive'
            },
            en: {
                'map-title': '50 Target Countries',
                'map-subtitle': 'Our global mission for healthcare access',
                'legend-title': 'Legend',
                'legend-africa': 'Africa',
                'legend-asia': 'Asia & Pacific',
                'legend-latin': 'Latin America & Caribbean',
                'legend-middle-east': 'Middle East & North Africa',
                'stat-countries': 'Target countries',
                'stat-regions': 'Regions',
                'stat-population': 'Population reached',
                'toggle-title': 'Discover Our Global Reach',
                'toggle-description': 'Explore the 50 countries where Health On Wheels brings essential healthcare to the most vulnerable populations.',
                'show-map-btn': 'View Interactive Map'
            }
        };

        // Merge with existing translations
        if (window.translations) {
            window.translations.fr = { ...window.translations.fr, ...mapTranslations.fr };
            window.translations.en = { ...window.translations.en, ...mapTranslations.en };
        }
    }
}

// Initialize world map when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WorldMap();
});
