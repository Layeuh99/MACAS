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

        // Créer une carte SVG plus réaliste et bien positionnée
        mapContainer.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
                border-radius: 16px;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <svg viewBox="0 0 1200 600" style="width: 100%; height: 100%; max-width: 900px;">
                    <!-- Océan -->
                    <rect width="1200" height="600" fill="#4682B4"/>
                    
                    <!-- Grille de latitude/longitude -->
                    <g stroke="#ffffff" stroke-width="0.5" opacity="0.2">
                        <line x1="0" y1="300" x2="1200" y2="300"/>
                        <line x1="600" y1="0" x2="600" y2="600"/>
                        <line x1="300" y1="0" x2="300" y2="600"/>
                        <line x1="900" y1="0" x2="900" y2="600"/>
                        <line x1="0" y1="150" x2="1200" y2="150"/>
                        <line x1="0" y1="450" x2="1200" y2="450"/>
                    </g>
                    
                    <!-- Continents avec formes plus réalistes -->
                    <!-- Afrique -->
                    <g fill="#ff6b35" stroke="#ffffff" stroke-width="2" opacity="0.8">
                        <path d="M 650 250 Q 680 200, 720 220 T 750 280 Q 740 350, 700 400 T 650 420 Q 620 380, 600 340 T 620 280 Z"/>
                        <text x="680" y="340" text-anchor="middle" fill="white" font-size="16" font-weight="bold">AFRIQUE</text>
                    </g>
                    
                    <!-- Asie -->
                    <g fill="#ffd93d" stroke="#ffffff" stroke-width="2" opacity="0.8">
                        <path d="M 850 150 Q 920 120, 1000 180 T 1050 250 Q 1020 320, 950 340 T 880 300 Q 860 220, 850 150 Z"/>
                        <text x="950" y="240" text-anchor="middle" fill="white" font-size="16" font-weight="bold">ASIE</text>
                    </g>
                    
                    <!-- Amérique du Nord -->
                    <g fill="#6bcf7f" stroke="#ffffff" stroke-width="2" opacity="0.8">
                        <path d="M 150 150 Q 200 120, 250 140 T 280 200 Q 270 250, 240 280 T 180 260 Q 150 220, 140 180 Z"/>
                        <text x="210" y="210" text-anchor="middle" fill="white" font-size="14" font-weight="bold">AMÉRIQUE</text>
                    </g>
                    
                    <!-- Amérique du Sud -->
                    <g fill="#6bcf7f" stroke="#ffffff" stroke-width="2" opacity="0.8">
                        <path d="M 200 350 Q 230 340, 250 380 T 240 450 Q 220 480, 190 460 T 170 400 Q 180 370, 200 350 Z"/>
                    </g>
                    
                    <!-- Moyen-Orient -->
                    <g fill="#4a90e2" stroke="#ffffff" stroke-width="2" opacity="0.8">
                        <path d="M 600 200 Q 630 190, 650 210 T 640 250 Q 620 260, 600 240 T 590 220 Z"/>
                        <text x="620" y="230" text-anchor="middle" fill="white" font-size="12" font-weight="bold">MOYEN-ORIENT</text>
                    </g>
                    
                    <!-- Europe -->
                    <g fill="#9b59b6" stroke="#ffffff" stroke-width="2" opacity="0.8">
                        <path d="M 550 120 Q 580 110, 600 130 T 590 160 Q 570 170, 550 150 T 540 130 Z"/>
                        <text x="570" y="145" text-anchor="middle" fill="white" font-size="12" font-weight="bold">EUROPE</text>
                    </g>
                    
                    <!-- Points pour les pays ciblés avec coordonnées améliorées -->
                    <g fill="#ff0000" stroke="#ffffff" stroke-width="1.5">
                        ${this.generateTargetPoints()}
                    </g>
                    
                    <!-- Titre de la carte -->
                    <text x="600" y="40" text-anchor="middle" fill="white" font-size="24" font-weight="bold" opacity="0.9">
                        50 Pays Ciblés par Health On Wheels
                    </text>
                </svg>
                
                <!-- Légende améliorée -->
                <div style="
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    max-width: 200px;
                ">
                    <h4 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 700;">Zones d'Intervention</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 20px; height: 20px; background: #ff6b35; border-radius: 4px; box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);"></div>
                            <div>
                                <div style="color: #1e293b; font-size: 14px; font-weight: 600;">Afrique</div>
                                <div style="color: #64748b; font-size: 12px;">22 pays</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 20px; height: 20px; background: #ffd93d; border-radius: 4px; box-shadow: 0 2px 8px rgba(255, 217, 61, 0.3);"></div>
                            <div>
                                <div style="color: #1e293b; font-size: 14px; font-weight: 600;">Asie & Pacifique</div>
                                <div style="color: #64748b; font-size: 12px;">14 pays</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 20px; height: 20px; background: #6bcf7f; border-radius: 4px; box-shadow: 0 2px 8px rgba(107, 207, 127, 0.3);"></div>
                            <div>
                                <div style="color: #1e293b; font-size: 14px; font-weight: 600;">Amérique</div>
                                <div style="color: #64748b; font-size: 12px;">10 pays</div>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 20px; height: 20px; background: #4a90e2; border-radius: 4px; box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);"></div>
                            <div>
                                <div style="color: #1e293b; font-size: 14px; font-weight: 600;">Moyen-Orient</div>
                                <div style="color: #64748b; font-size: 12px;">4 pays</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="
                        margin-top: 15px;
                        padding-top: 15px;
                        border-top: 1px solid #e2e8f0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <div style="width: 12px; height: 12px; background: #ff0000; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(255, 0, 0, 0.3);"></div>
                        <div style="color: #1e293b; font-size: 13px; font-weight: 600;">Pays ciblés</div>
                    </div>
                </div>
            </div>
        `;

        console.log('SimpleMap: Simple map initialized successfully');
    }

    generateTargetPoints() {
        const coordinates = {
            // Afrique - coordonnées améliorées
            'SN': {x: 620, y: 380}, 'ML': {x: 600, y: 340}, 'NE': {x: 680, y: 320}, 'BF': {x: 630, y: 350},
            'GN': {x: 590, y: 360}, 'CI': {x: 640, y: 390}, 'NG': {x: 670, y: 330}, 'GH': {x: 640, y: 370},
            'ET': {x: 750, y: 300}, 'KE': {x: 760, y: 340}, 'UG': {x: 740, y: 320}, 'TZ': {x: 780, y: 400},
            'RW': {x: 750, y: 380}, 'MG': {x: 800, y: 450}, 'CD': {x: 720, y: 400}, 'CF': {x: 700, y: 330},
            'TD': {x: 710, y: 310}, 'CM': {x: 670, y: 300}, 'MZ': {x: 820, y: 420}, 'AO': {x: 750, y: 430},
            'MW': {x: 790, y: 410}, 'ZM': {x: 780, y: 390}, 'MA': {x: 580, y: 280}, 'MR': {x: 620, y: 330},
            
            // Asie - coordonnées améliorées
            'IN': {x: 920, y: 250}, 'PK': {x: 880, y: 270}, 'BD': {x: 960, y: 280}, 'NP': {x: 940, y: 260},
            'BT': {x: 950, y: 250}, 'ID': {x: 1050, y: 380}, 'PH': {x: 1070, y: 320}, 'MM': {x: 1030, y: 300},
            'LA': {x: 1020, y: 320}, 'KH': {x: 1040, y: 330}, 'VN': {x: 1060, y: 310}, 'AF': {x: 850, y: 280},
            'UZ': {x: 900, y: 240}, 'TJ': {x: 910, y: 250},
            
            // Amérique - coordonnées améliorées
            'BR': {x: 250, y: 400}, 'BO': {x: 220, y: 430}, 'PE': {x: 180, y: 350}, 'CO': {x: 150, y: 310},
            'EC': {x: 120, y: 330}, 'PY': {x: 280, y: 470}, 'GT': {x: 100, y: 250}, 'HN': {x: 80, y: 270},
            'HT': {x: 90, y: 290}, 'NI': {x: 70, y: 260},
            
            // Moyen-Orient - coordonnées améliorées
            'YE': {x: 680, y: 290}, 'SY': {x: 670, y: 270}, 'IQ': {x: 690, y: 260}
        };

        let points = '';
        Object.entries(coordinates).forEach(([code, pos]) => {
            if (this.targetCountries[code]) {
                // Ajouter un effet de pulsation
                points += `
                    <circle cx="${pos.x}" cy="${pos.y}" r="6" fill="#ff0000" stroke="#ffffff" stroke-width="2">
                        <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="${pos.x}" cy="${pos.y}" r="3" fill="#ffffff" stroke="#ff0000" stroke-width="1"/>
                `;
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
