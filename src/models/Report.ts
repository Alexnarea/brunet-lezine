export interface ReportDto {
  id?: number; // Opcional porque al crear no lo envías
  filePath: string;
  generatedAt?: string; // Opcional si lo maneja el backend automáticamente
  evaluationId: number;
}
