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
