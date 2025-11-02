import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Career {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}
export const CareerConverter = {
  toFirestore: (data: Career) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Career;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};

export const CAREERS: Career[] = [
  {
    id: 'TESDAB-TESDS2-13-2020',
    title: 'TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST II',
    description: 'WORLD SKILLS COMPETITION SECTION, TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-09-24'),
    updatedAt: new Date('2025-09-24'),
  },
  {
    id: 'TESDAB-SRTESDS-12-2020',
    title:
      'SENIOR TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST (RE-OPEN)',
    description: 'WORLD SKILLS COMPETITION (WSCS), TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-09-24'),
    updatedAt: new Date('2025-09-24'),
  },
  {
    id: 'TESDAB-SADOF-55-2017',
    title: 'SUPERVISING ADMINISTRATIVE OFFICER',
    description:
      'HUMAN RESOURCE MANAGEMENT DIVISION, ADMINISTRATIVE SERVICE, TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-09-24'),
    updatedAt: new Date('2025-09-24'),
  },
  {
    id: 'TESDAB-VOCSA3-66-2017',
    title: 'VOCATIONAL SCHOOL ADMINISTRATOR III (RE-OPEN)',
    description: 'DAVAO NATIONAL AGRICULTURAL SCHOOL (DNAS), TESDA REGION XI',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-09-24'),
    updatedAt: new Date('2025-09-24'),
  },
  {
    id: 'TESDAB-SRTESDS-30014-2020',
    title: 'Senior Technical Education and Skills Development Specialist',
    description: 'REGIONAL TESDA CENTER - NCR',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-09-11'),
    updatedAt: new Date('2025-09-11'),
  },
  {
    id: 'TESDAB-TESDS2-8-2019',
    title: 'TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST II',
    description:
      'GREEN TECHNOLOGY CENTER (GTC), TRDD, NITESD, TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-09-09'),
    updatedAt: new Date('2025-09-09'),
  },
  {
    id: 'TESDAB-TESDS2-25-2025',
    title: 'TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST II',
    description: 'TESDA XII-PO NORTH COTABATO',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-22'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: 'TESDAB-TESDS2-26-2025',
    title: 'TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST II',
    description: 'TESDA XII-PO SARANGANI',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-22'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: 'TESDAB-SRTESDS-6-2025',
    title: 'SENIOR TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST',
    description: 'EBET PROGRAM DIVISION, EBETO, TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-23'),
    updatedAt: new Date('2025-10-23'),
  },
  {
    id: 'TESDAB-SRTESDS-5-2025',
    title: 'SENIOR TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST',
    description: 'EBET PROGRAM DIVISION, EBETO, TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-23'),
    updatedAt: new Date('2025-10-23'),
  },
  {
    id: 'TESDAB-SVTESDS-4-2025',
    title: 'SUPERVISING TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST',
    description: 'EBET PROGRAM DIVISION, EBETO, TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-23'),
    updatedAt: new Date('2025-10-23'),
  },
  {
    id: 'TESDAB-TESDS2-7-2025',
    title: 'TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST II',
    description: 'EBET PROGRAM DIVISION, EBETO, TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-23'),
    updatedAt: new Date('2025-10-23'),
  },
  {
    id: 'TESDAB-CTESDS-2-2025',
    title:
      'CHIEF TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST (RE-OPEN)',
    description: 'REGIONAL OPERATIONS DIVISION (ROD), TESDA NIR',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-22'),
    updatedAt: new Date('2025-10-22'),
  },
  {
    id: 'TESDAB-CTESDS-41-2017',
    title: 'CHIEF TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST',
    description:
      'PROGRAM REGISTRATION DIVISION (PRD), CERTIFICATION OFFICE (CO)',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-03'),
    updatedAt: new Date('2025-10-03'),
  },
  {
    id: 'TESDAB-SRTESDS-34-2017',
    title: 'SENIOR TECHNICAL EDUCATION AND SKILLS DEVELOPMENT SPECIALIST',
    description:
      'COMPETENCY ASSESSMENT DIVISION (CAD), CERTIFICATION OFFICE (CO), TESDA CENTRAL OFFICE',
    image:
      'https://firebasestorage.googleapis.com/v0/b/tesda-system.firebasestorage.app/o/careers%2F1761840651535_id-11134207-7qul1-ljc7ugakrfca6a.jpg?alt=media&token=9437df7f-f591-4646-a109-e2875c5929f2',
    createdAt: new Date('2025-10-02'),
    updatedAt: new Date('2025-10-02'),
  },
];
