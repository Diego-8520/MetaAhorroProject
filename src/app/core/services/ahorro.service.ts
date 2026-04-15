<<<<<<< HEAD
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AhorroRecord } from '../models/ahorro-record.model';

interface ApiResponse<T> {
  ok: boolean;
  message?: string;
  data: T;
}
=======
//Este servicio se encarga de manejar las operaciones relacionadas con los registros de ahorro, como crear, leer, actualizar y eliminar registros en Firestore.

import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '../firebase/firebase.config';
import { AhorroRecord } from '../models/ahorro-record.model';
>>>>>>> 42c540de330652ec431f9e2b396f53f98c7f2525

@Injectable({
  providedIn: 'root',
})
export class AhorroService {
<<<<<<< HEAD
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost/metaahorro-api';

  async crearAhorro(ahorro: Omit<AhorroRecord, 'id' | 'createdAt'>): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ ok: boolean; message?: string }>(
        `${this.apiUrl}/crear_ahorro.php`,
        ahorro
      )
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudo crear el ahorro');
    }
  }

  async obtenerAhorrosPorUsuario(uid: string): Promise<AhorroRecord[]> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<AhorroRecord[]>>(
        `${this.apiUrl}/listar_ahorros.php?uid=${encodeURIComponent(uid)}`
      )
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudieron obtener los ahorros');
    }

    return response.data ?? [];
=======
  private readonly collectionName = 'ahorros';

  constructor() {}

  async crearAhorro(ahorro: Omit<AhorroRecord, 'id' | 'createdAt'>): Promise<void> {
    const ahorrosRef = collection(db, this.collectionName);

    await addDoc(ahorrosRef, {
      ...ahorro,
      createdAt: serverTimestamp(),
    });
  }

  async obtenerAhorrosPorUsuario(uid: string): Promise<AhorroRecord[]> {
    const ahorrosRef = collection(db, this.collectionName);

    const q = query(ahorrosRef, where('uid', '==', uid), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AhorroRecord[];
>>>>>>> 42c540de330652ec431f9e2b396f53f98c7f2525
  }

  async actualizarAhorro(
    id: string,
<<<<<<< HEAD
    ahorro: Omit<AhorroRecord, 'id' | 'createdAt'>
  ): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ ok: boolean; message?: string }>(
        `${this.apiUrl}/actualizar_ahorro.php`,
        {
          id,
          ...ahorro,
        }
      )
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudo actualizar el ahorro');
    }
  }

  async eliminarAhorro(id: string, uid: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<{ ok: boolean; message?: string }>(
        `${this.apiUrl}/eliminar_ahorro.php`,
        { id, uid }
      )
    );

    if (!response.ok) {
      throw new Error(response.message || 'No se pudo eliminar el ahorro');
    }
  }
}
=======
    ahorro: Omit<AhorroRecord, 'id' | 'uid' | 'displayName' | 'email' | 'createdAt'>,
  ): Promise<void> {
    const ahorroDocRef = doc(db, this.collectionName, id);

    await updateDoc(ahorroDocRef, {
      ...ahorro,
    });
  }

  async eliminarAhorro(id: string): Promise<void> {
    const ahorroDocRef = doc(db, this.collectionName, id);
    await deleteDoc(ahorroDocRef);
  }
}
>>>>>>> 42c540de330652ec431f9e2b396f53f98c7f2525
