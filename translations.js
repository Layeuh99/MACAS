// Translation system for Health On Wheels
const translations = {
    fr: {
        // Navigation
        'nav-home': 'Accueil',
        'nav-project': 'Le Projet',
        'nav-stakeholders': 'Partenaires',
        'nav-team': 'Équipe',
        'nav-action': 'Action',
        
        // Hero Section
        'hero-title-main': 'Health On Wheels',
        'hero-title-sub': 'Apporter la santé aux populations, pas les populations aux hôpitaux',
        'hero-description': 'Une clinique médicale mobile qui dessert les communautés rurales à travers le monde, offrant des soins essentiels à ceux qui en ont le plus besoin.',
        'hero-team-credit': 'Un projet piloté par l\'équipe MACAS',
        'hero-btn-primary': 'Découvrir le projet',
        'hero-btn-secondary': 'Soutenir l\'initiative',
        
        // Map Button
        'open-map-btn': '🌍 Découvrir les 50 Pays Ciblés',
        'map-description': 'Explorez notre carte interactive pour découvrir les 50 pays où Health On Wheels apporte des soins de santé essentiels aux populations les plus vulnérables.',
        
        // Map Modal
        'map-modal-title': 'Carte Interactive des 50 Pays Ciblés',
        'map-modal-subtitle': 'Découvrez notre portée mondiale et les défis spécifiques à chaque région',
        'region-africa-title': 'Afrique - Priorité Absolue',
        'region-africa-desc': 'Le besoin le plus critique en raison de l\'éloignement des centres de santé en zone rurale. Nos cliniques mobiles parcouvrent des centaines de kilomètres pour atteindre les populations les plus isolées.',
        'region-asia-title': 'Asie & Pacifique',
        'region-asia-desc': 'Le défi est souvent lié au relief (Himalaya) ou à l\'éparpillement des îles. La télémédecine et les drones nous permettent de surmonter ces barrières géographiques.',
        'region-latin-title': 'Amérique Latine & Caraïbes',
        'region-latin-desc': 'Les cliniques mobiles sont essentielles pour atteindre les populations indigènes en Amazonie ou dans les Andes, là où les infrastructures traditionnelles sont inexistantes.',
        'region-middle-east-title': 'Moyen-Orient & Afrique du Nord',
        'region-middle-east-desc': 'Le défi est principalement lié aux zones désertiques et aux zones de reconstruction post-conflit. Nos unités mobiles apportent des soins essentiels dans ces environnements extrêmes.',
        
        // Legend
        'legend-africa': 'Afrique',
        'legend-asia': 'Asie & Pacifique',
        'legend-latin': 'Amérique latine & Caraïbes',
        'legend-middle-east': 'Moyen-Orient & Afrique du Nord',
        'stat-countries': 'Pays ciblés',
        'stat-regions': 'Régions',
        'stat-population': 'Population touchée',
        
        // Stats
        'stat-1-label': 'Personnes soignées par mois',
        'stat-2-label': 'Pays ciblés',
        'stat-3-label': 'Milliards FCFA - Coût projet pilote',
        
        // Project Section
        'project-title': 'Le Projet',
        'project-subtitle': 'Une solution innovante pour les communautés rurales',
        'project-description': 'Health On Wheels est une clinique médicale mobile conçue pour surmonter les barrières géographiques et économiques qui limitent l\'accès aux soins de santé dans les zones rurales.',
        'project-intro-title': 'Introduction & Contexte',
        'problem-title': 'Problématique',
        'problem-1-title': 'Manque d\'hôpitaux',
        'problem-1-text': 'Les zones rurales manquent d\'infrastructures médicales adéquates',
        'problem-2-title': 'Manque de médecins',
        'problem-2-text': 'Pénurie de personnel médical qualifié dans les régions éloignées',
        'problem-3-title': 'Absence de moyens de transport',
        'problem-3-text': 'Difficulté d\'accès aux centres de santé existants',
        'problem-4-title': 'Maladies non traitées',
        'problem-4-text': 'Pathologies qui s\'aggravent par manque de suivi médical',
        'problem-5-title': 'Vaccinations manquées',
        'problem-5-text': 'Enfants et adultes non protégés contre les maladies évitables',
        'solution-title': 'Notre Solution',
        'solution-main-title': 'Clinique Médicale Mobile',
        'service-1-title': 'Premiers soins et traitements de base',
        'service-1-desc': 'Consultations, diagnostics et médicaments essentiels',
        'service-2-title': 'Campagnes de vaccination',
        'service-2-desc': 'Immunisation contre les maladies courantes et épidémies',
        'service-3-title': 'Éducation sanitaire et prévention',
        'service-3-desc': 'Sensibilisation aux bonnes pratiques d\'hygiène et de santé',
        'project-feature-1': 'Cliniques mobiles équipées',
        'project-feature-2': 'Personnel médical qualifié',
        'project-feature-3': 'Médicaments essentiels',
        'project-feature-4': 'Technologie de télémédecine',
        'project-feature-5': 'Formation communautaire',
        'project-feature-6': 'Suivi des patients',
        
        // Impact Section
        'impact-title': 'Bénéfices & Impact',
        'impact-1-label': 'Personnes soignées par mois',
        'impact-2-label': 'Réduction des décès évitables',
        'impact-3-label': 'Amélioration de la sensibilisation sanitaire',
        
        // Costs Section
        'costs-title': 'Coûts Estimatifs',
        'costs-pilot-title': 'Phase Pilote',
        'costs-pilot-amount': '50 milliards FCFA',
        'costs-pilot-item-1': 'Flotte de véhicules médicaux équipés',
        'costs-pilot-item-2': 'Médicaments et matériel médical',
        'costs-pilot-item-3': 'Personnel international et formation',
        'costs-pilot-item-4': 'Infrastructure logistique mondiale',
        'costs-pilot-item-5': 'Systèmes de gestion et coordination',
        'costs-annual-title': 'Fonctionnement Annuel',
        'costs-annual-amount': '5 milliards FCFA',
        'costs-annual-item-1': 'Carburant et maintenance flotte',
        'costs-annual-item-2': 'Consommables médicaux',
        'costs-annual-item-3': 'Rémunération personnel international',
        'costs-annual-item-4': 'Logistique et coordination mondiale',
        'costs-annual-item-5': 'Formation et programmes locaux',
        
        // Conflict Section
        'conflict-title': 'Gestion des Conflits Potentiels',
        'conflict-problem-title': '🚨 Conflit Potentiel',
        'conflict-problem-text': 'Manque de personnel permanent et de financement durable',
        'conflict-solution-title': '✅ Solution Proposée',
        'conflict-solution-text': 'Partenariats stratégiques avec les écoles de médecine pour le personnel et les ONG internationales pour le financement continu',
        
        // Stakeholders Section
        'stakeholders-title': 'Partenaires',
        'stakeholders-subtitle': 'Un écosystème collaboratif au service de la santé',
        'stakeholders-description': 'Notre succès repose sur une collaboration étroite avec divers partenaires partageant notre vision.',
        'stakeholder-1-title': 'Médecins et Infirmiers',
        'stakeholder-1-text': 'Engagement temps partiel pour les consultations mobiles',
        'stakeholder-1-role': 'Personnel médical',
        'stakeholder-2-title': 'Étudiants en Médecine',
        'stakeholder-2-text': 'Stages pratiques et expérience terrain valorisante',
        'stakeholder-2-role': 'Formation et soutien',
        'stakeholder-3-title': 'ONG',
        'stakeholder-3-text': 'Financement, équipements médicaux et expertise technique',
        'stakeholder-3-role': 'Partenaires financiers',
        
        // Team Section
        'team-title': 'Équipe MACAS',
        'team-subtitle': '4 talents passionnés derrière Health On Wheels',
        'team-intro': 'Une équipe complémentaire réunie par une mission commune : rendre la santé accessible à tous.',
        'team-member-1-role': 'Vision & Stratégie',
        'team-member-2-role': 'Opérations & Soins',
        'team-member-3-role': 'Innovation & Tech',
        'team-member-4-role': 'Logistique & Terrain',
        'team-btn': '+',
        'modal-skills-title': 'Compétences Clés',
        'modal-impact-title': 'Impact',
        'modal-close': 'Fermer',
        
        // Action Section
        'action-title': 'Rejoignez Notre Mission',
        'action-subtitle': 'Chaque contribution compte',
        'action-description': 'Rejoignez-nous dans cette mission vitale pour transformer l\'accès aux soins de santé dans les zones rurales du monde entier. Chaque contribution, chaque partenariat, chaque geste de soutien compte pour sauver des vies et construire un avenir plus sain.',
        'action-quote': '« Health On Wheels n\'est pas seulement une clinique — c\'est un espoir en mouvement. »',
        'action-quote-author': '- Équipe MACAS',
        'action-partner-title': 'Devenir partenaire',
        'action-partner-text': 'Collaborons pour créer un impact durable dans les communautés rurales.',
        'action-partner-btn': 'Devenir partenaire',
        'action-support-title': 'Soutenir le projet',
        'action-support-text': 'Soutenez notre mission par un don financier.',
        'action-support-btn': 'Soutenir le projet',
        'action-join-title': 'Rejoindre l\'initiative',
        'action-join-text': 'Rejoignez notre équipe de professionnels dévoués sur le terrain.',
        'action-join-btn': 'Rejoindre l\'initiative',
        'action-impact-number': '2000+',
        'action-impact-text': 'vies changées chaque mois',
        
        // Target Countries Section
        'target-countries-title': '50 Pays Ciblés',
        'target-countries-subtitle': 'Notre portée mondiale pour l\'accès aux soins de santé',
        'countries-intro': 'Health On Wheels opère dans 50 pays à travers le monde, concentrant nos efforts sur les régions où l\'accès aux soins de santé est le plus critique. Découvrez notre impact mondial.',
        'region-africa': 'Afrique',
        'region-asia': 'Asie & Pacifique',
        'region-latin': 'Amérique latine & Caraïbes',
        'region-middle-east': 'Moyen-Orient & Afrique du Nord',
        'africa-west': 'Afrique de l\'Ouest',
        'africa-east': 'Afrique de l\'Est',
        'africa-central': 'Afrique Centrale',
        'africa-south': 'Afrique Australe',
        'asia-south': 'Asie du Sud',
        'asia-southeast': 'Asie du Sud-Est',
        'asia-central': 'Asie Centrale',
        'latin-south': 'Amérique du Sud',
        'latin-central': 'Amérique centrale & Caraïbes',
        'map-cta-title': 'Visualisez Notre Impact Mondial',
        'map-cta-description': 'Explorez notre carte interactive pour voir la répartition géographique de nos interventions et découvrir l\'impact de Health On Wheels dans chaque région.',
        'map-modal-title': 'Carte Interactive des 50 Pays Ciblés',
        'map-modal-subtitle': 'Découvrez notre portée mondiale et les défis spécifiques à chaque région',
        'region-africa-title': 'Afrique - Priorité Absolue',
        'region-africa-desc': 'Le besoin le plus critique en raison de l\'éloignement des centres de santé en zone rurale. Nos cliniques mobiles parcouvrent des centaines de kilomètres pour atteindre les populations les plus isolées.',
        'region-asia-title': 'Asie & Pacifique',
        'region-asia-desc': 'Le défi est souvent lié au relief (Himalaya) ou à l\'éparpillement des îles. La télémédecine et les drones nous permettent de surmonter ces barrières géographiques.',
        'region-latin-title': 'Amérique Latine & Caraïbes',
        'region-latin-desc': 'Les cliniques mobiles sont essentielles pour atteindre les populations indigènes en Amazonie ou dans les Andes, là où les infrastructures traditionnelles sont inexistantes.',
        'region-middle-east-title': 'Moyen-Orient & Afrique du Nord',
        'region-middle-east-desc': 'Le défi est principalement lié aux zones désertiques et aux zones de reconstruction post-conflit. Nos unités mobiles apportent des soins essentiels dans ces environnements extrêmes.',
        
        // Legend
        'legend-africa': 'Afrique',
        'legend-asia': 'Asie & Pacifique',
        'legend-latin': 'Amérique latine & Caraïbes',
        'legend-middle-east': 'Moyen-Orient & Afrique du Nord',
        'stat-countries': 'Pays ciblés',
        'stat-regions': 'Régions',
        'stat-population': 'Population touchée',
        'toggle-title': 'Découvrez Notre Portée Mondiale',
        'toggle-description': 'Explorez les 50 pays où Health On Wheels apporte des soins de santé essentiels aux populations les plus vulnérables.',
        'show-map-btn': 'Voir la Carte Interactive',
        
        // Footer
        'footer-contact': 'Contact',
        'footer-legal': 'Légal',
        'footer-social': 'Suivez MACAS',
        'footer-mission': 'Apporter la santé aux populations, pas les populations aux hôpitaux',
        'footer-copyright': '© 2024 Health On Wheels',
        'footer-by': 'Par MACAS',
        'footer-rights': 'Tous droits réservés',
        
        // Team member details
        'member-director-name': 'Directeur Général',
        'member-director-desc': 'Leader visionnaire avec 15+ ans d\'expérience en santé mondiale. Expert en projets à impact social et gestion d\'équipes multiculturelles.',
        'member-director-skills': ['Stratégie', 'Gestion Internationale', 'Développement Durable', 'Leadership'],
        'member-director-impact': 'Architecte de la vision mondiale, coordonne les partenariats et assure l\'alignement stratégique.',
        
        'member-medical-name': 'Directrice Médicale',
        'member-medical-desc': 'Médecin humanitaire expert en santé publique et médecine d\'urgence. Spécialisée en interventions zones rurales et systèmes mobiles.',
        'member-medical-skills': ['Médecine d\'Urgence', 'Santé Publique', 'Logistique Médicale', 'Formation'],
        'member-medical-impact': 'Garante de la qualité des soins, supervise les protocoles médicaux et forme le personnel sur le terrain.',
        
        'member-cto-name': 'CTO',
        'member-cto-desc': 'Ingénieur logiciel spécialisé HealthTech. Expert en télémédecine, IA médicale et solutions mobiles.',
        'member-cto-skills': ['Télémédecine', 'IA et ML', 'Développement Mobile', 'Cybersécurité'],
        'member-cto-impact': 'Innovateur technologique, développe les solutions numériques et optimise les opérations via la tech.',
        
        'member-operations-name': 'Directrice des Opérations',
        'member-operations-desc': 'Experte en logistique humanitaire avec 10 ans d\'expérience. Spécialiste en chaîne d\'approvisionnement médicale.',
        'member-operations-skills': ['Logistique Humanitaire', 'Gestion de Flotte', 'Coordination Terrain', 'Optimisation'],
        'member-operations-impact': 'Cerveau opérationnel, assure le fonctionnement parfait des cliniques mobiles.'
    },
    
    en: {
        // Navigation
        'nav-home': 'Home',
        'nav-project': 'The Project',
        'nav-stakeholders': 'Partners',
        'nav-team': 'Team',
        'nav-action': 'Action',
        
        // Hero Section
        'hero-title-main': 'Health On Wheels',
        'hero-title-sub': 'Bringing healthcare to people, not people to hospitals',
        'hero-description': 'A mobile medical clinic serving rural communities worldwide, providing essential care to those who need it most.',
        'hero-team-credit': 'A project led by the MACAS team',
        'hero-btn-primary': 'Discover the project',
        'hero-btn-secondary': 'Support the initiative',
        
        // Map Button
        'open-map-btn': '🌍 Discover 50 Target Countries',
        'map-description': 'Explore our interactive map to discover the 50 countries where Health On Wheels brings essential healthcare to the most vulnerable populations.',
        
        // Map Modal
        'map-modal-title': 'Interactive Map of 50 Target Countries',
        'map-modal-subtitle': 'Discover our global reach and specific challenges for each region',
        'region-africa-title': 'Africa - Absolute Priority',
        'region-africa-desc': 'The most critical need due to remote healthcare centers in rural areas. Our mobile clinics travel hundreds of kilometers to reach the most isolated populations.',
        'region-asia-title': 'Asia & Pacific',
        'region-asia-desc': 'Challenges often related to mountainous terrain (Himalaya) or scattered islands. Telemedicine and drones help us overcome these geographical barriers.',
        'region-latin-title': 'Latin America & Caribbean',
        'region-latin-desc': 'Mobile clinics are essential for reaching indigenous populations in the Amazon or Andes, where traditional infrastructure is non-existent.',
        'region-middle-east-title': 'Middle East & North Africa',
        'region-middle-east-desc': 'Challenges primarily related to desert zones and post-conflict reconstruction. Our mobile units bring essential care in these extreme environments.',
        
        // Legend
        'legend-africa': 'Africa',
        'legend-asia': 'Asia & Pacific',
        'legend-latin': 'Latin America & Caribbean',
        'legend-middle-east': 'Middle East & North Africa',
        'stat-countries': 'Target countries',
        'stat-regions': 'Regions',
        'stat-population': 'Population reached',
        
        // Stats
        'stat-1-label': 'People treated per month',
        'stat-2-label': 'Target countries',
        'stat-3-label': 'Billion FCFA - Pilot project cost',
        
        // Project Section
        'project-title': 'The Project',
        'project-subtitle': 'An innovative solution for rural communities',
        'project-description': 'Health On Wheels is a mobile medical clinic designed to overcome geographical and economic barriers that limit access to healthcare in rural areas.',
        'project-intro-title': 'Introduction & Context',
        'problem-title': 'Problem Statement',
        'problem-1-title': 'Lack of Hospitals',
        'problem-1-text': 'Rural areas lack adequate medical infrastructure',
        'problem-2-title': 'Lack of Doctors',
        'problem-2-text': 'Shortage of qualified medical personnel in remote regions',
        'problem-3-title': 'Lack of Transportation',
        'problem-3-text': 'Difficulty accessing existing health centers',
        'problem-4-title': 'Untreated Diseases',
        'problem-4-text': 'Pathologies that worsen due to lack of medical follow-up',
        'problem-5-title': 'Missed Vaccinations',
        'problem-5-text': 'Children and adults unprotected against preventable diseases',
        'solution-title': 'Our Solution',
        'solution-main-title': 'Mobile Medical Clinic',
        'service-1-title': 'Basic first aid and treatments',
        'service-1-desc': 'Consultations, diagnostics and essential medications',
        'service-2-title': 'Vaccination campaigns',
        'service-2-desc': 'Immunization against common and epidemic diseases',
        'service-3-title': 'Health education and prevention',
        'service-3-desc': 'Awareness of good hygiene and health practices',
        'project-feature-1': 'Equipped mobile clinics',
        'project-feature-2': 'Qualified medical staff',
        'project-feature-3': 'Essential medications',
        'project-feature-4': 'Telemedicine technology',
        'project-feature-5': 'Community training',
        'project-feature-6': 'Patient follow-up',
        
        // Impact Section
        'impact-title': 'Benefits & Impact',
        'impact-1-label': 'People treated per month',
        'impact-2-label': 'Reduction in preventable deaths',
        'impact-3-label': 'Improved health awareness',
        
        // Costs Section
        'costs-title': 'Estimated Costs',
        'costs-pilot-title': 'Pilot Phase',
        'costs-pilot-amount': '50 billion FCFA',
        'costs-pilot-item-1': 'Fleet of equipped medical vehicles',
        'costs-pilot-item-2': 'Medications and medical equipment',
        'costs-pilot-item-3': 'International staff and training',
        'costs-pilot-item-4': 'Global logistics infrastructure',
        'costs-pilot-item-5': 'Management and coordination systems',
        'costs-annual-title': 'Annual Operations',
        'costs-annual-amount': '5 billion FCFA',
        'costs-annual-item-1': 'Fuel and fleet maintenance',
        'costs-annual-item-2': 'Medical consumables',
        'costs-annual-item-3': 'International staff compensation',
        'costs-annual-item-4': 'Global logistics and coordination',
        'costs-annual-item-5': 'Local training and programs',
        
        // Conflict Section
        'conflict-title': 'Potential Conflict Management',
        'conflict-problem-title': '🚨 Potential Conflict',
        'conflict-problem-text': 'Lack of permanent staff and sustainable funding',
        'conflict-solution-title': '✅ Proposed Solution',
        'conflict-solution-text': 'Strategic partnerships with medical schools for staff and international NGOs for continuous funding',
        
        // Stakeholders Section
        'stakeholders-title': 'Partners',
        'stakeholders-subtitle': 'A collaborative ecosystem serving health',
        'stakeholders-description': 'Our success relies on close collaboration with various partners who share our vision.',
        'stakeholder-1-title': 'Doctors and Nurses',
        'stakeholder-1-text': 'Part-time commitment for mobile consultations',
        'stakeholder-1-role': 'Medical Staff',
        'stakeholder-2-title': 'Medical Students',
        'stakeholder-2-text': 'Practical internships and valuable field experience',
        'stakeholder-2-role': 'Training and Support',
        'stakeholder-3-title': 'NGOs',
        'stakeholder-3-text': 'Funding, medical equipment and technical expertise',
        'stakeholder-3-role': 'Financial Partners',
        
        // Team Section
        'team-title': 'MACAS Team',
        'team-subtitle': '4 passionate talents behind Health On Wheels',
        'team-intro': 'A complementary team united by a common mission: making health accessible to all.',
        'team-member-1-role': 'Vision & Strategy',
        'team-member-2-role': 'Operations & Care',
        'team-member-3-role': 'Innovation & Tech',
        'team-member-4-role': 'Logistics & Field',
        'team-btn': '+',
        'modal-skills-title': 'Key Skills',
        'modal-impact-title': 'Impact',
        'modal-close': 'Close',
        
        // World Map Section
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
        'show-map-btn': 'View Interactive Map',
        
        // Action Section
        'action-title': 'Join Our Mission',
        'action-subtitle': 'Every contribution matters',
        'action-description': 'Join us in this vital mission to transform healthcare access in rural areas worldwide. Every contribution, every partnership, every act of support counts to save lives and build a healthier future.',
        'action-quote': '"Health On Wheels is not just a clinic — it\'s hope in motion."',
        'action-quote-author': '- MACAS Team',
        'action-partner-title': 'Become a Partner',
        'action-partner-text': 'Let\'s collaborate to create sustainable impact in rural communities.',
        'action-partner-btn': 'Become a Partner',
        'action-support-title': 'Support the Project',
        'action-support-text': 'Support our mission with a financial donation.',
        'action-support-btn': 'Support the Project',
        'action-join-title': 'Join the Initiative',
        'action-join-text': 'Join our team of dedicated professionals in the field.',
        'action-join-btn': 'Join the Initiative',
        'action-impact-number': '2000+',
        'action-impact-text': 'lives changed each month',
        
        // Target Countries Section
        'target-countries-title': '50 Target Countries',
        'target-countries-subtitle': 'Our global reach for healthcare access',
        'countries-intro': 'Health On Wheels operates in 50 countries worldwide, focusing our efforts on regions where healthcare access is most critical. Discover our global impact.',
        'region-africa': 'Africa',
        'region-asia': 'Asia & Pacific',
        'region-latin': 'Latin America & Caribbean',
        'region-middle-east': 'Middle East & North Africa',
        'africa-west': 'West Africa',
        'africa-east': 'East Africa',
        'africa-central': 'Central Africa',
        'africa-south': 'Southern Africa',
        'asia-south': 'South Asia',
        'asia-southeast': 'Southeast Asia',
        'asia-central': 'Central Asia',
        'latin-south': 'South America',
        'latin-central': 'Central America & Caribbean',
        'map-cta-title': 'Visualize Our Global Impact',
        'map-cta-description': 'Explore our interactive map to see the geographic distribution of our interventions and discover Health On Wheels\' impact in each region.',
        'map-modal-title': 'Interactive Map of 50 Target Countries',
        'map-modal-subtitle': 'Discover our global reach and specific challenges for each region',
        'region-africa-title': 'Africa - Absolute Priority',
        'region-africa-desc': 'The most critical need due to remote healthcare centers in rural areas. Our mobile clinics travel hundreds of kilometers to reach the most isolated populations.',
        'region-asia-title': 'Asia & Pacific',
        'region-asia-desc': 'Challenges often related to mountainous terrain (Himalaya) or scattered islands. Telemedicine and drones help us overcome these geographical barriers.',
        'region-latin-title': 'Latin America & Caribbean',
        'region-latin-desc': 'Mobile clinics are essential for reaching indigenous populations in the Amazon or Andes, where traditional infrastructure is non-existent.',
        'region-middle-east-title': 'Middle East & North Africa',
        'region-middle-east-desc': 'Challenges primarily related to desert zones and post-conflict reconstruction. Our mobile units bring essential care in these extreme environments.',
        
        // Footer
        'footer-contact': 'Contact',
        'footer-legal': 'Legal',
        'footer-social': 'Follow MACAS',
        'footer-mission': 'Bringing healthcare to people, not people to hospitals',
        'footer-copyright': '© 2024 Health On Wheels',
        'footer-by': 'By MACAS',
        'footer-rights': 'All rights reserved',
        
        // Team member details
        'member-director-name': 'General Director',
        'member-director-desc': 'Visionary leader with 15+ years in global health. Expert in social impact projects and multicultural team management.',
        'member-director-skills': ['Strategy', 'International Management', 'Sustainable Development', 'Leadership'],
        'member-director-impact': 'Architect of global vision, coordinates partnerships and ensures strategic alignment.',
        
        'member-medical-name': 'Medical Director',
        'member-medical-desc': 'Humanitarian doctor expert in public health and emergency medicine. Specialized in rural area interventions and mobile systems.',
        'member-medical-skills': ['Emergency Medicine', 'Public Health', 'Medical Logistics', 'Training'],
        'member-medical-impact': 'Guarantor of care quality, supervises medical protocols and trains field staff.',
        
        'member-cto-name': 'CTO',
        'member-cto-desc': 'Software engineer specialized in HealthTech. Expert in telemedicine, medical AI and mobile solutions.',
        'member-cto-skills': ['Telemedicine', 'AI and ML', 'Mobile Development', 'Cybersecurity'],
        'member-cto-impact': 'Technology innovator, develops digital solutions and optimizes operations via tech.',
        
        'member-operations-name': 'Operations Director',
        'member-operations-desc': 'Humanitarian logistics expert with 10 years experience. Specialist in medical supply chain.',
        'member-operations-skills': ['Humanitarian Logistics', 'Fleet Management', 'Field Coordination', 'Optimization'],
        'member-operations-impact': 'Operational brain, ensures perfect functioning of mobile clinics.'
    }
};

