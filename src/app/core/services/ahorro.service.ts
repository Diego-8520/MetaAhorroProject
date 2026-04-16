import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AhorroRecord } from '../models/ahorro-record.model';

interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class AhorroService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost/metaahorro-api';

  async crearAhorro(ahorro: Omit<AhorroRecord, 'id' | 'createdAt'>): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ ok: boolean; message?: string }>(`${this.apiUrl}/crear_ahorro.php`, ahorro),
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudo crear el ahorro');
    }
  }

  async obtenerAhorrosPorUsuario(uid: string): Promise<AhorroRecord[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<AhorroRecord[]>>(
        `${this.apiUrl}/listar_ahorros.php?uid=${encodeURIComponent(uid)}`,
      ),
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudieron obtener los ahorros');
    }

    return response.data ?? [];
  }

  async actualizarAhorro(
    id: string,
    ahorro: Omit<AhorroRecord, 'id' | 'createdAt'>,
  ): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ ok: boolean; message?: string }>(`${this.apiUrl}/actualizar_ahorro.php`, {
        id,
        ...ahorro,
      }),
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudo actualizar el ahorro');
    }
  }

  async eliminarAhorro(id: string, uid: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ ok: boolean; message?: string }>(`${this.apiUrl}/eliminar_ahorro.php`, {
        id,
        uid,
      }),
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudo eliminar el ahorro');
    }
  }
}
