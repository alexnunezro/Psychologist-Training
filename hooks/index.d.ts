declare module "@/hooks/use-language" {
  export function useLanguage(): {
    language: "en" | "es";
    setLanguage: (language: "en" | "es") => void;
  };
}

declare module "@/hooks/use-show-patient-info" {
  export function useShowPatientInfo(): {
    showPatientInfo: boolean;
    setShowPatientInfo: (show: boolean) => void;
  };
}

declare module "@/hooks/use-show-patient-list" {
  export function useShowPatientList(): {
    showPatientList: boolean;
    setShowPatientList: (show: boolean) => void;
  };
}

declare module "@/hooks/use-patients" {
  import type { Patient } from "@/types/patient";
  export function usePatients(): {
    patients: Patient[];
    setPatients: (patients: Patient[] | ((prev: Patient[]) => Patient[])) => void;
    selectedPatient: Patient;
    setSelectedPatient: (patient: Patient) => void;
    deletePatient: (patientId: string) => void;
    addPatient: (patient: Patient) => void;
  };
}

declare module "@/hooks/use-mobile" {
  export function useMobileDetect(): boolean;
} 