// Language management
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.translations = translations;
        this.init();
    }
    
    init() {
        this.setLanguage(this.currentLang);
        this.bindEvents();
    }
    
    bindEvents() {
        // Language switcher buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }
    
    setLanguage(lang) {
        if (!this.translations[lang]) return;
        
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        document.documentElement.dataset.lang = lang;
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Translate all elements
        this.translatePage();
    }
    
    translatePage() {
        // Translate elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Translate special elements
        this.translateSpecialElements();
    }
    
    translateSpecialElements() {
        // Hero title with spans
        const heroTitleMain = document.querySelector('.title-main');
        const heroTitleSub = document.querySelector('.title-sub');
        
        if (heroTitleMain) {
            heroTitleMain.textContent = this.getTranslation('hero-title-main');
        }
        if (heroTitleSub) {
            heroTitleSub.textContent = this.getTranslation('hero-title-sub');
        }
        
        // Hero description
        const heroDesc = document.querySelector('.hero-description');
        if (heroDesc) {
            const teamCredit = document.querySelector('.team-credit');
            const mainText = this.getTranslation('hero-description');
            const creditText = this.getTranslation('hero-team-credit');
            
            if (teamCredit) {
                heroDesc.innerHTML = `${mainText}<br><span class="team-credit">${creditText}</span>`;
            } else {
                heroDesc.textContent = mainText;
            }
        }
        
        // Hero buttons
        const primaryBtn = document.querySelector('.btn-primary');
        const secondaryBtn = document.querySelector('.btn-secondary');
        
        if (primaryBtn) {
            primaryBtn.textContent = this.getTranslation('hero-btn-primary');
        }
        if (secondaryBtn) {
            secondaryBtn.textContent = this.getTranslation('hero-btn-secondary');
        }
        
        // Stats
        document.querySelectorAll('.stat-label').forEach((element, index) => {
            const key = `stat-${index + 1}-label`;
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Team member modals
        this.translateTeamModals();
        
        // Footer
        this.translateFooter();
    }
    
    translateTeamModals() {
        // Team member roles
        const memberRoles = document.querySelectorAll('.member-role');
        const roles = [
            this.getTranslation('team-member-1-role'),
            this.getTranslation('team-member-2-role'),
            this.getTranslation('team-member-3-role'),
            this.getTranslation('team-member-4-role')
        ];
        
        memberRoles.forEach((element, index) => {
            if (roles[index]) {
                element.textContent = roles[index];
            }
        });
        
        // Modal content
        const modalData = [
            {
                name: 'director',
                title: 'member-director-name',
                desc: 'member-director-desc',
                skills: 'member-director-skills',
                impact: 'member-director-impact'
            },
            {
                name: 'medical',
                title: 'member-medical-name',
                desc: 'member-medical-desc',
                skills: 'member-medical-skills',
                impact: 'member-medical-impact'
            },
            {
                name: 'tech',
                title: 'member-cto-name',
                desc: 'member-cto-desc',
                skills: 'member-cto-skills',
                impact: 'member-cto-impact'
            },
            {
                name: 'operations',
                title: 'member-operations-name',
                desc: 'member-operations-desc',
                skills: 'member-operations-skills',
                impact: 'member-operations-impact'
            }
        ];
        
        modalData.forEach(member => {
            const modal = document.querySelector(`#${member.name}Modal`);
            if (modal) {
                // Update modal title
                const title = modal.querySelector('.modal-header h3');
                if (title) {
                    const translation = this.getTranslation(member.title);
                    if (translation) {
                        title.textContent = translation;
                    }
                }
                
                // Update modal description
                const desc = modal.querySelector('.modal-description p');
                if (desc) {
                    const translation = this.getTranslation(member.desc);
                    if (translation) {
                        desc.textContent = translation;
                    }
                }
                
                // Update skills
                const skillsTitle = modal.querySelector('.modal-skills h4');
                if (skillsTitle) {
                    const translation = this.getTranslation('modal-skills-title');
                    if (translation) {
                        skillsTitle.textContent = translation;
                    }
                }
                
                const skillsList = modal.querySelector('.modal-skills ul');
                if (skillsList) {
                    const skills = this.getTranslation(member.skills);
                    if (Array.isArray(skills)) {
                        skillsList.innerHTML = skills.map(skill => `<li>${skill}</li>`).join('');
                    }
                }
                
                // Update impact
                const impactTitle = modal.querySelector('.modal-impact h4');
                if (impactTitle) {
                    const translation = this.getTranslation('modal-impact-title');
                    if (translation) {
                        impactTitle.textContent = translation;
                    }
                }
                
                const impactText = modal.querySelector('.modal-impact p');
                if (impactText) {
                    const translation = this.getTranslation(member.impact);
                    if (translation) {
                        impactText.textContent = translation;
                    }
                }
            }
        });
    }
    
    translateFooter() {
        // Footer sections
        const footerContact = document.querySelector('.footer-contact h4');
        const footerLegal = document.querySelector('.footer-legal h4');
        const footerSocial = document.querySelector('.social-links h4');
        
        if (footerContact) {
            footerContact.textContent = this.getTranslation('footer-contact');
        }
        if (footerLegal) {
            footerLegal.textContent = this.getTranslation('footer-legal');
        }
        if (footerSocial) {
            footerSocial.textContent = this.getTranslation('footer-social');
        }
        
        // Footer mission
        const footerMission = document.querySelector('.footer-mission');
        if (footerMission) {
            footerMission.textContent = this.getTranslation('footer-mission');
        }
        
        // Footer legal text
        const legalTexts = document.querySelectorAll('.footer-legal p');
        if (legalTexts.length >= 3) {
            legalTexts[0].textContent = this.getTranslation('footer-copyright');
            legalTexts[1].textContent = this.getTranslation('footer-by');
            legalTexts[2].textContent = this.getTranslation('footer-rights');
        }
    }
    
    getTranslation(key) {
        return this.translations[this.currentLang][key] || key;
    }
    
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Initialize language manager
let languageManager;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
});

// Export for global access
window.languageManager = languageManager;
