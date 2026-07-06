import avenueRender from './assets/AVENUE.jpg'

export const PROJECTS_DATA = [
  {
    slug: 'erbil-avenue',
    title: 'Erbil Avenue',
    short:
      'Erbil Avenue is a premium mixed-use development, offering a unique blend of luxury living, world-class retail, gourmet dining, and diverse leisure experiences.',
    description:
      'Erbil Avenue is a premium mixed-use development, offering a unique blend of luxury living, world-class retail, gourmet dining, and diverse leisure experiences. This project sets a new benchmark for excellence in the region.',
    category: 'Mixed-Use Development',
    location: 'Erbil, Kurdistan',
    year: '2024',
    status: 'In Development',
    // Ordered, CMS-shaped section list. Each item's `type` maps to a component
    // in src/project-sections. This is the dynamic layout the backend will feed.
    sections: [
      {
        type: 'hero',
        title: 'Erbil Avenue',
        description:
          'Erbil Avenue is a premium mixed-use development, offering a unique blend of luxury living, world-class retail, gourmet dining, and diverse leisure experiences. This project sets a new benchmark for excellence in the region.',
      },
      {
        type: 'banner',
        image: avenueRender,
        alt: 'Erbil Avenue — entrance render',
      },
      {
        type: 'statement',
        segments: [
          { text: 'Developed in collaboration with ' },
          { text: 'ALCOVE', emphasis: true },
          { text: ' a ' },
          { text: 'KRD Holding', emphasis: true },
          { text: ' subsidiary and ' },
          { text: 'TopCrest Architects,', emphasis: true },
          { text: ' Erbil Avenue benefits from expertise in innovative ' },
          { text: 'design', emphasis: true },
          { text: ' and sustainable ' },
          { text: 'development', emphasis: true },
          { text: ' practices.' },
        ],
      },
      {
        type: 'gallery',
        eyebrow: 'Gallery',
        title: 'Explore the project',
        // TODO: replace with the real gallery renders (night view, interiors,
        // etc.). Duplicated here so the carousel/peek is demonstrable.
        images: [
          { src: avenueRender, alt: 'Erbil Avenue — entrance, day' },
          { src: avenueRender, alt: 'Erbil Avenue — entrance, day' },
          { src: avenueRender, alt: 'Erbil Avenue — entrance, day' },
        ],
      },
      {
        type: 'location',
        title: 'Location',
        // NOTE: each tab needs its own centre image. Placeholder = the AVENUE
        // render with different crops so the vertical slide is visible; replace
        // `image` per tab (and confirm the last two bodies) with real assets.
        items: [
          {
            label: 'Prime Accessibility',
            body: 'Situated in the heart of Erbil with unmatched access to transport links, business hubs, and residential neighborhoods.',
            image: avenueRender,
            imagePosition: 'center 30%',
          },
          {
            label: 'Proximity to Key Institutions',
            body: 'Minutes from government offices, universities, hospitals, and the international airport — the essentials of daily life within easy reach.',
            image: avenueRender,
            imagePosition: 'center 50%',
          },
          {
            label: 'Tourism & Growth',
            body: 'Anchored in a fast-growing district that draws visitors and investment, supporting strong long-term value.',
            image: avenueRender,
            imagePosition: 'center 72%',
          },
        ],
      },
      {
        type: 'features',
        groups: [
          {
            title: 'Design &\nSustainability',
            bg: '#E6EBF0',
            rows: [
              {
                feature: 'Architectural Excellence',
                description: [
                  { text: 'Featuring ' },
                  { text: 'innovative', bold: true },
                  { text: ' design, ' },
                  { text: 'high-end', bold: true },
                  { text: ' finishes, and ' },
                  { text: 'luxury', bold: true },
                  { text: ' amenities.' },
                ],
              },
              {
                feature: 'Environmental Sustainability',
                description: [
                  { text: 'Built with ' },
                  { text: 'eco-friendly materials', bold: true },
                  { text: ' and ' },
                  { text: 'technologies', bold: true },
                  { text: ', including ' },
                  { text: 'lush', bold: true },
                  { text: ' parklands and ' },
                  { text: 'landscaped', bold: true },
                  { text: ' areas.' },
                ],
              },
            ],
          },
          {
            title: 'Facilities\n& Amenities',
            bg: '#D9DEE4',
            rows: [
              {
                feature: 'Retail Excellence',
                description: [
                  {
                    text: 'Hosting diverse international and local brands, offering an unparalleled luxury shopping experience.',
                  },
                ],
              },
              {
                feature: 'Culinary Experiences',
                description: [
                  { text: 'Featuring global names like ' },
                  { text: 'Gordon Ramsay Street Burger', bold: true, underline: true },
                  { text: ' First in the Middle East, ' },
                  { text: 'CZN Burak', bold: true, underline: true },
                  { text: ', ' },
                  { text: 'Entrecôte Café de Paris', bold: true, underline: true },
                  { text: ', and ' },
                  { text: 'EL&N London', bold: true, underline: true },
                  { text: '.' },
                ],
              },
              {
                feature: 'Entertainment',
                description: [
                  { text: 'World of Padel', bold: true, underline: true },
                  { text: ' courts, ' },
                  { text: 'Chronoclash Paintball Arena', bold: true, underline: true },
                  { text: ', ' },
                  { text: 'Cultural events', bold: true, underline: true },
                  { text: ', and ' },
                  { text: 'Ramadan tents', bold: true, underline: true },
                  { text: '.' },
                ],
              },
            ],
          },
          {
            title: 'Tenant\nPartnerships',
            subtitle: 'Built on four pillars:',
            bg: '#D3D8E0',
            rows: [
              {
                feature: 'Strategic Support',
                description: [
                  { text: 'Personalized collaboration to optimize ' },
                  { text: 'operations', bold: true },
                  { text: ' and ' },
                  { text: 'marketing', bold: true },
                  { text: '.' },
                ],
              },
              {
                feature: 'Operational Support',
                description: [
                  { text: 'Ongoing consultation to drive ' },
                  { text: 'traffic', bold: true },
                  { text: ' and ' },
                  { text: 'sales', bold: true },
                  { text: '.' },
                ],
              },
              {
                feature: 'Investor Collaboration',
                description: [
                  { text: 'Partnering to maximize ' },
                  { text: 'growth', bold: true },
                  { text: ' and ' },
                  { text: 'returns', bold: true },
                  { text: '.' },
                ],
              },
              {
                feature: 'Tailored Leasing Packages',
                description: [
                  { text: 'Flexible leasing options and pricing for ' },
                  { text: 'long-term success', bold: true },
                  { text: '.' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: '2nd-avenue',
    title: '2nd Avenue',
    short:
      'Second Avenue is an elegant commercial development, designed as a destination for luxury shopping, premium dining, and lifestyle experiences.',
    description:
      'Second Avenue is an elegant commercial development, designed as a destination for luxury shopping, premium dining, and lifestyle experiences. Featuring global trademarks and international restaurants, it sets a new standard for sophistication in Erbil.',
    category: 'Commercial',
    location: 'Erbil, Kurdistan',
    year: '2024',
    status: 'In Development',
  },
  {
    slug: 'nice-village',
    title: 'Nice Village',
    short:
      'Nice Village is a premium residential community, situated in one of the most exclusive and serene areas of Erbil.',
    description:
      'Nice Village is a premium residential community, situated in one of the most exclusive and serene areas of Erbil. Designed for elegance, privacy, and comfort, it combines luxury villas with integrated retail and lifestyle amenities.',
    category: 'Residential',
    location: 'Erbil, Kurdistan',
    year: '2023',
    status: 'Completed',
  },
  {
    slug: 'nni',
    title: 'NNI',
    short:
      'The NNI Project is a flagship industrial development by Alcove Company, designed to meet the growing demand for high-quality, modern industrial spaces in Erbil.',
    description:
      'The NNI Project is a flagship industrial development by Alcove Company, designed to meet the growing demand for high-quality, modern industrial spaces in Erbil.',
    category: 'Industrial',
    location: 'Erbil, Kurdistan',
    year: '2024',
    status: 'In Development',
  },
  {
    slug: 'youth-hub',
    title: 'Youth Hub',
    short:
      'Youth Hub is the largest and most advanced youth center in the Kurdistan Region and Iraq.',
    description:
      'Youth Hub is the largest and most advanced youth center in the Kurdistan Region and Iraq — an inclusive destination for youth and beyond. With modern facilities and diverse opportunities, it is a vibrant space that inspires creativity and sparks collaboration.',
    category: 'Community',
    location: 'Erbil, Kurdistan',
    year: '2023',
    status: 'Completed',
  },
  {
    slug: 'avenue-square',
    title: 'Avenue Square',
    short:
      'Avenue Square is a premium residential community combining luxury villas with integrated retail and lifestyle amenities.',
    description:
      'Avenue Square is a premium residential community, situated in one of the most exclusive and serene areas of Erbil. Designed for elegance, privacy, and comfort, it combines luxury villas with integrated retail and lifestyle amenities.',
    category: 'Residential',
    location: 'Erbil, Kurdistan',
    year: '2024',
    status: 'In Development',
  },
]

export const getProjectBySlug = (slug) =>
  PROJECTS_DATA.find((p) => p.slug === slug)
