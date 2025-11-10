import { QueryDocumentSnapshot } from '@angular/fire/firestore';

export interface Services {
  id: string;
  title: string;
  description: string;
  file: string | null;
  type: ServiceType;
  requirements: string[];
  createdAt: Date;
  updatedAt: Date;
}
export const ServicesConverter = {
  toFirestore: (data: Services) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => {
    const data = snap.data() as Services;
    data.createdAt = (data.createdAt as any).toDate();
    data.updatedAt = (data.updatedAt as any).toDate();
    return data;
  },
};

export enum ServiceType {
  TvetPrograms = 'TVET_PROGRAMS',
  CompetencyStandardsDevelopment = 'COMPETENCY_STANDARDS_DEVELOPMENT',
  CompetencyAssessmentAndCertification = 'COMPETENCY_ASSESSMENT_AND_CERTIFICATION',
  ProgramRegistrationAndAccreditation = 'PROGRAM_REGISTRATION_AND_ACCREDITATION',
  DirectoryOfSchoolsWithRegisteredPrograms = 'DIRECTORY_OF_SCHOOLS_WITH_REGISTERED_PROGRAMS',
  DirectoryOfAccreditedTvetTrainers = 'DIRECTORY_OF_ACCREDITED_TVET_TRAINERS',
  TrainingRegulations = 'TRAINING_REGULATIONS',
  CompetencyStandards = 'COMPETENCY_STANDARDS',
}

/**
 * Readable labels for each Service Type.
 */
export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.TvetPrograms]: 'TVET Programs',
  [ServiceType.CompetencyStandardsDevelopment]:
    'Competency Standards Development',
  [ServiceType.CompetencyAssessmentAndCertification]:
    'Competency Assessment and Certification',
  [ServiceType.ProgramRegistrationAndAccreditation]:
    'Program Registration and Accreditation',
  [ServiceType.DirectoryOfSchoolsWithRegisteredPrograms]:
    'Directory of Schools with Registered Programs',
  [ServiceType.DirectoryOfAccreditedTvetTrainers]:
    'Directory of Accredited TVET Trainers',
  [ServiceType.TrainingRegulations]: 'Training Regulations',
  [ServiceType.CompetencyStandards]: 'Competency Standards',
};
