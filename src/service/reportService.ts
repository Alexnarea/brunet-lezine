import api from './apiService';
import type { ReportDto } from '../models/Report';
import { saveAs } from 'file-saver';

const BASE_URL = '/reports';

const reportService = {
  findByEvaluationId: async (evaluationId: number): Promise<ReportDto | null> => {
    const response = await api.get(`${BASE_URL}/by-evaluation/${evaluationId}`);
    return response.data?.data || null;
  },

  generateReport: async (dto: ReportDto): Promise<ReportDto> => {
    const response = await api.post(BASE_URL, dto);
    return response.data?.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  // 🔽 Esta es la función que te falta
  downloadReport: async (evaluationId: number) => {
  const response = await api.get(`/reports/download/${evaluationId}`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const fileName = `reporte_evaluacion_${evaluationId}.pdf`;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
},

generateOrDownloadReport: async (evaluationId: number) => {
  // 1. Verificar si ya existe el reporte
  const existing = await reportService.findByEvaluationId(evaluationId);

  if (!existing) {
    // 2. Generarlo desde el backend (se encargará de construir el ReportDto)
    await api.post(`/reports/generate/${evaluationId}`);
  }

  // 3. Descargar el PDF
  await reportService.downloadReport(evaluationId);
}


};

export default reportService;
