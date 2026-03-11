import { Component, OnDestroy, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
} from 'chart.js';

import { BaseChartDirective } from 'ng2-charts';

import { AuthService } from '../../../core/services/auth.service';
import { AhorroService } from '../../../core/services/ahorro.service';
import { AhorroRecord } from '../../../core/models/ahorro-record.model';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineController,
  BarController,
);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private ahorroService = inject(AhorroService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private subscriptions = new Subscription();

  loading = true;
  errorMessage = '';

  userName = '';
  userEmail = '';

  totalRegistros = 0;
  totalAhorrado = 0;
  metasCumplidas = 0;
  metasPendientes = 0;
  ultimoRegistro = 'Sin registros';

  ahorros: AhorroRecord[] = [];

  // GRÁFICA DE LÍNEA
  lineChartLabels: string[] = [];
  lineChartData = [
    {
      data: [] as number[],
      label: '',
      fill: false,
      tension: 0.3,
      borderColor: '',
      backgroundColor: '',
    },
    {
      data: [] as number[],
      label: '',
      fill: false,
      tension: 0.3,
      borderColor: '',
      backgroundColor: '',
    },
  ];

  lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  lineChartType: 'line' = 'line';

  // GRÁFICA DE BARRAS
  barChartLabels: string[] = [];
  barChartData = [
    {
      data: [] as number[],
      label: '',
      backgroundColor: '',
    },
    {
      data: [] as number[],
      label: '',
      backgroundColor: '',
    },
  ];

  barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  barChartType: 'bar' = 'bar';

  ngOnInit(): void {
    const authInitSub = this.authService.authInitialized$.subscribe(async (initialized) => {
      this.ngZone.run(async () => {
        if (!initialized) {
          return;
        }

        const user = this.authService.currentUser;

        if (!user) {
          this.errorMessage = 'Debes iniciar sesión para ver la dashboard.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.userName = user.displayName ?? 'Sin nombre';
        this.userEmail = user.email ?? 'Sin correo';

        try {
          this.errorMessage = '';
          this.loading = true;
          this.cdr.detectChanges();

          this.ahorros = await this.ahorroService.obtenerAhorrosPorUsuario(user.uid);

          this.totalRegistros = this.ahorros.length;
          this.totalAhorrado = this.ahorros.reduce((acc, item) => acc + item.ahorroTotal, 0);
          this.metasCumplidas = this.ahorros.filter((item) => item.cumplioMeta).length;
          this.metasPendientes = this.ahorros.filter((item) => !item.cumplioMeta).length;

          if (this.ahorros.length > 0) {
            const createdAt = this.ahorros[0].createdAt as any;

            if (createdAt?.toDate) {
              this.ultimoRegistro = createdAt.toDate().toLocaleString('es-CO');
            }
          }

          this.prepararGraficas();
        } catch (error) {
          console.error('Error al cargar dashboard:', error);
          this.errorMessage = 'No fue posible cargar la información de la dashboard.';
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    });

    this.subscriptions.add(authInitSub);
  }

  prepararGraficas(): void {
    const ahorrosOrdenados = [...this.ahorros].reverse();

    this.lineChartLabels = ahorrosOrdenados.map(
      (item, index) => item.nombreAhorro || `Registro ${index + 1}`,
    );

    this.lineChartData = [
      {
        data: ahorrosOrdenados.map((item) => item.meta),
        label: 'Meta',
        fill: false,
        tension: 0.3,
        borderColor: 'red',
        backgroundColor: 'red',
      },
      {
        data: ahorrosOrdenados.map((item) => item.ahorroTotal),
        label: 'Estado actual',
        fill: false,
        tension: 0.3,
        borderColor: 'blue',
        backgroundColor: 'blue',
      },
    ];

    this.barChartLabels = ahorrosOrdenados.map(
      (item, index) => item.nombreAhorro || `Registro ${index + 1}`,
    );

    this.barChartData = [
      {
        data: ahorrosOrdenados.map((item) => item.meta),
        label: 'Meta',
        backgroundColor: 'red',
      },
      {
        data: ahorrosOrdenados.map((item) => item.ahorroTotal),
        label: 'Estado actual',
        backgroundColor: 'blue',
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
