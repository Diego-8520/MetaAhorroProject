import { Injectable, inject } from '@angular/core';

import { AhorroRecord } from '../models/ahorro-record.model';
import { MysqlAhorroService } from './mysql-ahorro.service';

@Injectable({
  providedIn: 'root',
})
export class AhorroService {
  private readonly mysqlAhorroService = inject(MysqlAhorroService);

  readonly ahorroActualizado$ = this.mysqlAhorroService.ahorroActualizado$;

  async crearAhorro(ahorro: Omit<AhorroRecord, 'id' | 'createdAt'>): Promise<void> {
    await this.mysqlAhorroService.crearAhorro({
      ...ahorro,
      id: undefined,
    });
  }

  async obtenerAhorrosPorUsuario(uid: string): Promise<AhorroRecord[]> {
    const ahorros = await this.mysqlAhorroService.obtenerAhorros(uid);

    return ahorros.map((ahorro) => ({
      ...ahorro,
      id: ahorro.id?.toString(),
      createdAt: ahorro.createdAt ?? null,
    }));
  }

  async actualizarAhorro(
    id: string,
    ahorro: Omit<AhorroRecord, 'id' | 'createdAt'>,
  ): Promise<void> {
    await this.mysqlAhorroService.actualizarAhorro({
      ...ahorro,
      id: Number(id),
    });
  }

  async eliminarAhorro(id: string, uid = ''): Promise<void> {
    if (!uid) {
      throw new Error('Se requiere uid para eliminar un ahorro en MySQL.');
    }

    await this.mysqlAhorroService.eliminarAhorro(Number(id), uid);
  }
}
