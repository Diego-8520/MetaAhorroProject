import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';

export interface AhorroRecordMysql {
  id?: number;
  uid: string;
  displayName: string;
  email: string;
  nombreAhorro: string;
  descripcionAhorro: string;
  ahorroMensual: number;
  meses: number;
  meta: number;
  ahorroTotal: number;
  cumplioMeta: boolean;
  diferenciaMeta: number;
  createdAt?: string;
}

export interface DashboardResumen {
  total_registros: number;
  total_ahorrado: number;
  metas_cumplidas: number;
  metas_pendientes: number;
  ultimo_registro: string | null;
}

export interface DashboardReporte {
  resumen: DashboardResumen;
  detalle: AhorroRecordMysql[];
}

export interface PhpListarAhorrosResponse {
  ok: boolean;
  data: AhorroRecordMysql[];
  message?: string;
}

export interface PhpMutationResponse {
  ok: boolean;
  message: string;
  id?: number;
}

export interface PhpDashboardResponse {
  ok: boolean;
  data: DashboardReporte;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MysqlAhorroService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost/metaahorro-api';
  private readonly ahorroActualizadoSubject = new Subject<void>();

  readonly ahorroActualizado$ = this.ahorroActualizadoSubject.asObservable();

  async crearAhorro(data: AhorroRecordMysql): Promise<PhpMutationResponse> {
    const response = await firstValueFrom(
      this.http.post<PhpMutationResponse>(`${this.apiBaseUrl}/crear_ahorro.php`, data),
    );

    this.ahorroActualizadoSubject.next();
    return response;
  }

  async obtenerAhorros(uid: string): Promise<AhorroRecordMysql[]> {
    const params = new HttpParams().set('uid', uid);
    const response = await firstValueFrom(
      this.http.get<PhpListarAhorrosResponse>(`${this.apiBaseUrl}/listar_ahorros.php`, {
        params,
      }),
    );

    return response.data ?? [];
  }

  async obtenerReporteDashboard(uid: string): Promise<DashboardReporte> {
    const params = new HttpParams().set('uid', uid);
    const response = await firstValueFrom(
      this.http.get<PhpDashboardResponse>(`${this.apiBaseUrl}/reporte_dashboard.php`, {
        params,
      }),
    );

    return response.data;
  }

  async actualizarAhorro(data: AhorroRecordMysql): Promise<PhpMutationResponse> {
    const response = await firstValueFrom(
      this.http.put<PhpMutationResponse>(`${this.apiBaseUrl}/actualizar_ahorro.php`, data),
    );

    this.ahorroActualizadoSubject.next();
    return response;
  }

  async eliminarAhorro(id: number, uid: string): Promise<PhpMutationResponse> {
    const options = {
      body: { id, uid },
    };
    const response = await firstValueFrom(
      this.http.delete<PhpMutationResponse>(`${this.apiBaseUrl}/eliminar_ahorro.php`, options),
    );

    this.ahorroActualizadoSubject.next();
    return response;
  }
}
