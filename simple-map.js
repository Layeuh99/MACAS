// Carte Interactive Simplifiée - SOLUTION GARANTIE
class SimpleMap {
    constructor() {
        this.mapContainer = null;
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
        
        console.log('SimpleMap: Constructor completed');
    }

    setupModalListeners() {
        const openMapBtn = document.getElementById('open-map-btn');
        const closeMapBtn = document.getElementById('close-map-modal');
        const modalOverlay = document.getElementById('map-modal-overlay');
        const modal = document.getElementById('map-modal');

        console.log('SimpleMap: Setting up event listeners...');

        if (openMapBtn) {
            openMapBtn.addEventListener('click', (e) => {
                console.log('SimpleMap: Open button clicked!');
                e.preventDefault();
                e.stopPropagation();
                this.showModal();
            });
        }

        if (closeMapBtn) {
            closeMapBtn.addEventListener('click', () => {
                console.log('SimpleMap: Close button clicked');
                this.hideModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                console.log('SimpleMap: Overlay clicked');
                this.hideModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                console.log('SimpleMap: Escape key pressed');
                this.hideModal();
            }
        });
    }

    showModal() {
        const modal = document.getElementById('map-modal');
        console.log('SimpleMap: Showing modal...');
        
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                this.initializeSimpleMap();
                this.createDashboard();
            }, 100);
        }
    }

    hideModal() {
        const modal = document.getElementById('map-modal');
        console.log('SimpleMap: Hiding modal...');
        
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    initializeSimpleMap() {
        console.log('SimpleMap: Initializing simple map...');
        
        const mapContainer = document.getElementById('leaflet-map');
        if (!mapContainer) {
            console.error('SimpleMap: Map container not found!');
            return;
        }

        // Créer une carte SVG simple qui fonctionne TOUJOURS
        mapContainer.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #e3f2fd 0%, #bb6bd9 100%);
                border-radius: 16px;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <svg viewBox="0 0 1000 500" style="width: 100%; height: 100%; max-width: 800px;">
                    <!-- Fond -->
                    <rect width="1000" height="500" fill="#4a90e2"/>
                    
                    <!-- Grille -->
                    <g stroke="#ffffff" stroke-width="0.5" opacity="0.3">
                        <line x1="0" y1="250" x2="1000" y2="250"/>
                        <line x1="500" y1="0" x2="500" y2="500"/>
                    </g>
                    
                    <!-- Continents simplifiés -->
                    <!-- Afrique -->
                    <g fill="#ff6b35" stroke="#ffffff" stroke-width="2">
                        <ellipse cx="600" cy="350" rx="120" ry="80"/>
                        <text x="600" y="355" text-anchor="middle" fill="white" font-size="14" font-weight="bold">AFRIQUE</text>
                    </g>
                    
                    <!-- Asie -->
                    <g fill="#ffd93d" stroke="#ffffff" stroke-width="2">
                        <ellipse cx="750" cy="200" rx="150" ry="100"/>
                        <text x="750" y="205" text-anchor="middle" fill="white" font-size="14" font-weight="bold">ASIE</text>
                    </g>
                    
                    <!-- Amérique -->
                    <g fill="#6bcf7f" stroke="#ffffff" stroke-width="2">
                        <ellipse cx="200" cy="200" rx="120" ry="100"/>
                        <text x="200" y="205" text-anchor="middle" fill="white" font-size="14" font-weight="bold">AMÉRIQUE</text>
                    </g>
                    
                    <!-- Moyen-Orient -->
                    <g fill="#4a90e2" stroke="#ffffff" stroke-width="2">
                        <ellipse cx="550" cy="280" rx="80" ry="60"/>
                        <text x="550" y="285" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MOYEN-ORIENT</text>
                    </g>
                    
                    <!-- Points pour les pays ciblés -->
                    <g fill="#ff0000" stroke="#ffffff" stroke-width="2">
                        ${this.generateTargetPoints()}
                    </g>
                </svg>
                
                <!-- Légende -->
                <div style="
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 15px;
                    border-radius: 10px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
                ">
                    <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">50 Pays Ciblés</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 16px; height: 16px; background: #ff6b35; border-radius: 3px;"></div>
                            <span style="color: #1e293b; font-size: 14px;">Afrique: 22 pays</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 16px; height: 16px; background: #ffd93d; border-radius: 3px;"></div>
                            <span style="color: #1e293b; font-size: 14px;">Asie: 14 pays</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 16px; height: 16px; background: #6bcf7f; border-radius: 3px;"></div>
                            <span style="color: #1e293b; font-size: 14px;">Amérique: 10 pays</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 16px; height: 16px; background: #4a90e2; border-radius: 3px;"></div>
                            <span style="color: #1e293b; font-size: 14px;">Moyen-Orient: 4 pays</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        console.log('SimpleMap: Simple map initialized successfully');
    }

    generateTargetPoints() {
        const coordinates = {
            'SN': {x: 580, y: 380}, 'ML': {x: 550, y: 340}, 'NE': {x: 620, y: 320}, 'BF': {x: 560, y: 350},
            'GN': {x: 540, y: 360}, 'CI': {x: 570, y: 390}, 'NG': {x: 600, y: 330}, 'GH': {x: 570, y: 370},
            'ET': {x: 680, y: 300}, 'KE': {x: 690, y: 340}, 'UG': {x: 670, y: 320}, 'TZ': {x: 700, y: 400},
            'RW': {x: 680, y: 380}, 'MG': {x: 720, y: 450}, 'CD': {x: 650, y: 400}, 'CF': {x: 630, y: 330},
            'TD': {x: 640, y: 310}, 'CM': {x: 600, y: 300}, 'MZ': {x: 720, y: 420}, 'AO': {x: 650, y: 430},
            'MW': {x: 690, y: 410}, 'ZM': {x: 680, y: 390}, 'IN': {x: 780, y: 250}, 'PK': {x: 750, y: 270},
            'BD': {x: 820, y: 280}, 'NP': {x: 800, y: 260}, 'BT': {x: 810, y: 250}, 'ID': {x: 850, y: 380},
            'PH': {x: 870, y: 320}, 'MM': {x: 830, y: 300}, 'LA': {x: 820, y: 320}, 'KH': {x: 840, y: 330},
            'VN': {x: 860, y: 310}, 'AF': {x: 730, y: 280}, 'UZ': {x: 760, y: 240}, 'TJ': {x: 770, y: 250},
            'BR': {x: 250, y: 350}, 'BO': {x: 220, y: 380}, 'PE': {x: 180, y: 320}, 'CO': {x: 150, y: 280},
            'EC': {x: 120, y: 300}, 'PY': {x: 280, y: 420}, 'GT': {x: 100, y: 220}, 'HN': {x: 80, y: 240},
            'HT': {x: 90, y: 260}, 'NI': {x: 70, y: 230}, 'YE': {x: 580, y: 290}, 'SY': {x: 570, y: 270},
            'IQ': {x: 590, y: 260}, 'MA': {x: 480, y: 300}, 'MR': {x: 520, y: 330}
        };

        let points = '';
        Object.entries(coordinates).forEach(([code, pos]) => {
            if (this.targetCountries[code]) {
                points += `<circle cx="${pos.x}" cy="${pos.y}" r="4" fill="#ff0000" stroke="#ffffff" stroke-width="1"/>`;
            }
        });

        return points;
    }

    createDashboard() {
        const dashboardContainer = document.getElementById('dashboard-content');
        if (!dashboardContainer) return;

        const africaCount = 22;
        const asiaCount = 14;
        const latinCount = 10;
        const middleEastCount = 4;
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
                margin-bottom: 12px;
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
                margin-bottom: 12px;
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
                margin-bottom: 12px;
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
                margin-bottom: 12px;
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

        console.log('SimpleMap: Dashboard created successfully');
    }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('SimpleMap: DOM loaded, initializing map...');
    
    window.simpleMapInstance = new SimpleMap();
    window.simpleMapInstance.setupModalListeners();
    
    console.log('SimpleMap: Setup completed');
});
